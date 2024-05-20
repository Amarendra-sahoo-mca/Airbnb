const express=require("express");
const app=express();
const port=8080;
const mongose=require("mongoose");
const path = require("path");

const eErrors=require("./utils/expressErrors.js");
const methodoverride=require("method-override");
const ejsMate=require("ejs-mate");
const cookieParser= require("cookie-parser");
const list=require("./routes/lists.js");
const review=require("./routes/reviews.js");

app.use(cookieParser());
app.set("views", path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(methodoverride("_method"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.engine('ejs',ejsMate);
app.use("/list",list);
app.use("/review",review);

main().then(()=>{
    console.log("connection establish");
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
//AsyncWarp function
function asyncWarp(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err));
    }
};

//cookies
app.get("/getcookies",(req,res)=>{
    res.cookie("greet","namaste");
    res.cookie("maidIn","India");
    res.send("sent you some cookies");
})
//greet test
app.get("/greet",(req,res)=>{
    let {maidIn ="africa"} =req.cookies;
    res.send(`item maid in ${maidIn}`);
})
//middleware
app.all("*",(req,res,next)=>{
    next( new eErrors(402,"page not found"));
})
app.use((err,req,res,next)=>{
    let {status=500,message}=err;
    res.status(status).render("lists/error.ejs", {message});
});

app.listen(port,()=>{
    console.log("listening at port : 8080");
})