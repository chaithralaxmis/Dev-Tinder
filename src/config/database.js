const mongoose = require("mongoose")

const connectDB = async() =>{
    await mongoose.connect("mongodb+srv://chaithra:chaithra@chaithra.q8gbb68.mongodb.net/?appName=devTinder")
}

module.exports = connectDB