//------------------------------------------------------------------------------
// Copyright 2018 IBM Corp. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//------------------------------------------------------------------------------

var express = require('express');
var routes = require('./routes');
var contact = require('./routes/contact')
var request = require('request');
var http = require('http');
var path = require('path');
var ibmdb = require('ibm_db');
var stringify = require('json-stringify');
require('cf-deployment-tracker-client').track();


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
var db2;
var hasConnect = false;

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

if (process.env.VCAP_SERVICES) {
    var env = JSON.parse(process.env.VCAP_SERVICES);
	if (env['dashDB']) {
        hasConnect = true;
		db2 = env['dashDB'][0].credentials;
	}

}

if ( hasConnect == false ) {

   db2 = {
        db: "BLUDB",
        hostname: "dashdb-entry-yp-dal09-08.services.dal.bluemix.net",
        port: 50000,
        username: "dash14958",
        password: "zx_XHRK9d9_y"
     };
}

var connString = "DRIVER={DB2};DATABASE=" + db2.db + ";UID=" + db2.username + ";PWD=" + db2.password + ";HOSTNAME=" + db2.hostname + ";port=" + db2.port;

app.use(bodyParser.urlencoded());
app.get('/', routes.lookupRecords(ibmdb,connString));
//  app.get('/lookup',routes.lookupRecords(ibmdb,connString));


//app.get('/new', function(req,res){
//  res.render('new_entry');
app.post('/new',contact.addContact(ibmdb,connString));
//});

//app.post('/result', function(req,res))





http.createServer(app).listen(app.get('port'), function(){
console.log('Express server listening on port ' + app.get('port'));

});
