// utils/logger.js
import fs from 'fs';
import path from 'path';

var __dirname = path.dirname(new URL(import.meta.url).pathname);
__dirname = __dirname.replace("%20", " ");
const logDirectory = path.join(__dirname, '../../request_logs');
fs.mkdirSync(logDirectory, { recursive: true }); // Create logs directory recursively

const logRequest = (req, res, next) => {
    const { method, url } = req;
    const timestamp = new Date().toISOString();
    const logMessage = `${method} => ${url} - ${timestamp}\n`;

    fs.appendFile(path.join(logDirectory, 'requests.log'), logMessage, (err) => {
        if (err) {
            console.error('Failed to write log:', err);
        }
    });
    next();
};

export default logRequest;
