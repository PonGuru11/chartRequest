const patientChart = require('../patientChart');
const downloadChartFile = require('../../../myDownloads/Chartpdf');
const downloadLedgerFile = require('../../../myDownloads/Ledgerpdf');
const Cryptr = require('cryptr');
require('dotenv').config();

exports.patientpdf = async (req, res) => {
    const cryptr = new Cryptr('myTotallySecretKey', { encoding: 'base64', pbkdf2Iterations: 10000, saltLength: 10 });
    const encryptedUserName = cryptr.encrypt(process.env.USERNAMEA);
    const encryptedUserPassword = cryptr.encrypt(process.env.PASSWORD);
    const { first_name, last_name, dob, ssn, gender, before_date, after_date, document_type, patient_ID, request_id } = req.body;

    if (!first_name || !last_name || !dob || !document_type) {
        return res.status(400).json({ message: "Missing required parameters" });
    }

    try {
        let success = false;

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
            req,
            res,
            request_id
        ).then(() => {
            success = true;
        }).catch((error) => {
            console.log("Error:", error);
            if (!res.headersSent) {
                return res.status(500).json({ message: "Error processing the patient chart request", error: error.message });
            }
        });

        if (success) {
            if (!Array.isArray(document_type)) {
                return res.status(400).json({ message: "document_type should be an array." });
            }
            for (const type of document_type) {
            if (type === 'Medical') {
                await downloadChartFile(first_name, last_name, res);
            } else if (type === 'Billing') {
                await downloadLedgerFile(res);
            } else {
                if (!res.headersSent) {
                    return res.status(400).json({ message: "Invalid document_type provided." });
                }
            }
        }
        }
    } catch (error) {
        console.log("Error:", error);
        if (!res.headersSent) {
            return res.status(500).json({ message: "Error processing the request", error: error.message });
        }
    }
}






