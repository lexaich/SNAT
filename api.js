var ToxicAPI = {
  sendToxicityRequest: function(data, callback) {
    ToxicAPI._sendBackgroundRequest("sendToxicityRequest", data, callback)
  },
  sendSaveToxicityRequest: function(data, callback) {
    ToxicAPI._sendBackgroundRequest("sendSaveToxicityRequest", data, callback)
  },
  _sendBackgroundRequest: function(action, data, callback) {
    var port = chrome.runtime.connect({name: "api"});
    port.postMessage({
      action: action, 
      data: data
    });
    port.onMessage.addListener(function(response) {
      console.log(response)
      callback(response.data)
    });
  }
}