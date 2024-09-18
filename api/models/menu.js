const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  items: [
    {
      name: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
      mealType: {
        type: String,
        required: true,
      },
    },
  ],
});

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
