const express=require("express");
const router=express.Router();
const Review =require("../models/reviews.js");
const List =require("../models/list.js");

//AsyncWarp function
function asyncWarp(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err));
    }
};
//add review route form
router.get("/:id",(req,res)=>{
    let {id}=req.params;
    res.render("lists/rForm.ejs",{id});
});
//save review route
router.post("/save/:id",asyncWarp(async(req,res)=>{
    let {id}=req.params;
    let list=await List.findById(id);
    let {rating:r,comment:cmt}=req.body;
    let review= new Review(
        {
            comment:cmt,
            rating:r,
        }
    );
    await review.save();
    list.review.push(review);
    await list.save();
    console.log("review saved sucessfulley");
   
    res.redirect(`/list/${id}`);
}));
//delete review route
router.delete("/:lid/:rid",asyncWarp(async(req,res)=>{
    let {lid,rid}=req.params;
    await List.findByIdAndUpdate(lid, {$pill: {review:rid}});
    await Review.findByIdAndDelete(rid);
    res.redirect(`/list/${lid}`);
}));

module.exports = router;