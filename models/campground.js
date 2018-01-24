var mongoose = require("mongoose");

//schema setup
var camppgroundSchema = new mongoose.Schema({
   name: String,
   price: String,
   image: String,
   description: String,
   address: String,
   lat:Number,
   lng:Number,
   author: {
         id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
   comments   : [
               {
                  type: mongoose.Schema.Types.ObjectId,
                  ref : "Comment"
               }
         ]
});

module.exports = mongoose.model("Campground",  camppgroundSchema);