const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config();

async function listModels() {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        console.log("Using Key:", apiKey ? apiKey.substring(0, 5) + "..." : "NONE");

        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

        // Using native fetch in Node 22
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            const names = data.models
                .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent"))
                .map(m => m.name.replace('models/', ''));

            console.log("FINAL_LIST_START");
            console.log(JSON.stringify(names, null, 2));
            console.log("FINAL_LIST_END");
        } else {
            console.log("ERROR_RESPONSE:", JSON.stringify(data, null, 2));
        }

    } catch (error) {
        console.error("Scripts Error:", error);
    }
}

listModels();
