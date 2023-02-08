const mongoose = require("mongoose");

const { MONGO_URI } = process.env;

exports.connectDB = () => {
  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("connected to DB"))
    .catch((err) => {
      console.error("something went wrong!");
      console.error(err);
      process.exit(1);
    });
};
