const express=require("express");
const router=express.Router();



//user routes
//index -user
router.get("/",(req,res)=>{
    res.send("get for users");
});

//show -user
router.get("/:id",(req,res)=>{
    res.send("get for user id");
});

//post-user
router.get("/",(req,res)=>{
    res.send("post for user");
});

//delete-user
router.delete("/:id",(req,res)=>{
    res.send("delete for user");
});


module.exports=router;