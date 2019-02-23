function sendToxicityRequest(data, callback){
  var spinner = startSpinner()
  chrome.storage.sync.get(['threshold'], function(result) {
  	fetch("http://localhost:5000/api",
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
  var target = document.querySelector('[data-test-id="post-content"]');
  var spinner = new Spinner({}).spin(target);
  return spinner
}