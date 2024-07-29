const { patientChartLogger } = require('../../../Logger/ChartLogger'); 
const Script_Error = require('../../../Script_Error/Script_Error');

const printLedger=async(page,browser)=>{
   try {
            const errorMsg = await Script_Error(page);
            if (errorMsg) {
                patientChartLogger.error(`LedgerPrint Page: ${errorMsg}`);
                await browser.close()
                return
            }
            patientChartLogger.info('Selecting LedgerPrint...');
        } catch (error) {
            console.log("Error:",error)
        }
   
    await page.keyboard.press('L', { delay: 2000 });
    patientChartLogger.info('L Selected Successfully...');
    await page.keyboard.press('V', { delay: 2000 });
    patientChartLogger.info('V Selected Successfully...');
    }

module.exports=printLedger