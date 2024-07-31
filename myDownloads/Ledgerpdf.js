const path = require('path');
const fs = require('fs');
const { patientChartLogger } = require('../Logger/ChartLogger');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const downloadFile = async (res) => {
  await sleep(5000);


   const downloadPath = 'C:/Users/natha/Downloads';
   const fileName = 'OPEN ITEM LEDGER.pdf';
   const filePath = path.join(downloadPath, fileName);

     if (!fs.existsSync(filePath)) {
    patientChartLogger.error(`File not found: ${filePath}`);
    return res.status(404).json({ message: 'File not found' });
  }

  fs.readFile(filePath, (err, data) => {
  if (err) {
    patientChartLogger.error('Error reading file:', err);
    return res.status(500).json({ message: 'Error reading file', error: err });
  }

  const base64Data = data.toString('base64');
  patientChartLogger.info('PDF file read and encoded successfully');

  res.status(200).json({
    Status:"True",
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

  });
 
 }

 module.exports = downloadFile;