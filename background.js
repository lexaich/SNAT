chrome.browserAction.onClicked.addListener(function(tab)
{

});

var ports = {};
var id = 0;

chrome.runtime.onConnect.addListener(function(port) {
// console.log(port);
	port.onMessage.addListener(function(request){
		// console.log(port,request);
		if(port.name == 'site')
		{
			console.log('site loaded')
			ports.site = port;
			id = port.sender.tab.id;
			port.postMessage({action:"start"});
		}
	})
})

function DoPort(func){
	ports.site.postMessage({action:"eval",func:func});
}

function DoConnect(id,func){

		chrome.tabs.sendMessage(id,{func:func})

	
}

