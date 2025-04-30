import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai'; // Changed import
import axios from 'axios'; // for image upload from user
import multer from 'multer';              // Multer middleware for multipart/form-data :contentReference[oaicite:5]{index=5}
import fs from 'fs';
import FormData from 'form-data';
import * as db from './databaseAccess.js'; // import in databaseAccess file to call functions

dotenv.config();

if (!fs.existsSync('images')) fs.mkdirSync('images');

// Disk storage engine: control destination & filename :contentReference[oaicite:6]{index=6}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'images/'),
  filename:    (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${unique}-${file.originalname}`);
  }
});
const upload = multer({ storage });

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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

// rough outline of code for parsing nutrition facts uploaded by user
app.post(
  '/api/upload',
  upload.single('imageFile'),             // handle multipart upload :contentReference[oaicite:10]{index=10}
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    try {
      // Convert image to base64 with proper prefix
      const buffer = fs.readFileSync(req.file.path);
      const base64Image = `data:${req.file.mimetype};base64,${buffer.toString('base64')}`;
      
      // Create form-data for OCR.space
      const form = new FormData();
      form.append('base64Image', base64Image);
      form.append('language', 'eng');
      form.append('OCREngine', '2');

      // Send to OCR.space with proper headers
      const ocr = await axios.post(
        'https://api.ocr.space/parse/image',
        form,
        {
          headers: {
            ...form.getHeaders(),
            apikey: process.env.OCR_SPACE_KEY
          }
        }
      );

      // 4) Extract nutrition facts (your existing function)
      console.log(ocr.data.ParsedResults[0].ParsedText);
      const data = extractParsedData(ocr.data.ParsedResults[0].ParsedText);
      const { name, calories, fat, cholesterol, sodium, carbohydrate, protein } = data;

      if (![name, calories, fat, cholesterol, sodium, carbohydrate, protein].every(v => v != null)) {
        return res.status(400).json({ success: false, message: 'Incomplete nutrition data' });
      }

      // 5) Insert into DB
      //const inserted = await db.insertEntity(name, calories, fat, cholesterol, sodium, carbohydrate, protein);
      //if (!inserted) throw new Error('DB insert failed');
      console.log(data);
      res.json({ success: true, data });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// function to extract the needed nutrition parameters from the parsed data
function extractParsedData(parsedText) {
  const nutritionData = {
    name: "",
    calories: "",
    fat: "",
    cholesterol: "",
    sodium: "",
    carbohydrate: "",
    protein: ""
  };

  // Improved patterns with better line handling and value capture
  const patterns = [
    { 
      key: "calories",
      // Matches "Calories" at start of line followed by number
      pattern: /^\s*Calories\s+(\d+)/im 
    },
    { 
      key: "fat",
      // Handles optional "Total" and different spacing
      pattern: /^\s*(?:Total\s+)?Fat\s+(\d+(?:\.\d+)?)\s*g/im 
    },
    { 
      key: "cholesterol",
      // Matches cholesterol value with mg
      pattern: /^\s*Cholesterol\s+(\d+)\s*mg/im 
    },
    { 
      key: "sodium",
      // Captures sodium value
      pattern: /^\s*Sodium\s+(\d+)\s*mg/im 
    },
    { 
      key: "carbohydrate",
      // Handles "Total Carbohydrate" or "Carbohydrate"
      pattern: /^\s*(?:Total\s+)?Carbohydrate\s+(\d+)\s*g/im 
    },
    { 
      key: "protein",
      // Simple protein match
      pattern: /^\s*Protein\s+(\d+)\s*g/im 
    }
  ];

  // Split text into lines and process each line individually
  parsedText.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    
    patterns.forEach(({ key, pattern }) => {
      const match = trimmedLine.match(pattern);
      if (match) {
        // Only update if not already found
        if (!nutritionData[key]) {
          nutritionData[key] = match[1];
        }
      }
    });
  });

  return nutritionData;
}

// code added for backend communication with database
// insert data in for a user
app.post('/api/add', async(req, res) =>
  {
      const { name, calories, fat, cholesterol, sodium, carbohydrate, protein } = req.body;
  
      if (!name || !calories || !fat || !cholesterol || !sodium || !carbohydrate || !protein)
      {
          res.json({ message: "Missing required parameters to insert data"});
      }
  
      const insertData = await db.insertEntity(name, calories, fat, cholesterol, sodium, carbohydrate, protein);
      if (insertData)
      {
          res.json({ message: "Sucessfully entered data"});
      }
      else
      {
          res.json({ message: "Failed to enter data"});
      }
  });

// delete data associated with a user
app.delete('/api/delete/:id', async (req, res) =>
  {
      const { id } = req.params;
      
      const deleteData = await db.deleteEntity(id);
      if (deleteData)
      {
          res.json({ message: "Successfully deleted data associated with id: ", id });
      }
      else
      {
          res.json({ message: "Failed to delete data associated with id: ", id });
      }
  });

// update data for a user with a specified id
app.put('/api/update/:id', async (req, res) =>
  {
      const { id } = req.params;
      const { columnid, value } = req.body;
  
      if (!column|| !value)
      {
          res.json({ message: "Missing required parameters to update information"});
      }
  
      const updateInfo = await db.updateEntity(id, columnid, value);
  
      if (updateInfo)
      {
          res.json({ message: "Successfuly updated data for id: ", id});
      }
      else
      {
          res.json({ message: "Failed to update data for id: ", id});
      }
  });

// retrieve all data in the database
app.get('/api/retrieve', async (req, res) =>
  {
      const getAllData = await db.getAllEntities();
      if (getAllData)
      {
          console.log("Sucessfully retrieved all data from database");
  
          // example of calculations with data
          let calorieTotal = 0;
          const dailyAverage = 2500;
          let neededCalories;
        
          // loop through all items in database
          getAllData.forEach(item => 
          {
              calorieTotal += item.calories;
          });
  
          neededCalories = calorieTotal - dailyAverage;
  
          if (neededCalories < 0)
          {
              neededCalories = 0;
          }
  
          res.json(getAllData, calorieTotal, neededCalories); // have a calculation for total calories as well as needed calories
      }
      else
      {
          res.json({ message: "Failed to retrieve data from the database"});
      }
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});