import { Hono } from 'hono';
import fs from 'fs';
import { serve } from '@hono/node-server'
import { exec } from 'child_process';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const app = new Hono();

app.get('/', (c) => {
    return c.text('Hello');
});

app.post('/build', async (c) => {
    const { code, npmModules } = await c.req.json();
    const buildId = uuidv4();
    const workspaceDir = path.join(__dirname, '..','..', 'builder_workspace', buildId);
    try {
        // Create workspace directory
        fs.mkdirSync(workspaceDir, { recursive: true });

        // Save input files in workspace
        fs.writeFileSync(path.join(workspaceDir, 'input.js'), code);

        // Install npm modules
        await installNpmModules(npmModules, workspaceDir);

        // Bundle code
        await bundleCode(workspaceDir);

        return c.json({ message: 'Build successful', buildId });
    } catch (error) {
        console.log("Error")
        return c.json({ error: error.message }, 500);
    }
});

function installNpmModules(modules, dir) {
    return new Promise((resolve, reject) => {
        const command = `cd ${dir} && npm install ${modules.join(' ')}`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`Error installing modules: ${stderr}`);
            } else {
                resolve(stdout);
            }
        });
    });
}

function bundleCode(dir) {
    return new Promise((resolve, reject) => {
        const command = `cd ${dir} && npx rollup input.js --file output.js --format cjs`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`Error bundling code: ${stderr}`);
            } else {
                resolve(stdout);
            }
        });
    });
}

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})

