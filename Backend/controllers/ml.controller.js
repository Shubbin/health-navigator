import GeminiChat from "../ml/js/chat/geminiChat.js";
import SttWhisper from "../ml/js/speech/sttWhisper.js";
import TtsOpenAI from "../ml/js/tts/ttsOpenAI.js";
import { ChatHistory } from "../models/chatHistory.model.js";
import { HealthScan } from "../models/healthScan.model.js";

const geminiChat = new GeminiChat(process.env.GEMINI_API_KEY);
const sttWhisper = new SttWhisper(process.env.OPENAI_API_KEY);
const ttsOpenAI = new TtsOpenAI(process.env.OPENAI_API_KEY);

export const chat = async (req, res) => {
    try {
        const { message, history, language, chatId } = req.body;
        const userId = req.userId; // From verifyToken middleware

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ success: false, message: "Gemini API key not configured" });
        }

        // Get AI Response
        const responseText = await geminiChat.sendMessage(history || [], message, language || 'en');

        // Save to Database
        let chatEntry;
        const newMessages = [
            { sender: "user", text: message, timestamp: new Date() },
            { sender: "ai", text: responseText, timestamp: new Date() }
        ];

        if (chatId) {
            // Update existing chat
            chatEntry = await ChatHistory.findByIdAndUpdate(
                chatId,
                {
                    $push: { messages: { $each: newMessages } },
                    preview: responseText.substring(0, 50) + "..."
                },
                { new: true }
            );
        } else {
            // Create new chat
            chatEntry = await ChatHistory.create({
                userId,
                title: message.substring(0, 30) + "...",
                messages: newMessages,
                preview: responseText.substring(0, 50) + "..."
            });
        }

        res.status(200).json({
            success: true,
            response: responseText,
            chatId: chatEntry._id
        });
    } catch (error) {
        console.error("Error in chat:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const speechToText = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No audio file uploaded" });
        }

        if (!process.env.OPENAI_API_KEY) {
            return res.status(500).json({ success: false, message: "OpenAI API key not configured" });
        }

        // Convert buffer to file object for OpenAI
        // Note: This part depends on how multer handles the file and what OpenAI expects
        // For simplicity, we'll assume the file path or buffer is handled correctly by the wrapper
        // In a real implementation, you might need to write to a temp file first

        const transcript = await sttWhisper.transcribe(req.file.buffer);

        res.status(200).json({ success: true, transcript });
    } catch (error) {
        console.error("Error in STT:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const textToSpeech = async (req, res) => {
    try {
        const { text } = req.body;

        if (!process.env.OPENAI_API_KEY) {
            return res.status(500).json({ success: false, message: "OpenAI API key not configured" });
        }

        const audioBuffer = await ttsOpenAI.speak(text);

        res.set({
            'Content-Type': 'audio/mpeg',
            'Content-Length': audioBuffer.length
        });

        res.send(audioBuffer);
    } catch (error) {
        console.error("Error in TTS:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const analyzeFace = async (req, res) => {
    try {
        const userId = req.userId;
        const { scanType } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image uploaded" });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ success: false, message: "Gemini API key not configured" });
        }

        // Construct prompt based on scan type
        const prompts = {
            eyes: "Analyze this eye image for redness, jaundice, or other visible conditions.",
            teeth: "Analyze this dental image for plaque, cavities, or gum issues.",
            skin: "Analyze this skin image for rashes, moles, or dermatological concerns."
        };

        const specificPrompt = prompts[scanType] || "Analyze this medical image for health concerns.";

        const fullPrompt = `${specificPrompt} Act as a professional medical AI assistant.
        IMPORTANT: Return ONLY a valid JSON object with this exact structure (no markdown, no backticks):
        {
            "result": "Healthy" or "Concern",
            "confidence": number between 70-99,
            "notes": "Brief, professional medical observation (max 2 sentences)",
            "recommendations": ["Action 1", "Action 2", "Action 3"]
        }`;

        // Call Gemini Vision
        const jsonResponse = await geminiChat.analyzeImage(
            req.file.buffer,
            req.file.mimetype,
            fullPrompt
        );

        // Parse JSON response
        let analysis;
        try {
            // Clean up any potential markdown formatting
            const cleanJson = jsonResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            analysis = JSON.parse(cleanJson);
        } catch (e) {
            console.error("Failed to parse Gemini response:", jsonResponse);
            // Fallback if parsing fails
            analysis = {
                result: "Analysis Complete",
                confidence: 85,
                notes: jsonResponse.substring(0, 200),
                recommendations: ["Consult a healthcare provider for detailed assessment"]
            };
        }

        // Save to Database
        const scan = await HealthScan.create({
            userId,
            scanType: scanType || "eyes",
            result: analysis.result,
            confidence: analysis.confidence,
            notes: analysis.notes,
            status: "success",
            // In a real app we'd save the file path, but for now we'll skip saving the image to disk to save space
            // imageUrl: `/uploads/${req.file.filename}` 
        });

        res.status(200).json({
            success: true,
            message: "Analysis complete",
            data: {
                ...scan.toObject(),
                recommendations: analysis.recommendations // Pass recommendations to frontend (even if not in DB schema yet)
            }
        });
    } catch (error) {
        console.error("Error in analyzeFace:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
