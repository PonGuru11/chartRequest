// const express = require('express');
// const patientChart = require('../PatientChart/patientChart');
// const Cryptr = require('cryptr');
// const downloadChartFile = require("../../myDownloads/Chartpdf");
// const downloadLedgerFile = require("../../myDownloads/Ledgerpdf");

// require('dotenv').config()

// const { patientChartLogger } = require('../../Logger/ChartLogger')

// exports.patient = async (req, res) => {
//     try {
//         const { first_name, last_name,dob,ssn,gender,before_date,after_date,document_type,patient_ID,request_id} = req.query;

//         if (!dob) {
//             patientChartLogger.error( "Patient DateOfBirth not Updated...");
//             return res.status(400).json({ message: "Patient DateOfBirth not Updated..." });
//         }else{
//             patientChartLogger.info( `Patient ${dob} Updated...`);
//         }

//         if (!first_name) {
//             patientChartLogger.error("Patient FirstName not Updated...");
//             return res.status(400).json({ message: "Patient FirstName not Updated..." });
//         }else{
//             patientChartLogger.info(`Patient ${first_name} Updated...`);
//         }

//         if (!last_name) {
//             patientChartLogger.error("Patient LastName not Updated...");
//             return res.status(400).json({ message: "Patient LastName not Updated..." });
//         }else{
//             patientChartLogger.info(`Patient ${last_name} Updated...`);
//         }

//         if (!document_type) {
//             patientChartLogger.error("Patient Documenttype not Updated...");
//             return res.status(400).json({ message: "Patient document type not Updated..." });
//         }else{
//             patientChartLogger.info(`Patient ${document_type}  Updated...`);
//         }

//         const cryptr = new Cryptr('myTotallySecretKey', { encoding: 'base64', pbkdf2Iterations: 10000, saltLength: 10 });
//         const encryptedUserName = cryptr.encrypt(process.env.USERNAMEA);
//         const encryptedUserPassword = cryptr.encrypt(process.env.PASSWORD);
//         const patientCredential = {
//             encryptedUserName,
//             encryptedUserPassword,
//             first_name,
//             last_name,
//             dob,
//             ssn,
//             gender,
//             before_date,
//             patient_ID,
//             after_date,
//             document_type,
//             request_id
//         };
//         res.status(201).json({message:"credentials updated",data:patientCredential})
//         if (document_type) {
//             await patientChart(
//                 encryptedUserName, 
//                 encryptedUserPassword, 
//                 first_name, 
//                 last_name,
//                 dob,
//                 ssn,
//                 gender,
//                 before_date,
//                 after_date,
//                 document_type,
//                 patient_ID,
//                 request_id);
            
//         }
//         if (document_type === 'Chart') {
//             await downloadChartFile(first_name, last_name, res);
//         } else if (document_type === 'Ledger') {
//             await downloadLedgerFile(res);
//         } else {
//             return res.status(400).json({ message: "Invalid document_type provided." });
//         }

//     } catch (error) {
//         res.status(500).json({ message: "Patient Credentials Posting error found", error });
//         patientChartLogger.error("Patient Credentials Posting error found");
//     }
// }


// const express = require('express');
// const Cryptr = require('cryptr');
// const patientgetpdf = require('../PatientChart/Patientpdfdata/Patientpdfdata');
// require('dotenv').config();
// const { patientChartLogger } = require('../../Logger/ChartLogger');

// exports.patient = async (req, res) => {
//     try {
//         const { first_name, last_name, dob, ssn, gender, before_date, after_date, document_type, patient_ID, request_id } = req.body;

       
//         if (!dob) {
//             patientChartLogger.error("Patient DateOfBirth not Updated...");
//             return res.status(400).json({ message: "Patient DateOfBirth not Updated..." });
//         }
//         if (!first_name) {
//             patientChartLogger.error("Patient FirstName not Updated...");
//             return res.status(400).json({ message: "Patient FirstName not Updated..." });
//         }
//         if (!last_name) {
//             patientChartLogger.error("Patient LastName not Updated...");
//             return res.status(400).json({ message: "Patient LastName not Updated..." });
//         }
//         if (!document_type) {
//             patientChartLogger.error("Patient Documenttype not Updated...");
//             return res.status(400).json({ message: "Patient document type not Updated..." });
//         }

