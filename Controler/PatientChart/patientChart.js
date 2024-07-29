const puppeteer = require('puppeteer');
const Cryptr = require('cryptr');
const { patientChartLogger } = require('../../Logger/ChartLogger'); 
const Script_Error = require('../../Script_Error/Script_Error');
const downloadChartFile = require("../../myDownloads/Chartpdf");
const downloadLedgerFile = require("../../myDownloads/Ledgerpdf");
const patientFileSelected = require('../PatientChart/PatientFile/PatientFile');
const patientRequiredSelected = require('../PatientChart/Patientrequired/Patientrequired');
const chartPageSelected = require('../PatientChart/ChartPrint/ChartPrint');
const ledgerAccountPage = require('../PatientChart/LedgerAccount/LedgerAccount');
const ledgerPrintPage = require('../PatientChart/PrintLedger/Printledger');
const handleLogin = require('../PatientChart/HandleLogin/Handlelogin')

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const patientChart = async(
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
    request_id) => {
    const cryptr = new Cryptr('myTotallySecretKey', { encoding: 'base64', pbkdf2Iterations: 10000, saltLength: 10 }); 
    let browser;
    try {
        browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();

        if (!page) {
            patientChartLogger.error("RPA Automation Package Puppeteer is not Opening");
            return;
        } else {
            patientChartLogger.info("RPA Automation Package Puppeteer is Opened.");
        }

        await page.setViewport({ height: 850, width: 1300 });
        await page.goto(process.env.URL, { waitUntil: 'networkidle2', timeout: 60000 });

        const usernameSelector = 'input[name="user"]';
        await page.evaluate((usernameSelector) => {
            const usernameInput = document.querySelector(usernameSelector);
            if (usernameInput) {
                usernameInput.type = 'password';
            }
        }, usernameSelector);

        const decryptedUserName = cryptr.decrypt(encryptedUserName);
        if (!decryptedUserName) {
            patientChartLogger.error('UserName Typing Error Acquired...');
        } else {
            try {
                const errorMsg = await Script_Error(page);
                if (errorMsg) {
                    patientChartLogger.error(`Login Page: ${errorMsg}`);
                    await browser.close();
                    return;
                }
                patientChartLogger.info('Typing UserName...');
            } catch (error) {
                patientChartLogger.error(`Unexpected Error: ${error.message}`);
            }
        }

        await page.type(usernameSelector, decryptedUserName, { delay: 300 });
        await page.keyboard.press('Tab', { delay: 100 });

        const decryptedUserPassword = cryptr.decrypt(encryptedUserPassword);
        if (!decryptedUserPassword) {
            patientChartLogger.error('UserPassword Typing Error Acquired...');
        } else {
            try {
                const errorMsg = await Script_Error(page);
                if (errorMsg) {
                    patientChartLogger.error(`Login Page: ${errorMsg}`);
                    await browser.close();
                    return;
                }
                patientChartLogger.info('Typing UserPassword...');
            } catch (error) {
                patientChartLogger.error(`Unexpected Error: ${error.message}`);
            }
        }

        await page.keyboard.type(decryptedUserPassword, { delay: 300 });
        await page.keyboard.press('Tab', { delay: 100 });
        await page.keyboard.press('Enter');

        await sleep(2000)
        await handleLogin(page,browser)
        await patientFileSelected(page, dob, first_name, last_name, patient_ID, browser);

        async function handleDocumentType(page, document_type, before_date, after_date, browser,first_name,last_name) {
            await patientRequiredSelected(page, document_type, browser);
            if (document_type === 'Chart') {
                await chartPageSelected(page, before_date, after_date,browser);
                await page.keyboard.press('Tab', { delay: 5000 });
                await page.click('.button[title="Download"]');
                patientChartLogger.info("Download Clicked.");
              
                await sleep(5000);
                await downloadChartFile(first_name,last_name); 
                await sleep(3000);
                await browser.close(); 
                patientChartLogger.info("RPA Automation Process is Running Successfully and Browser is Closed...");
            } else if (document_type === 'Ledger') {
                await ledgerAccountPage(page, browser);
                await ledgerPrintPage(page, browser);

                await sleep(5000);
                await page.keyboard.press('Tab', { delay: 200 });
                await page.keyboard.press('Tab', { delay: 200 });
                await page.keyboard.press('Tab', { delay: 200 });
                await page.keyboard.press('Tab', { delay: 200 });
                await page.keyboard.press('Enter', { delay: 500 });
                await sleep(5000);
                await downloadLedgerFile();
                await sleep(3000);
                await browser.close(); 
                patientChartLogger.info("RPA Automation Process is Running Successfully and Browser is Closed...");
            }
        }

        await handleDocumentType(page, document_type, before_date, after_date, browser,first_name,last_name);     
    } catch (error) {
        patientChartLogger.error(`Error: ${error.message}`);
        if (browser) {
            await browser.close();
        }
    }
};

module.exports = patientChart;

