const fs = require('fs');
const path = require('path');

function fix(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Fix the specific comma issue
    content = content.replace(/}\s*"fixNames"/g, '},\n        "fixNames"');

    try {
        // This will automatically deduplicate keys (last one wins)
        const data = JSON.parse(content);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf8');
        console.log(`Successfully fixed and deduplicated ${filePath}`);
    } catch (e) {
        console.error(`Error parsing ${filePath}:`, e.message);
        // If it still fails, let's try to find where it's failing
        const lines = content.split('\n');
        const match = e.message.match(/at position (\d+)/);
        if (match) {
            const pos = parseInt(match[1]);
            console.error('Error at around:', content.substring(Math.max(0, pos - 50), Math.min(content.length, pos + 50)));
        }
    }
}

fix(process.argv[2]);
