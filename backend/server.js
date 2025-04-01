import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai'; // Changed import
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
