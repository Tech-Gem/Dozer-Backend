'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const BookingStatus = {
    Pending : "Pending",
    Approved : "Approved",
    Rejected : "Rejected"
  }
  const ReturnPolicy = {
    Refundable : "Refundable",
    NonRefundable:"NonRefundable"
  }
  const PaymentOption = {
    TeleBirr:"TeleBirr",
    Chapa:"Chapa"
  }

  class Booking extends Model {
    static associate(models) {
      Booking.belongsTo(models.Equipment, {
        foreignKey: 'equipmentId',
        onDelete: 'CASCADE',
      });
    }
  }
  
  Booking.init({
    equipmentId: DataTypes.UUID,
    renterId: DataTypes.UUID,
    fullName:DataTypes.STRING,
    email:DataTypes.STRING,
    phoneNumber:DataTypes.STRING,
    legalDocument:DataTypes.STRING,
    guideline:DataTypes.BOOLEAN,
    bookings:DataTypes.ENUM(
      ReturnPolicy.Refundable,
      ReturnPolicy.NonRefundable
    ),
    status: DataTypes.ENUM(
      BookingStatus.Pending,
      BookingStatus.Approved,
      BookingStatus.Rejected
    ),
    payment: DataTypes.ENUM(
      PaymentOption.TeleBirr,
      PaymentOption.Chapa
    )
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};