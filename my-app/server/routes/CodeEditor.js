const express = require('express');
const router = express.Router();

router.post('/run', (req, res) => {
    const { code } = req.body;

    // Validate code
    if (!code) {
        return res.status(400).send({ error: 'Code is required' });
    }

    try {
        // Redirect console output
        const originalConsoleLog = console.log;
        let output = '';
        console.log = (...args) => {
            output += args.join(' ') + '\n';
        };

        // Capture result from eval
        let result;
        result = eval(code); // Execute code

        // Restore original console.log
        console.log = originalConsoleLog;

        // Append result to output if it's not undefined
        if (result !== undefined) {
            output += result.toString();
        }

        res.send({ output: output.trim(), error: '' });
    } catch (error) {
        console.error(`Error executing code: ${error}`);
        res.status(500).send({ output: '', error: error.message });
    }
});

module.exports = router;
