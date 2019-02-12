const express = require('express');
const path = require('path');
var caller = require('./apiCaller');
const app = new express();
const port = 4040;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(request, response){
    const root = ".\\";
    response.sendFile('.\\index.html', {root: root});
});

caller.fetchData().then(function(result) {
    app.get('/height', function(req, res) {
        res.send({debt: result});
    });
});

app.listen(port);
console.log("Listening at port " + port);