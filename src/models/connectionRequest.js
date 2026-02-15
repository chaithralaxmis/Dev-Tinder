const mongoose = require("mongoose");
const connectionRequestSchema =  new mongoose.Schema({
    fromUserID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    toUserID:{
        type: mongoose.Schema.Types.ObjectId,
        required:true

    },
    status:{
        type:String,
        enum:{
           values : ['ignored','interested','accepted','rejected'],
           message:`{VALUE} IS INCORRECT TYPE`
        },
        required:true
    }
},
{
    timestamps:true
})

connectionRequestSchema.pre("save",function(next){
    const connectionRequest = this;
    if(connectionRequest.fromUserID.equals(connectionRequest.toUserID)){
        throw new Error("Cannot send connection request to yourself!")
    }
})

connectionRequestSchema.index({fromUserID:1,toUserID:1})
const ConnectionRequest = new mongoose.model("ConnectionRequest",connectionRequestSchema)

module.exports = ConnectionRequest