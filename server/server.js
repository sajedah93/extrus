var express = require('express');
var mongoose = require('mongoose');

var app = express();

 var mongoURI =  process.env.CUSTOMCONNSTR_MONGOLAB_URI || 'mongodb://localhost/extrus';
// connect to mongo database named "extrus"
mongoose.connect(mongoURI);

// configure our server with all the middleware and routing
require('./config/middleware.js')(app, express);
require('./config/routes.js')(app, express);

// start listening to requests on port 8000
app.listen(8000);

// export our app for testing and flexibility, required by index.js
module.exports = app;
