require("dotenv").config();
const express = require('express');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 3000;
const connectDB = require('./config/connectionDB'); 

// Middleware pour parser le JSON AVANT les routes
app.use(express.json());
app.use(cors()); // Middleware pour gérer les CORS
// Routes
app.use("/recipe", require('./routes/recipe') );
app.use("/user", require('./routes/user') );
// Connect to MongoDB   
connectDB()
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
