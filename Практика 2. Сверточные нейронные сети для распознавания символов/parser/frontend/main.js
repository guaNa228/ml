document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let painting = false;

    function startPosition(e) {
        painting = true;
        draw(e); // This ensures that drawing starts immediately on mousedown without needing to move the mouse.
    }

    function endPosition() {
        painting = false;
        ctx.beginPath(); // This ends the current drawing path and starts a new one, preventing lines from connecting to different drawing actions.
    }

    function draw(e) {
        if (!painting) return;

        ctx.lineWidth = 1; // Set the line width or make it dynamic based on your requirements
        ctx.lineCap = 'round'; // This makes the line ends rounded

        // Get the correct mouse position relative to the canvas
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath(); // Begin a new path to create a continuous line
        ctx.moveTo(x, y);
    }

    // Event listeners to handle mouse actions
    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', endPosition);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseout', endPosition); // End drawing if the mouse leaves the canvas

    window.saveImage = function () {
        const alphabetDropdown = document.getElementById('alphabetDropdown');
        const selectedLetter = alphabetDropdown.value;
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        // Create a temporary canvas
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');

        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;

        // Fill the temporary canvas with white background
        tempCtx.fillStyle = '#FFFFFF'; // White color
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        // Draw the original canvas's content over the white background
        tempCtx.drawImage(canvas, 0, 0);

        // Generate the image data URL from the temporary canvas
        const imageDataURL = tempCanvas.toDataURL('image/png');

        // Proceed with sending the imageDataURL to the server as before
        // The part of sending the data to the server remains unchanged
        fetch('http://localhost:3000/save-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageData: imageDataURL, folderName: selectedLetter }),
        })
            .then(response => response.text())
            .then(data => {
                console.log(data); // Show success or error message
            })
            .catch((error) => {
                console.error('Error:', error);
            });

        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
});