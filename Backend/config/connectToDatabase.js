const mongoose = require('mongoose');

const connectToDatabase = async () => {
  try {
    const dbURI = "mongodb+srv://mdmd161918:SBYl9TUyUYegrmKH@admin.av7fjm4.mongodb.net/";
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

module.exports = connectToDatabase;
