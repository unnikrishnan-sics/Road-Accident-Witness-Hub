const { GoogleGenerativeAI } = require('@google/generative-ai');

// @desc    Search for first aid instructions
// @route   GET /api/firstaid/search
// @access  Public
exports.searchFirstAid = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({ success: false, error: 'Query parameter "q" is required' });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `You are a medical first aid assistant. Provide a concise, structured first aid guide for the following symptom or injury: "${q}".
        
        The response must be a JSON object with the following fields:
        1. "title": A clear title for the condition.
        2. "immediateSteps": An array of strings representing immediate life-saving steps.
        3. "dos": An array of strings of what to do.
        4. "donts": An array of strings of what NOT to do.
        5. "whenToSeekHelp": A short description of when professional medical help is mandatory.
        
        Keep it professional, clear, and easy to read during an emergency. 
        Return ONLY valid JSON. Do not use markdown formatting.`;

        console.log(`[FirstAid] Searching for: ${q}`);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text().trim();

        // Cleanup markdown if present
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            const data = JSON.parse(text);
            return res.status(200).json({
                success: true,
                data: data
            });
        } catch (parseError) {
            console.error("Failed to parse Gemini JSON:", text);
            return res.status(500).json({
                success: false,
                error: 'AI analysis failed to produce valid data',
                raw: text
            });
        }

    } catch (error) {
        console.error("First Aid Search Error:", error);
        return res.status(500).json({
            success: false,
            error: 'AI service unavailable'
        });
    }
};
