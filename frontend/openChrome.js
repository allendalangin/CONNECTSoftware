const { exec } = require("child_process");

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"; // Update to your Chrome path if different
const chromeFlags = `--disable-web-security --user-data-dir="C:/temp-chrome-data"`; // Disable CORS security

exec(`"${chromePath}" ${chromeFlags} http://localhost:3000`, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error launching Chrome: ${error.message}`);
        return;
    }

    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }

    console.log(`stdout: ${stdout}`);
});
