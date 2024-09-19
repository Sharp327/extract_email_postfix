const sequelize = require('./config/database');
const processAndSaveData = require('./services/extractAndSave');

// Sync database and run the extractor
async function run() {
    try {
        await sequelize.sync(); // Sync models to DB
        console.log('Database connected and synced.');

        const logFilePath = './logs/turo_trips.log'; // Path to log file
        processAndSaveData(logFilePath); // Extract and save data
    } catch (error) {
        console.error('Error during the execution:', error);
    }
}

run();
