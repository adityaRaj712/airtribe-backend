const express = require("express");
const { errorHandler } = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
const mysql = require("mysql");
const con = mysql.createConnection({
    host:'localhost',
    user:"root",
    password:"",
    database:"courses_database"
})

//To check if connection is there or not 
// con.connect((err)=>{
//     if(err){
//         console.warn("Error");
//     }
//     else{
//         console.warn("Connected");
//     }
// })




const app = express();


const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/courses", require("./routes/coursesRoute"));
app.use("/api/users", require("./routes/userRoutes"));
app.use(errorHandler);

app.post("/api/courses", (req, res) =>{
    console.log("Post request send ", req.method);
    res.end();
})

app.listen(port, () =>{
     console.log(`Server on the port ${port}`);
})