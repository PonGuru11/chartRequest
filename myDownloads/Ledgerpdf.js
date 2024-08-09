




const path = require('path');
const fs = require('fs');
const { patientChartLogger } = require('../Logger/ChartLogger');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const downloadFile = async (res) => {
    try {
        await sleep(5000);

        // const downloadPath = 'C:/Users/natha/Downloads';
        const downloadPath = "/home/ec2-user/Downloads";
        const fileName = 'Open Item Ledger.pdf';
        const filePath = path.join(downloadPath, fileName);

        if (!fs.existsSync(filePath)) {
            patientChartLogger.error(`File not found: ${filePath}`);
            if (!res.headersSent) {
                return res.status(404).json({ message: 'File not found' });
            }
            return; 
        }

        fs.readFile(filePath, (err, data) => {
            if (err) {
                patientChartLogger.error('Error reading file:', err);
                if (!res.headersSent) {
                    return res.status(500).json({ message: 'Error reading file', error: err.message });
                }
                return; 
            }

            
            if (!data) {
                patientChartLogger.error('File data is undefined');
                if (!res.headersSent) {
                    return res.status(500).json({ message: 'Error processing file data' });
                }
                return; 
            }

            const base64Data = data.toString('base64');
            console.log(base64Data)
            patientChartLogger.info('PDF file read and encoded successfully');

            if (!res.headersSent) {
                res.status(200).json({
                    Status: "True",
                    message: 'Medical Records sent successfully',
                    data: base64Data
                });

               
                fs.unlink(filePath, (err) => {
                    if (err) {
                        patientChartLogger.error('Error deleting file:', err);
                    } else {
                        patientChartLogger.info('PDF file deleted successfully');
                    }
                });
            }
        });
    } catch (error) {
        patientChartLogger.error('Error in downloadFile:', error);
        if (!res.headersSent) {
            return res.status(500).json({ message: 'Error processing file download', error: error.message });
        }
    }
}

module.exports = downloadFile;
