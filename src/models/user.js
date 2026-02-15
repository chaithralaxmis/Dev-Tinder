const mongoose = require("mongoose")
const validator = require("validator")
const jwt = require("jsonwebtoken")
const userSchema = mongoose.Schema({
    firstName: {
        type:String,
        minLength:4,
        maxLength:50,
        required:true
    },
    lastName:{
        type:String
    },
    emailID:{
        type:String,
        lowecase:true,
        required:true,
        unique:true,
        index:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address: " + value)
            }
        }
    },
    password:{
        type:String,
         validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password")
            }
        }
    },
    gender:{
        type:String,
        enum:{
            values:['male','female','other'],
            message:`{VALUE} is not a valid gender type`
        },
    },
    age:{
        type:Number
    },
    yearOfExp:{
        type:Number
    },
    skills:{
        type:Array,
        default:[]
    },
    about:{
        type:String
    },
    designation:{
        type:String
    },
    photoURL:{
        type:String
    },
    cloudinaryID:{
        type:String
    },
    githubURL:{
        type:String
    },
    linkedInURL:{
        type:String
    },
    website:{
        type:String
    }
},{
    timestamps:true
})





userSchema.methods.getJWT = async function(){
    const token = await jwt.sign({_id:this.id},"DEV@Tinder2026",{
        expiresIn:"7d"
    })
    return token
}

const User = mongoose.model("User",userSchema)

module.exports = User