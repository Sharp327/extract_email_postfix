const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path as necessary

const ExtractedData = sequelize.define('ExtractedData', {
    subject: { type: DataTypes.STRING },
    from: { type: DataTypes.STRING },
    sent: { type: DataTypes.STRING },
    to: { type: DataTypes.STRING },
    reservationId: { type: DataTypes.STRING },
    youEarn: { type: DataTypes.STRING },
    totalDistanceIncluded: { type: DataTypes.STRING },
    tripStart: { type: DataTypes.STRING },
    tripEnd: { type: DataTypes.STRING },
    guestName: { type: DataTypes.STRING },
    guestPhone: { type: DataTypes.STRING },
    location: { type: DataTypes.STRING },
}, {
    tableName: 'extracted_data',
});


module.exports = ExtractedData;
