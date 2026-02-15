const express = require('express')
const connectDB = require('./config/database')
const cookieParser = require('cookie-parser')
const cors = require("cors")

const app = express()
app.use(cookieParser())
app.use(express.json())
// app.use(cors())
app.use(cors({
  origin: "http://localhost:5173",  // EXACT frontend URL
  credentials: true
}));


const authRouter = require("./routes/auth")
const profileRouter = require("./routes/profile")
const requestRouter = require("./routes/requests")
const userRouter = require('./routes/user')

app.use("/",authRouter)
app.use("/profile",profileRouter)
app.use("/request",requestRouter)
app.use("/user",userRouter)



connectDB().then(()=>{
    console.log("Database connection established...")
    app.listen(7777,()=>{
    console.log("Server is sucessfully listening on port 7777")
})
}).catch(err=>{
    console.error("Database connection failed!!",err)
})

