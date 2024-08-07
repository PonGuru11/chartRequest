const { patientChartLogger } = require("../../../Logger/ChartLogger");
const Script_Error = require("../../../Script_Error/Script_Error");
const NoRecord_Error = require("../../../NoRecord_Error/NoRecord_Error");
const patientRequiredSelected = require("../../PatientChart/Patientrequired/Patientrequired");
const ledgerAccountPage = require("../../PatientChart/LedgerAccount/LedgerAccount");
const ledgerPrintPage = require("../../PatientChart/PrintLedger/Printledger");
const downloadMedicalAndLedgerFile = require("../../../myDownloads/MedicalandLedger");
const downloadFiles = require('../../../myDownloads/downloadsfile')

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const medicalPrint = async (
  page,
  before_date,
  after_date,
  browser,
  first_name,
  last_name,
  req,
  res
) => {
  const beforeDate = await page.waitForSelector(".w-tab-control-tabs");
  if (!beforeDate) {
    patientChartLogger.error("VisitInfo Selected Error Acquired...");
    return;
  }

  try {
    const errorMsg = await Script_Error(page);
    if (errorMsg) {
      if (typeof errorMsg === "string") {
        patientChartLogger.error(`VisitInfo Page: ${errorMsg}`);
      } else {
        patientChartLogger.error("VisitInfo Page: Unexpected error format");
      }
      await browser.close();
      return;
    }
    patientChartLogger.info("VisitInfo Choosing...");
  } catch (error) {
    patientChartLogger.error(`Error: ${error.message}`);
    return;
  }

  await page.keyboard.press("Tab");

  if (after_date) {
    await page.keyboard.type(after_date);
    await page.keyboard.press("Tab", { delay: 300 });
    await page.keyboard.press("Tab", { delay: 300 });
    patientChartLogger.info("AfterDate Typed Successfully...");
  } else {
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
  }

  // BeforeDate

  if (before_date) {
    await page.keyboard.type(before_date);
   
    await page.keyboard.press("Tab", { delay: 300 });
    await page.keyboard.press("Tab", { delay: 300 });
    patientChartLogger.info("BeforeDate Typed Successfully...");
  } else {
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
  }

  await page.keyboard.press("Tab");
  await page.keyboard.press("Backspace", { delay: 200 });
  await page.keyboard.press("Tab");
  await page.keyboard.press("Backspace", { delay: 200 });
  await page.keyboard.press("Tab");
  await page.keyboard.press("Escape", { delay: 200 });
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");

  await sleep(2000);
  await page.keyboard.press("Enter", { delay: 300 });
  patientChartLogger.info("PrintNotes Selected Successfully...");

  const viewRecord = await page.waitForSelector(".screen-caption");
  if (!viewRecord) {
    patientChartLogger.error("viewRecord Error Acquired..");
    return;
  }
  try {
    const recordErrorMsg = await NoRecord_Error(page);
    if (recordErrorMsg) {
      patientChartLogger.error(`Record View Page: ${recordErrorMsg}`);
      await page.keyboard.press("Escape", { delay: 5000 });
      await page.keyboard.press("Escape", { delay: 5000 });
    } else{
      await page.keyboard.down("Control");
      await page.keyboard.press("KeyP", { delay: 5000 });
      await page.keyboard.up("Control");
      patientChartLogger.info("PrintOption Selected Successfully...");

      await page.keyboard.press("Tab", { delay: 5000 });
      await sleep(5000);
      await page.click('.button[title="Download"]');
      patientChartLogger.info("Medical Download Clicked.");
      await sleep(15000);
      await page.keyboard.press("Escape", { delay: 5000 });
      await page.keyboard.press("Escape", { delay: 5000 });
      await sleep(5000);
    
    }
    await patientRequiredSelected(page, "Ledger", browser, req, res);
    await ledgerAccountPage(page, browser, req, res);
    await ledgerPrintPage(page, browser, req, res);
    await sleep(5000);
    await page.keyboard.press("Tab", { delay: 200 });
    await page.keyboard.press("Tab", { delay: 200 });
    await page.keyboard.press("Tab", { delay: 200 });
    await page.keyboard.press("Tab", { delay: 200 });
    await page.keyboard.press("Enter", { delay: 500 });
    await sleep(5000);

    if(recordErrorMsg){
        await downloadMedicalAndLedgerFile(
          first_name,
          last_name,
          res,
          recordErrorMsg
        )
      }else{
        await downloadFiles(first_name,last_name,res)
      }
  } catch (error) {
    console.log("Error:", error);
    return res
      .status(500)
      .json({ message: "Error in Record View Page function" });
  }
};

module.exports = medicalPrint;


