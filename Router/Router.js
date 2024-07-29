const express=require('express');
const patientChartcontroler=require('../Controler/Chartcontroler/Chartcontroler');
const router=express.Router();

router.post('/patientcredentials',patientChartcontroler.patient);



module.exports=router;

