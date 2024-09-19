const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ExtractedData = sequelize.define('ExtractedData', {
    subject: DataTypes.STRING,
    from: DataTypes.STRING,
    sent: DataTypes.STRING,
    to: DataTypes.STRING,
    reservationId: DataTypes.STRING,
    youEarn: DataTypes.STRING,
    totalDistanceIncluded: DataTypes.STRING,
    tripStart: DataTypes.STRING,
    tripEnd: DataTypes.STRING,
    guestName: DataTypes.STRING,
    guestPhone: DataTypes.STRING,
    location: DataTypes.STRING,
}, {
    timestamps: false
});

module.exports = ExtractedData;
