const puppeteer = require("puppeteer");
const Cryptr = require("cryptr");
const { patientChartLogger } = require("../../Logger/ChartLogger");
const Script_Error = require("../../Script_Error/Script_Error");
const patientFileSelected = require("../PatientChart/PatientFile/PatientFile");
const patientRequiredSelected = require("../PatientChart/Patientrequired/Patientrequired");
const chartPageSelected = require("../PatientChart/ChartPrint/ChartPrint");
const ledgerAccountPage = require("../PatientChart/LedgerAccount/LedgerAccount");
const ledgerPrintPage = require("../PatientChart/PrintLedger/Printledger");
const loginError = require("../../Login_Error/Loginerror");
const medicalPrintPageSelected = require('../../Controler/PatientChart/MedicalandLedger/Medical')

require("dotenv").config();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const patientChart = async (
  encryptedUserName,
  encryptedUserPassword,
  first_name,
  last_name,
  dob,
  ssn,
  gender,
  before_date,
  after_date,
  document_type,
  patient_ID,
  req,
  res,
  request_id
) => {
  const cryptr = new Cryptr("myTotallySecretKey", {
    encoding: "base64",
    pbkdf2Iterations: 10000,
    saltLength: 10,
  });
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: "/usr/bin/google-chrome",
      headless: true,
      // headless : false,
      ignoreDefaultArgs: ["--disable-extensions"],
      args: [
        "--no-sandbox",
        "--use-gl=egl",
        "--disable-gpu",
        "--disable-setuid-sandbox",
      ],
      ignoreHTTPSErrors: true,
      dumpio: true,
    });

    console.log("try");
    const page = await browser.newPage();
    try {
      await page._client.send("Page.setDownloadBehavior", {
        behavior: "allow",
        downloadPath: "/tmp",
      });
      console.log("Download behavior set successfully");
    } catch (error) {
      console.error("Error setting download behavior:", error);
    }
    if (!page) {
      patientChartLogger.error("Puppeteer is not opening");
      return res.status(400).json({ message: "Puppeteer is not opening" });
    }
    patientChartLogger.info("Puppeteer is opened.");

    await page.setViewport({ height: 850, width: 1300 });
    // await page.goto(process.env.URL, { waitUntil: 'networkidle2', timeout: 60000 });
    // await page.goto(process.env.URL, { waitUntil: "networkidle2" });
    await page.goto("https://healthquest.raintreeinc.com/webdocumentation", { waitUntil: "networkidle2" });

    const usernameSelector = 'input[name="user"]';
    await page.evaluate((usernameSelector) => {
      const usernameInput = document.querySelector(usernameSelector);
      if (usernameInput) {
        usernameInput.type = "password";
      }
    }, usernameSelector);

    const decryptedUserName = cryptr.decrypt(encryptedUserName);
    if (!decryptedUserName) {
      patientChartLogger.error("Username decryption failed");
      return res.status(400).json({ message: "Username decryption failed" });
    }

    try {
      
      const errorMsg = await Script_Error(page);
      if (errorMsg) {
        patientChartLogger.error(`Login Page: ${errorMsg}`);
        return res
          .status(404)
          .json({ message: "Login error found", data: errorMsg });
      }
      patientChartLogger.info(`Typing Username: ${decryptedUserName}`);
    } catch (error) {
      patientChartLogger.error(
        `Error in Script_Error function: ${error.message}`
      );
      return res
        .status(500)
        .json({ message: "Error in Script_Error function" });
    }

    await page.type(usernameSelector, decryptedUserName, { delay: 300 });
    await page.keyboard.press("Tab", { delay: 100 });

    const decryptedUserPassword = cryptr.decrypt(encryptedUserPassword);
    if (!decryptedUserPassword) {
      patientChartLogger.error("Password decryption failed");
      return res.status(400).json({ message: "Password decryption failed" });
    }

    try {
      const errorMsg = await Script_Error(page);
      if (errorMsg) {
        patientChartLogger.error(`Login Page: ${errorMsg}`);
        return res
          .status(404)
          .json({ message: "Login error found", data: errorMsg });
      }
      patientChartLogger.info("Typing Password...");
    } catch (error) {
      patientChartLogger.error(
        `Error in Script_Error function: ${error.message}`
      );
      return res
        .status(500)
        .json({ message: "Error in Script_Error function" });
    }

    await page.keyboard.type(decryptedUserPassword, { delay: 300 });
    await page.keyboard.press("Tab", { delay: 100 });
    await page.keyboard.press("Enter");

    await sleep(2000);

    try {
      const loginVerify = await loginError(page);

      if (loginVerify) {
        patientChartLogger.error(`Login Page: ${loginVerify}`);
        return res
          .status(404)
          .json({ message: "Login error found", data: loginVerify });
      }
      patientChartLogger.info("MainMenu Navigation Successfully...");
    } catch (error) {
      patientChartLogger.error(
        `Error in Script_Error function: ${error.message}`
      );
      return res
        .status(500)
        .json({ message: "Error in Script_Error function" });
    }

    await patientFileSelected(
      page,
      dob,
      first_name,
      last_name,
      patient_ID,
      browser,
      req,
      res
    );

    if (document_type.length === 1) {
    
      const type = document_type[0];

      if (type === "Medical") {
        await patientRequiredSelected(page, "Medical", browser, req, res);
        await chartPageSelected(
          page,
          before_date,
          after_date,
          browser,
          req,
          res
        );
        await sleep(5000)
        await page.keyboard.press("Tab", { delay: 5000 });
        patientChartLogger.info("Tab button Clicked.");
        await sleep(5000)
        await page.click('.button[title="Download"]');
        patientChartLogger.info("Medical Download Clicked.");
        await sleep(50000);
      } else if (type === "Billing") {
        await patientRequiredSelected(page, "Billing", browser, req, res);
        await ledgerAccountPage(page, browser, req, res);
        await ledgerPrintPage(page, browser, req, res);
        await sleep(5000);
        await page.keyboard.press("Tab", { delay: 200 });
        await page.keyboard.press("Tab", { delay: 200 });
        await page.keyboard.press("Tab", { delay: 200 });
        await page.keyboard.press("Tab", { delay: 200 });
        await page.keyboard.press("Enter", { delay: 500 });
        await sleep(5000);
        patientChartLogger.info("Ledger Process Completed.");
      } else {
        patientChartLogger.error("Invalid document_type provided");
        return res
          .status(400)
          .json({ message: "Invalid document_type provided" });
      }
    } else if (document_type.length > 1) {
      // Multiple document types
      const tasks = [];

      if (document_type.includes("Medical")) {
        tasks.push(async () => {
          await patientRequiredSelected(page, "Medical", browser, req, res);
          await medicalPrintPageSelected(
            page,
            before_date,
            after_date,
            browser,
            first_name,
            last_name,
            req,
            res
          );
        });
      }
      await Promise.all(tasks.map((task) => task()));
    } else {
      patientChartLogger.error("No document_type provided");
      return res.status(400).json({ message: "No document_type provided" });
    }

    patientChartLogger.info(
      "RPA Automation Process completed and Browser closed."
    );
  } catch (error) {
    patientChartLogger.error(`Error: ${error.message}`);
    return res.status(500).json({ message: "Internal Server Error" });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

module.exports = patientChart;
