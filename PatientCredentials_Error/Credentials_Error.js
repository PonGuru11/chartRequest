const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const credentialsError = async (page) => {
    try {
        await sleep(2000)
        const errorText = await page.evaluate(() => document.body.innerText.includes('Could not find any results for:'));
        
        if (errorText) {
            throw new Error('Could not find any results...');
            
        }

        
    } catch (error) {
        return error.message;
        
    }
}

module.exports = credentialsError;