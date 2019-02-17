function send(mess, callback){

  // var out = []
  // console.log(mess)
  chrome.storage.sync.get(['threshold'], function(result) {
  	// console.log(result)
  	  var data = {"threshold": result.threshold, "messages": mess}
  	  // console.log(data)

  	  fetch("http://localhost:5000/api",
		{

		    method: "POST",
		    body: JSON.stringify(data)
		})
		.then(function(res){ return res.json() })
		.then(res=>{callback(res)})
		.catch(function(res){ console.log(res) })


    });

}
