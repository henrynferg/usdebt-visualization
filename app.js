const express = require('express');
const path = require('path');
const app = new express();
const port = 4040;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(request, response){
    const root = "C:\\Users\\henry\\Desktop\\usdebt";
    response.sendFile('.\\index.html', {root: root});
});
app.listen(port);
console.log("Listening at port " + port);