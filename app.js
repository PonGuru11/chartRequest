const express=require('express');
const bodyparser=require('body-parser');
const cors=require('cors');
const PORT=5500;
require('dotenv').config();

const app=express();
app.use(express.json());
app.use(bodyparser.json());
app.use(cors());

const patientrouter=require('./Router/Router')

app.get('/',(req,res)=>{
    res.send("Raintree Integration")
})

app.use('/api',patientrouter)

app.listen(PORT,()=>console.log("server running on:",PORT))
