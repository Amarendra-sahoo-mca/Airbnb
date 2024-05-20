const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review =require("./reviews.js");
const ListSchema= new Schema({
    title:{
        type: String,
        required:true
    },
    description:{
        type: String,
        required:true
    },
    image:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzJIqOBEP7dmFp0GIyQ2K2ZQ1MvsT3qVZ4MVtxXoc2-SnLczU_rf2lJwUMqQ&s",
        set: (v)=> v===""? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzJIqOBEP7dmFp0GIyQ2K2ZQ1MvsT3qVZ4MVtxXoc2-SnLczU_rf2lJwUMqQ&s":v
    },
    price:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    review:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
});

ListSchema.post("findOneAndDelete", async(list)=>{
    if(list){
        await Review.deleteMany({_id: { $in: list.review}});
        console.log("related reviews also deleted");
    }
})
 const List=mongoose.model("List",ListSchema);

 module.exports=List;