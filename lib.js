function sendToxicityRequest(data, callback){
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
		.then(res=>{callback(res)})
		.catch(function(res){ console.log(res) })
  });

}
