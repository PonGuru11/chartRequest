const path = require('path');
const fs = require('fs');
const { patientChartLogger } = require('../Logger/ChartLogger');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const downloadFile = async (first_name,last_name) => {
  
  await sleep(5000);

   const commanName='- Daily Note.pdf';
  
  // const patientName="first_name+' '+last_name+' '"
  // const pdfFileName=patientName+commanName;
  //  const fileName = 'SOUTHFIELD TEST 1 - Daily Note.pdf';

   const downloadPath = 'C:/Users/natha/Downloads';
   const fileName=last_name+' '+first_name+' '+commanName;
   const filePath = path.join(downloadPath, fileName);

  fs.readFile(filePath, (err, data) => {
  if (err) {
  console.error('Error reading file:', err);
  return;
  }

  const base64Data = data.toString('base64');
  console.log('Base64 encoded content:', base64Data);
  
 
  fs.unlink(filePath, (err) => {
     if (err) {
       console.error('Error deleting file:', err);
       return;
     }
     patientChartLogger.info('Pdf File Download and Same Pdf file is Deleted successfully')
   });

  });
 
 }

 module.exports = downloadFile;