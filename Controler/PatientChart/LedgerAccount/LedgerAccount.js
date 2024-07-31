const { patientChartLogger } = require('../../../Logger/ChartLogger'); 
const Script_Error = require('../../../Script_Error/Script_Error');

const ledgerAccount=async(page,browser,req,res)=>{
   try {
            const errorMsg = await Script_Error(page);
            if (errorMsg) {
                patientChartLogger.error(`LedgerAccount Page: ${errorMsg}`);
                await browser.close()
                return res.status(404).json({ message: "LedgerAccount Page error found", data: errorMsg });

            }
            patientChartLogger.info('Selecting LedgerAccount...');
        } catch (error) {
            console.log("Error:",error)
            return res.status(500).json({ message: "Error in Ledger Account function" });

        }
   
    await page.keyboard.press('P', { delay: 3000 });
    patientChartLogger.info('P Selected Successfully...');
    }

module.exports=ledgerAccount