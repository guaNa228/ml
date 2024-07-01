const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Import CORS package

const app = express();
const PORT = 3000;

// Middleware to handle urlencoded and json body data
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

// POST endpoint to receive and save image data
app.post('/save-image', (req, res) => {
    const { imageData, folderName } = req.body;

    // Check if folderName is valid to prevent directory traversal attacks
    // if (!/^[А-Яа-я]+$/.test(folderName)) {
    //     return res.status(400).send('Invalid folder name.');
    // }

    const base64Data = imageData.replace(/^data:image\/png;base64,/, '');
    const dirPath = path.join(__dirname, folderName);

    // Create the folder if it doesn't exist
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    const filePath = path.join(dirPath, `${Date.now()}.png`);

    // Save the image file
    fs.writeFile(filePath, base64Data, 'base64', (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error saving the image.');
        }

        res.send('Image saved successfully.');
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});