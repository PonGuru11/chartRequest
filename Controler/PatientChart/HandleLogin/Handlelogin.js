const loginError = require('../../../Login_Error/Loginerror');
const {patientChartLogger} = require('../../../Logger/ChartLogger'); 

const handleLogin = async (page, browser,res) => {
    try {
        const loginVerify = await loginError(page);

        if (loginVerify) {
            patientChartLogger.error(`Login Page: ${loginVerify}`);
            return res.status(404).json({ message: "Login error found", data: loginVerify });
            
        }  
            patientChartLogger.info("MainMenu Navigation Successfully...");
     
    } catch (error) {
        patientChartLogger.error(`Error in Script_Error function: ${error.message}`);
        return res.status(500).json({ message: "Error in Script_Error function" });
    }
};

module.exports = handleLogin;
