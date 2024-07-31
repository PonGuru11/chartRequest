const loginError = async (page) => {
    try {
        const errorText = await page.evaluate(() => {
            if (!document.body) {
                return false;
            }
            return document.body.innerText.includes('Invalid username or password.');
        });
        
        if (errorText) {
            return 'Invalid UserName or Password !';
        }
        return null;

    } catch (error) {
        return `LoginError evaluation failed: ${error.message}`;
    }
}

module.exports = loginError;
