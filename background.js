var API_PATH = "http://35.185.0.201/"
var ACTIONS = {
  "sendToxicityRequest": "api",
  "sendSaveToxicityRequest": "save"
}

function _fetchRequest(action, data, callback){
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
  .catch(function(e){ 
    console.log(e) 
  })
}

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener(function(request) {
    _fetchRequest(ACTIONS[request.action], request.data, (response) => {
      port.postMessage({
        action: request.action,
        data: response,
      });
    })
  });
})