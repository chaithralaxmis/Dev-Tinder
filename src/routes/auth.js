const express = require("express")
const User = require('../models/user')
const bcrypt = require("bcrypt")
const { validateSignupData} = require("../utils/validation")


const authRouter = express.Router();

authRouter.post('/signup', async(req,res)=>{
    try {
        validateSignupData(req);
        const {firstName, lastName, emailID, password} = req.body;
        
        const passwordHash = await bcrypt.hash(password,10)
        console.log(req.body)
        const user = new User({
            firstName, lastName, emailID, password:passwordHash
        })
        await user.save()
        res.status(200).send("User addedd successfully")
    } catch (error) {
        res.status(400).send("Error Saving the data" + error.message)
    }
} )


authRouter.post('/login',async(req,res)=>{
    try {
        const {emailID,password} = req.body;
        const user = await User.findOne({emailID:emailID})
        if(!user){
            res.status("403").send("Invalid credentials")
        }
        const isPasswordValid = bcrypt.compare(password,user.password)
        if(isPasswordValid){
            const token = await user.getJWT();
            
            res.cookie("token", token, {
                httpOnly: true,
                secure: false,        // true in production (HTTPS)
                sameSite: "none"       // or "none" if different origin
            });
            
            res.status(200).json({type:"Sucess",data:token})
        }else{
            res.status(400).send("Invalid password")
        }
    } catch (error) {
        res.status(400).send("Error :", error.message)
    }
})


authRouter.post('/logout', (req,res)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now())
    })
    res.send("Logged out successfully!")
})


module.exports = authRouter