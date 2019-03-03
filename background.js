chrome.browserAction.onClicked.addListener(function(tab)
{

});
chrome.storage.sync.set({threshold: 0}, function() {
          // console.log('Value is set to ' + value);
        });
var ports = {};
var id = 0;

chrome.runtime.onConnect.addListener(function(port) {
	port.onMessage.addListener(function(request){
		if(port.name == 'site')
		{
			console.log('site loaded')
			ports.site = port;
			id = port.sender.tab.id;
			port.postMessage({action:"start"});
		}
	})
})
chrome.runtime.onMessage.addListener(function(request){
	if(request.action=='reload')
	{
		ports.site.postMessage({action:"eval",func:'location.reload()'});
	}
});

function DoPort(func){
	ports.site.postMessage({action:"eval",func:func});
}

function DoConnect(id,func){

		chrome.tabs.sendMessage(id,{func:func})

	
}

