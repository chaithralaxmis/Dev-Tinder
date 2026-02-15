const express = require("express")
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router()
const User = require("../models/user")
const USER_SAFE_DATA = ["firstName","lastName","age","skills","photoURL","designation","about","yearOfExp"]
userRouter.get("/requests/recieved",userAuth,async(req,res)=>{
    try {
        let loggedInUser = req.user;
        console.log(loggedInUser)
        let requests = await ConnectionRequest.find({
            toUserID:loggedInUser._id,
            status:"interested"
        }).populate("fromUserID",USER_SAFE_DATA)
        res.status(200).json({type:"sucess",data:requests})
    } catch (error) {
        res.status(400).send("Error"+error.message)
    }
})


userRouter.get("/requests/sent",userAuth,async(req,res)=>{
    try {
        let loggedInUser = req.user;
        console.log(loggedInUser)
        let requests = await ConnectionRequest.find({
            fromUserID:loggedInUser._id,
            status:"interested"
        }).populate("fromUserID",USER_SAFE_DATA)
        res.status(200).json({type:"sucess",data:requests})
    } catch (error) {
        res.status(400).send("Error"+error.message)
    }
})


userRouter.get("/connections",userAuth,async(req,res)=>{
    try {
        const loggedInUser = req.user;
        const requests = await ConnectionRequest.find({
            $or:[
                {
                    fromUserID:loggedInUser._id
                },
                {
                     toUserID:loggedInUser._id
                }
            ],
            status:"accepted"
        }).populate("fromUserID",USER_SAFE_DATA).populate("toUserID",USER_SAFE_DATA)
        data = requests.map((row)=>{
            if(row.fromUserID._id.toString() === loggedInUser._id.toString()){
                return row.toUserID
            }
            return row.fromUserID
    })
        res.status(200).json({type:"success",data:data})
    } catch (error) {
        res.status(400).send(error.message)
    }
})


userRouter.get("/feed",userAuth,async(req,res)=>{
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {fromUserID:loggedInUser._id},
                {toUserID:loggedInUser._id}
            ],   
        }).select(["fromUserID","toUserID"])

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10
        const skip = (page-1)*limit

        const hideUserFromFeed = new Set()
        connectionRequests.forEach(req=>{
            hideUserFromFeed.add(req.fromUserID.toString());
            hideUserFromFeed.add(req.toUserID.toString());
        })
        
        const users = await User.find({
            $and:[
                {
                    _id:{ $nin : Array.from(hideUserFromFeed)}
                },{
                    _id :{$ne : loggedInUser._id}
                }
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit)

        res.status(200).json({type:"success",data:users})
    } catch (error) {
        res.status(400).send("Error"+error.message)
    }
})


module.exports = userRouter