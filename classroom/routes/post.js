const express=require("express");
const router=express.Router();

//index-posts
router.get("/",(req,res)=>{
    res.send("for posts");
});

//show-posts
router.get("/:id",(req,res)=>{
    res.send("for posts");
});

//post -posts
router.get("/",(req,res)=>{
    res.send("for posts");
});

//delete-posts
router.get("/:id",(req,res)=>{
    res.send("for posts");
});

module.exports=router;