const { addAlias } = require('module-alias');

addAlias('@application', __dirname + '/application');
addAlias('@types', __dirname + '/application');
require('module-alias/register');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
