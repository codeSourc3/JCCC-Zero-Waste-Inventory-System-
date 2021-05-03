'use strict';

/**@type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas');

const inchesToPixels = (inches) => {
    // The standard that most use is 96 pixels per inch.
    const dpi = 96;
    let pixels = inches * dpi;
    return pixels;
};

const options = {
    errorCorrectionLevel: 'H',
    
    
    width: inchesToPixels(2)
};

/**
 * Generates a QR Code of the value and displays it on the canvas provided.
 * 
 * @param {HTMLCanvasElement} canvas the canvas to draw on.
 * @param {string} value the value to encode to a QR code.
 * @returns Promise<string> with the data URL of the resource.
 */
const generateQRUrl = (canvas, value) => {
    return new Promise((resolve, reject) => {
        QRCode.toDataURL(canvas, value, options, (error, url) => {
            if (error) reject(error);
            resolve(url);
        });
    });
};

/**
 * Generates a QR code and draws it on the canvas.
 * 
 * @param {HTMLCanvasElement} canvas the canvas to draw on.
 * @param {string} value the value to encode into the QR code.
 * @returns Promise<void> if the QR code is generated on the canvas.
 */
const generateQRCanvas = (canvas, value) => {
    return new Promise((resolve, reject) => {
        QRCode.toCanvas(canvas, value, options, err => {
            if (err) reject(err);
            resolve();
        });
    });
};


/**
 * Draws a QR Code using the value.
 * 
 * @param {string} value the value to make the QR code out of.
 * @returns Promise<string> a promise containing the data url of the 
 * QR code resource.
 */
const drawQRCode = async (value) => {
    const context = canvas.getContext('2d');
    // Draw a label at the bottom
    const url = await generateQRUrl(canvas, value);
    context.font = '18px Arial';
    let {width} = context.measureText(String(value));
    let textMiddle = width / 2;
    let startX = (canvas.width / 2) - textMiddle;
    context.fillText(value, startX, canvas.height);
    context.stroke();
    return url;
};

drawQRCode(`Bin Id: ${4}`).then((url) => {
    console.log('Generated QR Code');
    console.assert(typeof(url) === 'string');
    console.log('URL: ', url);
});