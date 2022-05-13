
const app = require('./app')
const connectDatabase = require('./config/database')
const cloudinary = require('cloudinary')
const path = require("path")



// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

  //config
  const dotenv = require('dotenv')
dotenv.config({path:__dirname+'/.env'});

  //connect database
  connectDatabase();   

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  
  const server = app.listen(process.env.PORT||5000, () => {
      console.log(`Server is running on port: http://localhost:${process.env.PORT}`);
  })

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);
  
    server.close(() => {
      process.exit(1);
    });
  });