//         const cryptr = new Cryptr('myTotallySecretKey', { encoding: 'base64', pbkdf2Iterations: 10000, saltLength: 10 });
//         const encryptedUserName = cryptr.encrypt(process.env.USERNAMEA);
//         const encryptedUserPassword = cryptr.encrypt(process.env.PASSWORD);
//         const patientCredential = {
//             encryptedUserName,
//             encryptedUserPassword,
//             first_name,
//             last_name,
//             dob,
//             ssn,
//             gender,
//             before_date,
//             patient_ID,
//             after_date,
//             document_type,
//             request_id
//         };

        
//         res.status(201).json({
//             Statuses: true,
//             Message: "Patient credentials updated",
//             request_id: `${request_id}`
//         });

//         (async () => {
//             try {
//                 await patientgetpdf(patientCredential);
//             } catch (error) {
//                 patientChartLogger.error("Error processing PDF request", error);
//             }
//         })();

//     } catch (error) {
//         patientChartLogger.error("Patient Credentials Posting error found", error);
//         res.status(500).json({ message: "Patient Credentials Posting error found", error });
//     }
// }






//model


const express = require('express');
const Cryptr = require('cryptr');
const patientgetpdf = require('../PatientChart/Patientpdfdata/Patientpdfdata');
require('dotenv').config();
const { patientChartLogger } = require('../../Logger/ChartLogger');

exports.patient = async (req, res) => {
    const { first_name, last_name, dob, ssn, gender, before_date, after_date, document_type, patient_ID, request_id } = req.body;

    try {
        if (!dob) {
            patientChartLogger.error("Patient DateOfBirth not Updated...");
            return res.status(400).json({ message: "Patient DateOfBirth not Updated..." });
        }
        if (!first_name) {
            patientChartLogger.error("Patient FirstName not Updated...");
            return res.status(400).json({ message: "Patient FirstName not Updated..." });
        }
        if (!last_name) {
            patientChartLogger.error("Patient LastName not Updated...");
            return res.status(400).json({ message: "Patient LastName not Updated..." });
        }
        if (!document_type) {
            patientChartLogger.error("Patient Documenttype not Updated...");
            return res.status(400).json({ message: "Patient document type not Updated..." });
        }

        const cryptr = new Cryptr('myTotallySecretKey', { encoding: 'base64', pbkdf2Iterations: 10000, saltLength: 10 });
        const encryptedUserName = cryptr.encrypt(process.env.USERNAMEA);
        const encryptedUserPassword = cryptr.encrypt(process.env.PASSWORD);
        const patientCredential = {
            encryptedUserName,
            encryptedUserPassword,
            first_name,
            last_name,
            dob,
            ssn,
            gender,
            before_date,
            patient_ID,
            after_date,
            document_type,
            request_id
        };

        res.status(201).json({
            Statuses: true,
            Message: "Patient credentials updated",
            request_id: `${request_id}`
        });

        (async () => {
            try {
                await patientgetpdf(patientCredential);
            } catch (error) {
                patientChartLogger.error("Error processing PDF request", error);               
                // res.status(400).json({ message: `Error processing PDF request: ${error.message}` });
            }
        })();
        
    } catch (error) {
        patientChartLogger.error("Patient Credentials Posting error found", error);
        // res.status(500).json({ message: "Patient Credentials Posting error found", error: error.message });
    }
}


// const express = require('express');
// const Cryptr = require('cryptr');
// const patientgetpdf = require('../PatientChart/Patientpdfdata/Patientpdfdata');
// const { patientChartLogger } = require('../../Logger/ChartLogger');
// require('dotenv').config();

// exports.patient = async (req, res) => {
//     const { first_name, last_name, dob, ssn, gender, before_date, after_date, document_type, patient_ID, request_id } = req.body;

//     try {
//         if (!dob || !first_name || !last_name || !document_type) {
//             const missingParams = [];
//             if (!dob) missingParams.push("DateOfBirth");
//             if (!first_name) missingParams.push("FirstName");
//             if (!last_name) missingParams.push("LastName");
//             if (!document_type) missingParams.push("DocumentType");

//             patientChartLogger.error(`${missingParams.join(', ')} not updated.`);
//             return res.status(400).json({ message: `${missingParams.join(', ')} not updated.` });
//         }

//         (async () => {
//                         try {
//                             await patientgetpdf(req,res);
//                         } catch (error) {
//                             patientChartLogger.error("Error processing PDF request", error);               
//                             // res.status(400).json({ message: `Error processing PDF request: ${error.message}` });
//                         }
//                     })();
//         // await patientgetpdf.patientpdf(req, res);
//     } catch (error) {
//         patientChartLogger.error(`Error in patient function: ${error.message}`);
//         return res.status(500).json({ message: "Error processing patient request", error: error.message });
//     }
// }
