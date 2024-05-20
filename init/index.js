const mongose=require("mongoose");
const initData=require("./data.js");
const List=require("../models/list.js");

main().then(()=>{
    console.log("connection establish");
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB= async ()=>{
  await  List.deleteMany({});
  await List.insertMany(initData.data);
  console.log("data was innitialize");
}

initDB();