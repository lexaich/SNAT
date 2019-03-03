var API_PATH = "http://34.73.86.221/"

var Toxic = {
  sendToxicityRequest: function(data, callback) {
    Toxic.sendRequest("api", data, callback)
  },
  sendSaveToxicityRequest: function(data, callback) {
    Toxic.sendRequest("save", data, callback)
  },
  sendRequest: function(action, data, callback){
    var spinner = Toxic.startSpinner()
    fetch(API_PATH + action, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(function(res) { 
      return res.json() 
    })
    .then(res => {
      callback(res)
    })
    .then(() => {
      console.log("Request received")
      spinner.stop()
    })
    .catch(function(e){ 
      console.log(e) 
    })
  },  
  startSpinner: function() {
    var target = document.querySelector('body');
    var spinner = new Spinner({}).spin(target);
    return spinner
  }
}