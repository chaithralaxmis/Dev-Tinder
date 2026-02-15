const express = require("express")
const {userAuth} = require("../middlewares/auth");
const { validateProfileEditData, validateProfilePassword } = require("../utils/validation");

const profileRouter = express.Router()

profileRouter.get("/view",userAuth, async(req,res)=>{
    try {
        const user = req.user;
        res.status(200).send(user)
    } catch (error) {
        res.status(400).send("Error : "+error.message)
    }
})


profileRouter.patch("/edit",userAuth,async(req,res)=>{
    try {
        if(!validateProfileEditData) throw new Error("Invalid Edit Request");
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key])
        await loggedInUser.save()
        res.json({message:"Profile updated successfully",data:loggedInUser})
    } catch (error) {
        res.status(400).send("Error : "+error.message)
    }
})


profileRouter.patch("/password",userAuth,async(req,res)=>{
    try {
        validateProfilePassword(req);
        req.user.password = req.body.password;
        req.user.save()
        res.status(200).send({type:"sucess",message:"Password changed sucessfully"})
    } catch (error) {
        res.status(400).send("Error : " + error.message)
    }
})





module.exports = profileRouter