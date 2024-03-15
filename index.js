const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const chat = require("./models/chat.js");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError.js");

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

main()
.then((res)=>{
    console.log(res);
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/fakewhatsapp");
}

//  index route
app.get("/chats", asyncWrap(async(req,res)=>{
    let chats = await chat.find();
   // console.log(chats);
    res.render("index.ejs",{chats})
})
);

// new route
app.get("/chats/new",(req,res)=>{
        res.render("new.ejs");
});


/////////////////    Async Wrap function    /////////////////////

function asyncWrap(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err));
    };
};


//New - Show Route                      // error handling perform//
app.get("/chats/:id",asyncWrap(async(req,res,next)=>{
    let {id} = req.params;
    let Chat = await chat.findById(id);
    if(!chat){
        next(new ExpressError(404,"chat not found!"));
    }
    res.render("edit.ejs",{Chat});
})
);


//create route
app.post("/chats",async(req,res,next)=>{
  let {from,to, msg} = req.body;
  let newChat   = new chat({
    from: from,
    msg: msg,
    to: to,
    created_at:Date() });
 await newChat.save()
});

//  edit route
app.get("/chats/:id/edit",async(req,res)=>{
    let {id} = req.params;
    let Chat = await chat.findById(id);
    res.render("edit.ejs",{Chat});
});

// update route
app.put("/chats/:id",async(req,res)=>{
    let {id} = req.params; 
    let {msg: newMsg} = req.body;
    console.log(newMsg);
    let updateChat = await chat.findByIdAndUpdate(id,
        {msg:newMsg},
        {runValidators:true,  new:true});               // to print updated value..//

        console.log(updateChat);
        res.redirect("/chats")
    });

// DELETE route
app.delete("/chats/:id", async (req,res)=>{
    let {id} = req.params; 
    let deleteChat = await chat.findByIdAndDelete(id);
    console.log(deleteChat);
    res.redirect("/chats");
    console.log("deleted");
});

app.get("/",(req,res)=>{
res.send("server working..");
});


app.use((err,req,res,next)=>{
    let {status=500,message="error occured"} = err;
    res.status(status).send(message);
})

    app.listen(8080,()=>{
    console.log("app is listening on port 8080");
});




