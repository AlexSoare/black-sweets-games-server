const mongoose = require("mongoose");
const URL =
  "mongodb+srv://bsg_admin:bestciocolata@cluster0.p9nzc.mongodb.net/DB_0?retryWrites=true&w=majority";

const connectDB = async (connectedCallback) => {
  try {
    let connection = await mongoose.connect(URL).then(
      () => {
        console.log("DB Connected");
        connectedCallback(true);
      },
      (err) => {
        console.log("DB Connection error", err);
        connectedCallback(false);
      }
    );
  } catch {}
};

module.exports = connectDB;
