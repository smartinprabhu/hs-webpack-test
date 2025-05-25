const Components = {};

Components.Internal = require('./app').default;
Components.External = require('./publicApp').default;

export default Components;
