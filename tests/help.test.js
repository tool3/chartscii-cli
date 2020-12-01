const { exec } = require('child_process');
const { promisify } = require('util');
const snap = require('snaptdout');
const execute = promisify(exec);

describe('help', () => {
    it('should match help', async () => {
        const { stdout } = await execute('node index.js --help');
        await snap(stdout, 'help');
    });
});