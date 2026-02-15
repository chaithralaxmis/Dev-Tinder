const express = require("express")
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest =  require("../models/connectionRequest.js")
const User = require("../models/user.js")
const requestRouter = express.Router()

requestRouter.post("/send/:status/:toUserID",userAuth,async(req,res)=>{
    try {
        const fromUserID = req.user._id
        const toUserID = req.params.toUserID
        const status =  req.params.status;
        const allowedStatus = ['ignored','interested']
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Invalid status type :"+status})
        }


        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[
                {fromUserID,toUserID},
                {fromUserID:toUserID,toUserID:fromUserID}
            ],
        })

        const toUser = await User.findById(toUserID)
        if(!toUser) throw new Error({message:"User not found"});
        
        if(existingConnectionRequest){
            return res.status(400).send({message:"Connection request already exists!"})
        }

        const connectionRequest = new ConnectionRequest({
            fromUserID,
            toUserID,
            status
        })
        await connectionRequest.save();
        res.status(200).send({type:"sucess",message:req.user.firstName + 'is' + status +'in' + toUser.firstName})
    } catch (error) {
        res.status(400).send("Error : "+error.message)
    }
})


requestRouter.post("/review/:status/:requestID",userAuth,async(req,res)=>{
    try {
        let loggedInUser = req.user;
        let {status,requestID} = req.params;
        const allowedStatus = ['accepted','rejected']
        if(!allowedStatus.includes(status)){
            throw new Error("Invalid status")
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id:requestID,
            toUserID:loggedInUser._id,
            status:"interested"
        })

        console.log(connectionRequest)

        if(!connectionRequest) throw new Error("Connection request not found");
        connectionRequest.status = status;
        await connectionRequest.save()
        res.status(200).send({type:"success",data:connectionRequest})
    } catch (error) {
        res.status(400).send("Error:"+error.message)
    }
})


module.exports =  requestRouter