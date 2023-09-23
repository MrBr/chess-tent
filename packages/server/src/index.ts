import './bootstrap';

require('./modules');
const application = require('./application').default;

application.init().then(() => application.start());

export {};
