const express=require("express");

//importing routes files 
const usersroute=require("./routes/users");
// const booksroute=require("./routes/books");

const port= 8081;

const app=express();

app.use(express.json());

app.get("/",(req,res)=>{
    res.status(200).json({
        message : "the server is up and running "
    })
})

app.use("/users",usersroute);
// app.use("/books",booksroute);


app.all("*",(req,res)=>{
    res.status(500).json({
        message : "does not exist"
    })
})

app.listen(port,()=>{
    console.log(`the node with express is running on port ${port}`);
})