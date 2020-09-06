var express = require('express');
var app = express();

app.use(express.static('build'));

const port = process.env.PORT || 80;
var server = app.listen(port, () => {
    console.log('listening on port: ' + port);
});
