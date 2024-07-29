const loginError = require('../../../Login_Error/Loginerror');
const {patientChartLogger} = require('../../../Logger/ChartLogger'); 

const handleLogin = async (page, browser) => {
    try {
        const loginVerify = await loginError(page);

        if (loginVerify) {
            patientChartLogger.error(`Login Page: ${loginVerify}`);
            await browser.close(); 
            return;
        }
            await page.waitForNavigation(); 
            patientChartLogger.info("MainMenu Navigation Successfully...");
     
    } catch (error) {
        patientChartLogger.error(`Error occurred: ${error.message}`);
        await browser.close(); 
    }
};

module.exports = handleLogin;
