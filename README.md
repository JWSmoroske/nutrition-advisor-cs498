# Nutrition Advisor (CS498 Project)
This project consists of multiple components to create a web application that advises users on their nutrition habits. Users can enter the foods they have eaten, compiled in a database. They can see a summary of what they have eaten, ask for recommendations based on the nutrients they are missing, or request general nutritional advice from an AI assistant. 

<!--Current/Potential Directory Structure:
nutrition-app/
├── frontend/                  # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│
├── backend/                 # Node.js/Express Backend
│   ├── server.js (currently just has the openai stuff)
│   ├── package.json
│   ├── .env.example
│
├── scripts/                # Python Nutrition Analysis
│   ├── nutrition_analysis/
│   │   ├── processing/    # Image processing scripts
│   │   ├── main.py        # Main script entry point
│   │   └── utils.py       # Helper functions
│   ├── requirements.txt
│   
│
├── database/               # MySQL Database
│   ├── migrations/        # Database migration scripts
│   ├── seeds/             # Seed data (if needed)
│   └── schema.sql         # Initial database schema
│
├── .gitignore
└── README.md              # Main project documentation-->


# SETUP
Ensure Node.js is installed - available at the [official site](https://nodejs.org/en/download).

For client (frontend):
 - Run npm install:
        Installs all the necessary packages to run
 - Run npm start:
        Locally runs the frontend on port 3000

For server (backend):
 - Run npm install:
        Installs all the necessary packages to run
 - Create a .env file by doing "cp env.example .env"
 - Change the API key value with the actual value of the OpenAI API key in the .env file
 - Run npm start:
        Locally runs the backend on port 5000
 - Ensure the MySQL server is open under port 3306 & match login information in databaseAccess.js. [Note - Basic functionality remains with no DB Server. It allows for information to be saved.]

Frontend
 - Uses Node.js (I installed with v10.2.3)
 - React.js
 - Used react bootstrap to help with some designing components

Backend
 - Uses Node.js (I installed with v10.2.3)
 - Express.js

# NOTES
 - We are using a monorepo structure, an alternative could be separating the parts (frontend, backend, etc.) into microservices and their own repositories.

# FUTURE PLANS
 - As of now the client and server must run locally (alongside the MySQL Server) to communicate with each other. In the future, we would like to extend this to separate hosts.

