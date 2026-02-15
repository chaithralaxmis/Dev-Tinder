const validator = require("validator")

const validateSignupData = (req) =>{
    console.log(req.body,"body")
    const {firstName,lastName, emailID, password} = req.body
    console.log(firstName,lastName,emailID, password)
    console.log()
    if(!firstName || !lastName){
        console.log(1)
        throw new Error("Name is not valid!")
    }else if(firstName.length<4 || firstName.length > 50){
        console.log(2)
        throw new Error("First Name should be between 4-50char")
    }else if(!emailID){
        console.log(3)
        throw new Error("EmailID is not valid!")
    }else if(!validator.isEmail(emailID)){
        console.log(4)
        throw new Error("EmailID is not valid!")
    }else if(!validator.isStrongPassword(password)){
        console.log(5)
        throw new Error("Please enter a strong password")
    }else{
        console.log(6,"iuhu")
    }
}

const validateProfileEditData = (req) =>{
    const allowedEditFields = ['firstName','lastName', "age","photoURL","gender","age","about","skills","designation","cloudinaryID"]
    const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field));
    return isEditAllowed 
}


const validateProfilePassword = (req) =>{
    const {password} = req.body;
    if(!password) throw new Error("Password is missing");
    if(!validator.isStrongPassword(password)) throw new Error("Please enter a strong password");
   
}

module.exports = {validateSignupData,validateProfileEditData,validateProfilePassword}