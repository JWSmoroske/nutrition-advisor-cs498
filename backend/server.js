import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai'; // Changed import
import { insertEntity, updateEntity, deleteEntity, getAllEntities } from 'databaseAccess.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Modern initialization (v4.x syntax)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/api/chat', async (req, res) => {
    let { question } = req.body;
    let updatedQuestion = question + " Keep your answer less than 3 sentences long."
  if (!question) {
    return res.status(400).json({ error: 'Question is required.' });
  }

  try {
    // Updated method call
    const completion = await openai.chat.completions.create({
      model: "gpt-4-1106-preview", // Use valid model name
      messages: [{ role: "user", content: updatedQuestion }],
      max_tokens: 150,
      temperature: 0.7,
    });

    const responseMessage = completion.choices[0].message.content;
    res.json({ response: responseMessage });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Error getting response. Please try again.',
      details: error.message 
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});