require("dotenv").config();

require("./modules");
const application = require("./application").default;

application.init().then(() => application.start());

export {};
