const ScriptError = async (page) => {
    try {
        
        const errorText = await page.evaluate(() => document.body.innerText.includes('Script error.'));
        
        if (errorText) {
            return ('ScriptError text is present on the page!');
        }
        return null;

        
    } catch (error) {
        return `ScriptError evaluation failed: ${error.message}`;
    }
}

module.exports = ScriptError;