const express = require('express');
const path = require('path');
const schedule = require('node-schedule');
const moment = require('moment');
var caller = require('./apiCaller');
const app = new express();
const port = 4040;

var updateDebtData = function() {
    caller.fetchData().then(function(result) {
        app.get('/debt', function(req, res) {
            res.send({debt: result});
        });
    });
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(request, response){
    const root = ".\\";
    response.sendFile('.\\index.html', {root: root});
});

updateDebtData();
var jobDate = moment().startOf('day');
schedule.scheduleJob(jobDate, updateDebtData);

app.listen(port);
console.log("Listening at port " + port);