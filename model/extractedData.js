const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'mysql', // or 'postgres', 'sqlite', etc.
});

const Reservation = sequelize.define('Reservation', {
    reservationId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    earn: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    distance: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    tripStart: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tripEnd: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    guestName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    guestPhone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = { Reservation };
