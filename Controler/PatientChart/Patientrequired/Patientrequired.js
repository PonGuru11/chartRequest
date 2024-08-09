const { patientChartLogger } = require('../../../Logger/ChartLogger'); 
const Script_Error = require('../../../Script_Error/Script_Error');


const documentTypeMap = {
    'Medical': 'C',
    'Billing': 'L',
   
};

const patientRequired = async (page, type, browser, req, res) => {
    const documentTypeArray = Array.isArray(type) ? type : [type];
    
    for (const docType of documentTypeArray) {
    
        const documentFirstLetter = documentTypeMap[docType];
        if (!documentFirstLetter) {
            patientChartLogger.error(`No mapping found for document type: ${docType}`);
            return res.status(400).json({ message: `No mapping found for document type: ${docType}` });
        }
        
        const fileSelected = await page.waitForSelector('.textnode');
        if (!fileSelected) {
            patientChartLogger.error('PatientRequired Selected Error Acquired...');
            return res.status(404).json({ message: "PatientRequired selection error" });
        }

        try {
            const errorMsg = await Script_Error(page);
            if (errorMsg) {
                patientChartLogger.error(`PatientRequired Page: ${errorMsg}`);
                await browser.close();
                return res.status(404).json({ message: "PatientRequired error found", data: errorMsg });
            }
            patientChartLogger.info('Selecting PatientRequired...');
        } catch (error) {
            patientChartLogger.error(`Error in Script_Error function: ${error.message}`);
            return res.status(500).json({ message: "Error in PatientRequired function" });
        }

        
        await page.keyboard.type(documentFirstLetter, { delay: 3000 });
        patientChartLogger.info(`PatientRequired: ${documentFirstLetter} Selected Successfully...`);
    }
};

module.exports = patientRequired;
