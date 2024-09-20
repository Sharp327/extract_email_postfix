const ExtractedData = require('../models/ExtractedData');
const fs = require('fs');
const readline = require('readline');

// Adjusted regex pattern to be more flexible with line breaks and encoding issues
function extractFields(data) {
    let emailContent = removeUnneccessaryPart(data);
    const sections = emailContent.split('\n');
    
    const parsedData = {};
    let skipLines = 0;

    sections.forEach((line, index) => {
        if (skipLines > 0) {
            skipLines--;
            return; // Skip the current line
        }

        if (line.includes('From:')) {
            parsedData.from = line.split('From:')[1].trim();
        } else if (line.includes('Sent:') || line.includes('Date:')) {
            parsedData.sent = line.split(/Sent:|Date:/)[1].trim();
        } else if (line.includes('To:')) {
            parsedData.to = line.split('To:')[1].trim().split(' ')[0]; // Get only the email
        } else if (line.includes('Subject:')) {
            parsedData.subject = line.split('Subject:')[1].trim();
        } else if (line.startsWith('You earn')) {
            parsedData.youEarn = extractWithNextLines(line, sections, index, 1);
            skipLines = 1; // Skip next line
        } else if (line.startsWith('Total distance included')) {
            parsedData.totalDistanceIncluded = extractWithNextLines(line, sections, index, 1);
            skipLines = 1; // Skip next line
        } else if (line.includes('Reservation ID')) {
            parsedData.reservationId = line.split('Reservation ID')[1].replace(/#/g, '').trim();
        } else if (line.startsWith('Trip start')) {
            parsedData.tripStart = extractWithNextLines(line, sections, index, 2);
            skipLines = 2; // Skip next two lines
        } else if (line.startsWith('Trip end')) {
            parsedData.tripEnd = extractWithNextLines(line, sections, index, 2);
            skipLines = 2; // Skip next two lines
        } else if (line.startsWith('Location')) {
            parsedData.location = extractWithNextLines(line, sections, index, 2);
            skipLines = 2; // Skip next two lines
        } else if (line.startsWith('About the guest')) {
            parsedData.guestName = sections[index + 1]?.trim(); // Next line
            parsedData.guestPhone = sections[index + 2]?.trim(); // Next line
            skipLines = 2; // Skip next two lines
        }
    });

    return parsedData;
}

// Helper function to extract current line and specified next lines
function extractWithNextLines(currentLine, sections, index, numberOfLines) {
    const extractedLines = [currentLine.split(': ')[1]?.trim()];
    for (let i = 1; i <= numberOfLines; i++) {
        extractedLines.push(sections[index + i]?.replace(/\*/g, '').trim());
    }
    return extractedLines.filter(Boolean).join(' '); // Join and remove any undefined
}

function removeUnneccessaryPart(inputString) {
    return inputString.replace(/\[.*?\]/g, '').replace(/<http[^>]*>/g, '').replace(/<noreply@mail\.turo\.com>/g, '').replace(/^\s*[\r\n]+/gm, '').replace(/=E2=80=AF/g, ' ').replace(/=E2=80=99/g, "'").replace(/=92/g, "'").trim();
}

async function saveToDatabase(extractedFields) {
    try {
        // Check if the reservation ID already exists in the database
        const existingRecord = await ExtractedData.findOne({
            where: { reservationId: extractedFields.reservationId }
        });

        if (existingRecord) {
            console.log('Record already exists:', extractedFields.reservationId);
            return; // Optionally return if you don't want to save
        }

        // If no existing record is found, save the new data
        await ExtractedData.create(extractedFields);
        console.log('Saved:', extractedFields.reservationId);
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

function processLogFile(logFilePath) {
    const rl = readline.createInterface({
        input: fs.createReadStream(logFilePath),
        crlfDelay: Infinity,
    });

    let currentDataBlock = '';
    let isRecording = false;

    rl.on('line', (line) => {
        if (line.startsWith('From:')) {
            // Start recording when we encounter the "From:" line
            isRecording = true;
        }

        if (isRecording) {
            // Stop recording if we hit "Download the Turo app"
            if (line.includes('Download the Turo app')) {
                const extractedFields = extractFields(currentDataBlock);
                if (Object.keys(extractedFields).length > 0) {
                    saveToDatabase(extractedFields);
                }
                // Reset current data block and stop recording
                currentDataBlock = '';
                isRecording = false;
            }else{
                currentDataBlock += line + '\n';
            }
        }
    });

    rl.on('close', () => {
        // Handle any remaining data after the file is fully read
        if (currentDataBlock) {
            const extractedFields = extractFields(currentDataBlock);
            if (Object.keys(extractedFields).length > 0) {
                console.log(extractedFields); // Replace with saveToDatabase(extractedFields);
            }
        }
    });
}

module.exports = processLogFile;
