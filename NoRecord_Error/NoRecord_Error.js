const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const recordError = async (page) => {
    try {
        await sleep(2000)
        const errorText = await page.evaluate(() => document.body.innerText.includes('There were no records to view'));
        
        if (errorText) {
            throw new Error('No records found...');
            
        }

        
    } catch (error) {
        return error.message;
        
    }
}

module.exports = recordError;