const { addAlias } = require("module-alias");
addAlias("@application", __dirname + "/application");
addAlias("@types", __dirname + "/application");
require("module-alias/register");
require("dotenv").config();

require("./modules");
const application = require("./application").default;

application.init().then(() => application.start());

export {};
