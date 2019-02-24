var API_PATH = "http://34.73.86.221/api"

function sendToxicityRequest(data, callback){
  var spinner = startSpinner()
  chrome.storage.sync.get(['threshold'], function(result) {
  	fetch(API_PATH,
		{
	    method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
	    body: JSON.stringify(data)
		})
		.then(function(res){ return res.json() })
		.then(res => {
      callback(res)
    })
    .then(() => {
      console.log("Request received")
      spinner.stop()
    })
		.catch(function(res){ console.log(res) })
  });
}

function startSpinner() {
  var target = document.querySelector('body');
  var spinner = new Spinner({}).spin(target);
  return spinner
}