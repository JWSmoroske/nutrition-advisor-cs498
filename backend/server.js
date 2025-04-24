import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai'; // Changed import
import axios from 'axios'; // for image upload from user
import * as db from './databaseAccess.js'; // import in databaseAccess file to call functions

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

// rough outline of code for parsing nutrition facts uploaded by user
app.post("/api/upload", async (req, res) => 
  {
  const uploadImage = req.body.image;
  if (!uploadImage) 
  {
    return res.status(400).json({ success: false, message: "Missing uploaded image data" });
  }

  try 
  {
    // use axios to make a request for the uploaded user nutrition image
    const response = await axios.post("https://api.ocr.space/parse/image", null,
    {
      params: {
        apikey: "temp", // temp api key, has limited use 
        base64Image: uploadImage,
        language: "eng",
      },
    });

    const parsedData = response.data.ParsedResults?.[0]?.ParsedText || ""; // parse the text from the uploaded image
    const data = extractParsedData(parsedData); // call the extractParsedData function to get needed nutrition parameters
    const { name, calories, fat, cholesterol, sodium, carbohydrate, protein } = data; // set each parameter to information in data
    
    // check if the parameters for the INSERT statement is missing
    if (!name || !calories || !fat || !cholesterol || !sodium || !carbohydrate || !protein) 
    {
      return res.status(400).json({ success: false, message: "Missing required parameters to insert data" });
    }

    // insert data in directly to the db
    const insertData = await db.insertEntity(name, calories, fat, cholesterol, sodium, carbohydrate, protein);
    if (insertData) 
    {
      res.json({ success: true, message: "Successfully inserted data into database", data });
    } 
    else 
    {
      res.status(500).json({ success: false, message: "Failed to insert data into database" });
    }

  } 
  
  catch (error) 
  {
    res.status(500).json({ success: false, message: "Failed to parse data" });
  }
});

// function to extract the needed nutrition parameters from the parsed data
function extractParsedData(parsedData)
{
  const nutritionData = {
    name: "",
    calories: "",
    fat: "",
    cholesterol: "",
    sodium: "",
    carbohydrate: "",
    protein: ""
  };

  // use regex to parse through the data to get corresponding nutritional information
  const patterns = [
    { key: "name", pattern: /(?:Name):\s*(.*?)(?=\n|$)/i }, // difficult to extract name as it won't be on the nutrition label
    { key: "calories", pattern: /(?:Calories):\s*(\d+)/i },
    { key: "fat", pattern: /(?:Total Fat):\s*(\d+(\.\d+)?)\s*g/i },
    { key: "cholesterol", pattern: /(?:Cholesterol):\s*(\d+)\s*mg/i },
    { key: "sodium", pattern: /(?:Sodium):\s*(\d+)\s*mg/i },
    { key: "carbohydrate", pattern: /(?:Total Carbohydrate):\s*(\d+)\s*g/i },
    { key: "protein", pattern: /(?:Protein):\s*(\d+)\s*g/i }
  ];

  // loop through the pattern and match it to each key
  patterns.forEach(({ key, pattern }) => 
  {
    const match = parsedText.match(pattern);
    if (match) 
    {
      nutritionData[key] = match[1];  // set the matched data to the corresponding key
    }
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
