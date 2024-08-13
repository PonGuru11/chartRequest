const { patientChartLogger } = require('../../../Logger/ChartLogger'); 
const Script_Error = require('../../../Script_Error/Script_Error');
const NoRecord_Error=require('../../../NoRecord_Error/NoRecord_Error')
const moment = require('moment')

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const chartPrintPage = async (page, before_date, after_date,browser,req,res) => {

    const beforeDate = await page.waitForSelector('.w-tab-control-tabs');
    if (!beforeDate) {
        patientChartLogger.error('VisitInfo Selected Error Acquired...');
        return;
    }

    try {
        const errorMsg = await Script_Error(page);
        if (errorMsg) {
            if (typeof errorMsg === 'string') {
                patientChartLogger.error(`VisitInfo Page: ${errorMsg}`);
            } else {
                patientChartLogger.error('VisitInfo Page: Unexpected error format');
            }
            await browser.close();
            return;
        }
        patientChartLogger.info('VisitInfo Choosing...');
    } catch (error) {
        patientChartLogger.error(`Error: ${error.message}`);
        return;
    }

    var after_date = moment(after_date, 'YYYYMMDD').format('MMDDYY');
    var before_date = moment(before_date, 'YYYYMMDD').format('MMDDYY');
    await page.keyboard.press('Tab');
await sleep(5000);
    if (after_date) {
        await page.keyboard.type(after_date);
        await page.keyboard.press('Tab',{delay:300});
        await page.keyboard.press('Tab',{delay:300});
        patientChartLogger.info('AfterDate Typed Successfully...');
    } else {
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');
    }

 // BeforeDate
    if (before_date) {
        await page.keyboard.type(before_date);
        await page.keyboard.press('Tab',{delay:300});
        await page.keyboard.press('Tab',{delay:300})
        patientChartLogger.info('BeforeDate Typed Successfully...');
    } else {
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');
    }
 
    await page.keyboard.press('Tab');
    await page.keyboard.press('Backspace', { delay: 200 });
    await page.keyboard.press('Tab');
    await page.keyboard.press('Backspace', { delay: 200 });
    await page.keyboard.press('Tab');
    await page.keyboard.press('Escape', { delay: 200 });
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    await page.keyboard.press('Enter', { delay: 300 });
    patientChartLogger.info("PrintNotes Selected Successfully...");

    const viewRecord=await page.waitForSelector('.screen-caption');
    if(!viewRecord){
        patientChartLogger.error("viewRecord Error Acquired..")
        return
    }
    try {
        const errorMsg = await NoRecord_Error(page);
        if (errorMsg) {
            patientChartLogger.error(`Record View Page: ${errorMsg}`);
            await browser.close();
            return res.status(404).json({ message: "Record View Page error found", data: errorMsg });

        }
        
        await page.keyboard.down('Control');
        await page.keyboard.press('KeyP', { delay: 5000 });
        await page.keyboard.up('Control');
        patientChartLogger.info("PrintOption Selected Successfully...");
        await sleep(30000)
    }catch (error) {
       console.log("Error:",error)
       return res.status(500).json({ message: "Error in Record View Page function" });

    }  
};

module.exports = chartPrintPage;
