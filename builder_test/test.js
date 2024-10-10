import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testBuilderService(uid) {
    const testDir = path.join(__dirname, '..', 'inputs', uid);
    const code = fs.readFileSync(path.join(testDir, 'input.js'), 'utf8');
    const npmModules = JSON.parse(fs.readFileSync(path.join(testDir, 'npm_modules.json'), 'utf8')).npmmodules;

    try {
        
        const response = await fetch('http://localhost:3000/build', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, npmModules })
        });

        console.log("Hello" + JSON.stringify(response))

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);
    } catch (error) {
        console.error('Error during the build process:', error.message);
    }
}

// Example usage with a specific UID
testBuilderService('234342345');
