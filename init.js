const  mongoose = require("mongoose");
const chat = require("./models/chat");


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

let allChats = [
    {
        from:"neha",
        to:"priya",
        msg:"hello can we go for lunch after class.",
        created_at: new Date(),
    },
    {
        from:"priya",
        to:"neha",
        msg:"hello , yes!!.",
        created_at: new Date(),
    },
    {
        from:"neha",
        to:"priya",
        msg:"hi, can you give me your notes.",
        created_at: new Date(),
    },
    {
        from:"priya",
        to:"neha",
        msg:"sorry, nuut i have my class test.",
        created_at: new Date(),
    },
    {
        from:"neha",
        to:"priya",
        msg:"okkk, no worries!!!!",
        created_at: new Date(),
    }
];

chat.insertMany(allChats);










