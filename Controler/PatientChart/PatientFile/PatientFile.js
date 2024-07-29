const { patientChartLogger } = require('../../../Logger/ChartLogger'); 
const credentialsPatientCheck = require('../Patientcredentials/Patientcredentials');
const Script_Error = require('../../../Script_Error/Script_Error');

const patientFile = async(page, dob, first_name, last_name, patient_ID, browser) => {
    if (!browser) {
        patientChartLogger.error('Browser instance is not defined.');
        return;
    }

    const fileSelected = await page.waitForSelector('.textnode');
    if (!fileSelected) {
        patientChartLogger.error('PatientFile Selected Error Acquired...');
    } else {
        try {
            const errorMsg = await Script_Error(page);
            if (errorMsg) {
                patientChartLogger.error(`PatientFile Page: ${errorMsg}`);
                await browser.close();
                return;
            }
            patientChartLogger.info('Selecting PatientFile...');
        } catch (error) {
            patientChartLogger.error(`Unexpected Error: ${error.message}`);
        }
    }
    
    await page.keyboard.press('P', { delay: 200 });
    patientChartLogger.info('PatientFile Selected Successfully..');

    const findSelected = await page.waitForSelector('.toolbar-button-label');
    if (!findSelected) {
        patientChartLogger.error('PatientFind Selected Error Acquired...');
    } else {
        try {
            const errorMsg = await Script_Error(page);
            if (errorMsg) {
                patientChartLogger.error(`PatientFind Page: ${errorMsg}`);
                await browser.close();
                return;
            }
            patientChartLogger.info('Selecting PatientFind...');
        } catch (error) {
            patientChartLogger.error(`Unexpected Error: ${error.message}`);
        }
    }

    await page.keyboard.press('F', { delay: 3000 });
    patientChartLogger.info('PatientFind Selected Successfully..');

    const patientData = dob + ' ' + first_name + ' ' + last_name;

    const patientFindTyping = await page.waitForSelector('.w-field-link-openview');
    if (!patientFindTyping) {
        patientChartLogger.error('PatientFindTyping Selected Error Acquired...');
    } else {
        try {
            const errorMsg = await Script_Error(page);
            if (errorMsg) {
                patientChartLogger.error(`PatientFindTyping Page: ${errorMsg}`);
                await browser.close();
                return;
            }
            patientChartLogger.info('Typing PatientFind...');
        } catch (error) {
            patientChartLogger.error(`Unexpected Error: ${error.message}`);
        }
    }

    await page.keyboard.type(patientData, { delay: 300 });
    patientChartLogger.info("patientFind Typed Successfully...");

    await page.keyboard.press('Enter', { delay: 300 });
    patientChartLogger.info("PatientFind First Entered Pressed..");

    await credentialsPatientCheck(page, patient_ID, browser);
    
    await page.keyboard.press('Enter', { delay: 300 });
    patientChartLogger.info("patientFind Second Entered Successfully");
};

module.exports = patientFile;
