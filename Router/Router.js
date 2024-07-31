const express=require('express');
const patientChartcontroler=require('../Controler/Chartcontroler/Chartcontroler');
const pdfControler=require('../Controler/PatientChart/Patientpdfdata/Patientpdfdata')

const router=express.Router();

router.post('/getpatient',patientChartcontroler.patient);
router.post('/getpdf',pdfControler.patientpdf)




module.exports=router;

