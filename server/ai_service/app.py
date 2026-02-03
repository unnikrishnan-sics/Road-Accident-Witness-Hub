import os
import easyocr
from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np

app = Flask(__name__)
CORS(app)

# Initialize Reader (downloads model on first run)
# 'en' for English. GPU=False for wider compatibility unless configured.
reader = easyocr.Reader(['en'], gpu=False)

    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    file = request.files['image']
    
    # Read image into numpy array
    try:
        file_bytes = np.frombuffer(file.read(), np.uint8)
        original_image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

        if original_image is None:
            return jsonify({'error': 'Invalid image format'}), 400

        # --- MULTI-PASS STRATEGY ---
        # We will try to read from different versions of the image to maximize chances
        
        # 1. Original
        images_to_try = [original_image]
        
        # 2. Grayscale
        gray = cv2.cvtColor(original_image, cv2.COLOR_BGR2GRAY)
        images_to_try.append(gray)
        
        # 3. Contrast Enhanced & Thresholded (Binary)
        # This helps separate black text from white background forcefully
        gray_enhanced = cv2.detailEnhance(original_image, sigma_s=10, sigma_r=0.15)
        gray_enhanced = cv2.cvtColor(gray_enhanced, cv2.COLOR_BGR2GRAY)
        _, binary = cv2.threshold(gray_enhanced, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        images_to_try.append(binary)

        all_detections = []
        
        print("--- MULTI-PASS OCR START ---")
        for i, img in enumerate(images_to_try):
            print(f"Pass {i+1}...")
            results = reader.readtext(img)
            for (bbox, text, prob) in results:
                # Clean text: Remove spaces and non-alphanumeric
                clean_text = ''.join(e for e in text if e.isalnum()).upper()
                
                # Heuristic: License plates are usually 6-12 chars long
                if len(clean_text) > 4 and prob > 0.3:
                    print(f"  Found: '{clean_text}' (Conf: {prob:.2f})")
                    all_detections.append((clean_text, prob))

        # --- SELECTION LOGIC ---
        # Sort by confidence
        all_detections.sort(key=lambda x: x[1], reverse=True)
        
        # Pick the best candidate that looks like a number plate (contains numbers and letters)
        best_text = ""
        for text, prob in all_detections:
            # Check if it has at least one number and one letter
            if any(c.isalpha() for c in text) and any(c.isdigit() for c in text):
                best_text = text
                break
        
        # Fallback: If no mixed alphanumeric found, just take the highest confidence text
        if not best_text and all_detections:
            best_text = all_detections[0][0]

        print(f"Selected Best: {best_text}")

        return jsonify({
            'success': True,
            'text': best_text,
            'details': [{'text': t, 'confidence': p} for (t, p) in all_detections]
        })

    except Exception as e:
        print(f"Error processing image: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("Starting AI Service on port 5001...")
    app.run(host='0.0.0.0', port=5001, debug=True)
