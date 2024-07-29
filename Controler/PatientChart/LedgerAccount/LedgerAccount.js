const { patientChartLogger } = require('../../../Logger/ChartLogger'); 
const Script_Error = require('../../../Script_Error/Script_Error');

const ledgerAccount=async(page,browser)=>{
   try {
            const errorMsg = await Script_Error(page);
            if (errorMsg) {
                patientChartLogger.error(`LedgerAccount Page: ${errorMsg}`);
                await browser.close()
                return
            }
            patientChartLogger.info('Selecting LedgerAccount...');
        } catch (error) {
            console.log("Error:",error)
        }
   
    await page.keyboard.press('P', { delay: 3000 });
    patientChartLogger.info('P Selected Successfully...');
    }

module.exports=ledgerAccount