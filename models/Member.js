const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    purchaseAmount: {type: Number, default: 0},
    activities: [String]
  
});

const memberSchema = new mongoose.Schema({
    dateOfBirth: { type: Date, default: ''},
    name: String,
    title: String,
    fieldOfStudy: String,
    phoneOrEmail: String,
    totalPurchaseAmountLastMonth: Number,
    visitHistory: [visitSchema]
  
});

module.exports = mongoose.model('Member', memberSchema);
