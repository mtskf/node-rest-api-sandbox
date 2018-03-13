'use strict';

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnimalSchema = new Schema({
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    color: {
      type: String,
      required: true,
      trim: true
    },
    weight: {
      type: Number,
      required: true,
      trim: true
    },
    feeding: {
      type: String,
      default: "omnivorous",
      trim: true
    }
});

const Animal = mongoose.model('Animal', AnimalSchema);
module.exports.Animal = Animal;
