import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app = express();

const whiteList = ['http://localhost:5000'];

app.use(
    cors({
          origin:function(origin:any, callback){
            if(!origin || whiteList.includes(origin)){
                callback(null, true)
            }else{
                callback(new Error("Not allowed by CORS"))
            }

        },
        methods:["GET", "POST", "PUT", "DELETE", "OPTIONS", "PUT"],
        allowedHeaders:["Content-Type", "Authorization"],
        credentials:true
    })
)

app.use(express.json());


// routes
app.use("/auth", )

app.listen(5000, () => {
    console.log("Server on port: ", whiteList);
    
})

