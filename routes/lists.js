const express=require("express");
const router=express.Router();
const List =require("../models/list.js");

//AsyncWarp function
function asyncWarp(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err));
    }
};

//index route
router.get("/",asyncWarp(async (req,res)=>{
    let datas=await List.find();
   res.render("lists/index.ejs",{datas});
}));
//new form route
router.get("/new",(req,res)=>{
    res.render("lists/new.ejs");
})
//insert route
router.post("/",asyncWarp( async (req,res,next)=>{
    let {title,desc,image,price,location,country}=req.body;
    let newList= new List({
        title: title,
        description:desc,
        image:image,
        price:price,
        location:location,
        country:country
    });
    
   await newList.save();
    res.redirect("/list");
}));
//update form ROUTE 
router.get("/:id/edit",asyncWarp( async(req,res)=>{
    let {id}=req.params;
    let data=await List.findById(id);
    res.render("lists/edit.ejs" , {data});
}));
//update in DB
router.put("/:id",asyncWarp(async(req,res)=>{
    let {id}=req.params;
    let {title: t,desc:d,image:i,price:p,location:l,country:c}=req.body;
   await List.updateOne({_id:id},{
        title:t,
        description:d,
        image:i,
        price:p,
        location:l,
        country:c
    })
    res.redirect(`/list/${id}`);
}));

//delete ROUTE
router.delete("/:id",asyncWarp(async(req,res)=>{
    let {id}=req.params;
   let deleteData= await List.findByIdAndDelete(id);
   console.log(deleteData);
    res.redirect("/list");
}));

//show route
router.get("/:id",asyncWarp( async (req,res)=>{
    let {id}=req.params;
    let info=await List.findById(id).populate("review");
    res.render("lists/profile.ejs",{info});
}));

module.exports = router;
