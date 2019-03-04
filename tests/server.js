var express = require('express');
var app = express();
var cors = require('cors')

app.use(express.json({limit: '50mb'}));
app.use(cors())

app.post('/api', function(req, res){
  console.log(req.body)
  var keys = Object.keys(req.body)
  var responseJSON = {}
  keys.map((key) => {
    responseJSON[key] = 1
  })
  res.json(responseJSON);
});

app.post('/save', function(req, res){
  console.log(req.body)
  res.json({"saved": true});
});

app.listen(5000);