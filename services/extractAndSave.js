const { ExtractedData } = require('../models/extractedData');
const fs = require('fs');

// Function to extract fields from data
function extractFields(data) {
    const fieldPattern = /Subject:\s*(.*?)\nFrom:\s*(.*?)\nSent:\s*(.*?)\nTo:\s*(.*?)\nReservation ID: (\d+)\nYou earn: (.*?)\nTotal distance included: (.*?)\nTrip start: (.*?)\nTrip end: (.*?)\nGuest Name: (.*?) -.*\nGuest Phone: \((.*?)\)\nLocation: (.*?)/g;
    const extractedFields = [];

    let match;
    while ((match = fieldPattern.exec(data)) !== null) {
        extractedFields.push({
            subject: match[1].trim(),
            from: match[2].trim(),
            sent: match[3].trim(),
            to: match[4].trim(),
            reservationId: match[5].trim(),
            youEarn: match[6].trim(),
            totalDistanceIncluded: match[7].trim(),
            tripStart: match[8].trim(),
            tripEnd: match[9].trim(),
            guestName: match[10].trim(),
            guestPhone: match[11].trim(),
            location: match[12].trim(),
        });
    }
    console.log(extractedFields);

    return extractedFields;
}

// Function to save extracted data to the database
async function saveToDatabase(extractedFields) {
    for (const fields of extractedFields) {
        try {
            await ExtractedData.create(fields);
            console.log('Saved:', fields);
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }
}

// Main function to extract and save data
function processAndSaveData(logFilePath) {
    fs.readFile(logFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        const extractedFields = extractFields(data);
        saveToDatabase(extractedFields);
    });
}

module.exports = processAndSaveData;
