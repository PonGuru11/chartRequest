// const credentialsError = require('../../../PatientCredentials_Error/Credentials_Error');
// const { patientChartLogger } = require('../../../Logger/ChartLogger'); 
// const credentialsCheck=async(page,patient_ID,browser)=>{
//     const errormsg=await credentialsError(page);
//         if(errormsg){
//             patientChartLogger.error(`Error:${errormsg}`)
//         }else if(!patient_ID===errormsg){
//             patientChartLogger.error('PatientId Not Input...'); 
//             await browser.close()   
//         }else if(patient_ID){
//             await page.keyboard.press('Enter',{delay:200});
//             await page.keyboard.type(patient_ID,{delay:300});
//             await page.keyboard.press('Enter',{delay:200})
//         }

//         await page.keyboard.press('Enter', { delay: 300 });
            
// }
// module.exports=credentialsCheck




// const credentialsError = require('../../../PatientCredentials_Error/Credentials_Error');
// const { patientChartLogger } = require('../../../Logger/ChartLogger'); 

// const credentialsCheck = async (page, patient_ID, browser) => {
//     // Check for error messages

//     if (!browser) {
//         patientChartLogger.error('Browser instance is not defined.');
//         return;
//     }
//     const errormsg = await credentialsError(page);

//     if (errormsg) {
//         // Log the error message
//         patientChartLogger.error(`Error: ${errormsg}`);
        
//         // Check if patient_ID is provided
//         if (!patient_ID) {
//             // Log that patient_ID is missing and close the browser
//             patientChartLogger.error('PatientId Not Input...');
//             await browser.close();
//             // return; // Exit the function early
//         }
//     }

//     // If patient_ID is provided or there are no errors, proceed with input
//     if (patient_ID) {
//         await page.keyboard.press('Enter', { delay: 200 });
//         await page.keyboard.type(patient_ID, { delay: 300 });
//         await page.keyboard.press('Enter', { delay: 200 });
//     }

//     // // Press Enter again at the end
//     // await page.keyboard.press('Enter', { delay: 300 });
// };

// module.exports=credentialsCheck





const credentialsError = require('../../../PatientCredentials_Error/Credentials_Error');
const { patientChartLogger } = require('../../../Logger/ChartLogger'); 


const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const credentialsCheck = async (page, patient_ID, browser) => {
    if (!browser) {
        patientChartLogger.error('Browser instance is not defined.');
        return;
    }
    
    const errormsg = await credentialsError(page);

    if (errormsg) {
        patientChartLogger.error(`Error: ${errormsg}`);
        
        if (!patient_ID) {
            patientChartLogger.error('PatientId Not Input...');
            await browser.close()
            return;
        }
    }

    if (patient_ID) {
        await page.keyboard.press('Enter', { delay: 200 });
        await sleep(2000);
        await page.keyboard.type(patient_ID, { delay: 300 });
        await page.keyboard.press('Enter', { delay: 200 });
    }
};

module.exports = credentialsCheck;
