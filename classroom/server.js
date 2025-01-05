const express = require("express");
const app = express();
const users = require("./routes/users");
const posts = require("./routes/post");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const session = require("express-session");
const connectFlash=require("connect-flash");

const sessionOptions={
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now()+7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    },
}

app.use(session({sessionOptions }));
app.use(connectFlash());


app.get("/", (req, res) => {
  res.send("hii i am root");
});


//req count
// app.get("/recount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count=1;
//     }
//     res.send(`you send a request x times`);
// });

// app.get("/test",(req,res)=>{
//     res.send("test successful");
// });

// app.use(cookieParser("secretcode"));

// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("made-in","India",{signed:true});
//     res.send("signed cookie send");
// });

// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("verified");
// })

// app.get("/getcookies",(req,res)=>{
//     res.cookie("greet","hello");
//     res.send("sent you some cookies!");
// });

// app.use("/users",users);
// app.use("/posts",posts)

app.listen(3000, () => {
  console.log("server is listening on 3000 port");
});
