const express = require('express');
const patientChart = require('../PatientChart/patientChart');
const Cryptr = require('cryptr');

require('dotenv').config()

const { patientChartLogger } = require('../../Logger/ChartLogger')

exports.patient = async (req, res) => {
    try {
        const { first_name, last_name,dob,ssn,gender,before_date,after_date,document_type,patient_ID,request_id} = req.body;

        if (!dob) {
            patientChartLogger.error( "Patient DateOfBirth not Updated...");
            return res.status(400).json({ message: "Patient DateOfBirth not Updated..." });
        }else{
            patientChartLogger.info( "Patient DateOfBirth Updated...");
        }

        if (!first_name) {
            patientChartLogger.error("Patient FirstName not Updated...");
            return res.status(400).json({ message: "Patient FirstName not Updated..." });
        }else{
            patientChartLogger.info("Patient FirstName Updated...");
        }

        if (!last_name) {
            patientChartLogger.error("Patient LastName not Updated...");
            return res.status(400).json({ message: "Patient LastName not Updated..." });
        }else{
            patientChartLogger.info("Patient LastName Updated...");
        }

        if (!document_type) {
            patientChartLogger.error("Patient Data required not Updated...");
            return res.status(400).json({ message: "Patient Data required not Updated..." });
        }else{
            patientChartLogger.info("Patient Data required  Updated...");
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

        res.status(200).json({
            message: "Patient Credentials are posted successfully",
            data: patientCredential
        });

        if (document_type) {
            await patientChart(
                encryptedUserName, 
                encryptedUserPassword, 
                first_name, 
                last_name,
                dob,
                ssn,
                gender,
                before_date,
                after_date,
                document_type,
                patient_ID,
                request_id);
            
        }

    } catch (error) {
        res.status(500).json({ message: "Patient Credentials Posting error found", error });
        patientChartLogger.error("Patient Credentials Posting error found");
    }
}
