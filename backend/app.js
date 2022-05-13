const express = require('express')
const cors = require('cors')
const path = require("path")


const fileUpload = require('express-fileupload')
const app = express();
const bodyParser = require('body-parser')

const cookiParser = require('cookie-parser')
const errorMiddleware = require('./middleware/error')
const dotenv = require('dotenv')
dotenv.config({
  path: __dirname + '/.env'
});


const product = require('./routes/productRoute')
const user = require('./routes/userRoute')
const order = require('./routes/orderRoute')
const cart = require('./routes/cartRoute')



app.use(express.json({
  limit: '50mb'
}))
app.use(cookiParser())
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit: 50000
}))
app.use(fileUpload())
app.use(cors())
//Middleware error hander 

app.use("/api/v1", product)
app.use("/api/v1", user)
app.use("/api/v1", order)
app.use("/api/v1", cart)


app.all('/', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next()
});
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});


app.use(errorMiddleware)

module.exports = app