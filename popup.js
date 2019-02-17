// var button_set = document.getElementById("set");
// button_set.addEventListener("click", function(e){
// 	var num = Number(document.getElementById("number").value)/4
// 	// chrome.runtime.sendMessage(chrome.runtime.id,{action:'set threshold',threshold:num})
// 	chrome.storage.sync.set({threshold: num}, function() {
//           // console.log('Value is set to ' + value);
//         });

// })

chrome.storage.sync.get(['threshold'], function(result) {

	$("#slider").slider({
	value:result.threshold*10,
	min: 0,
	max: 10,
	step: 1,
	slide: function( event, ui ) {
		$( "#number" ).val( ui.value );	
		
		chrome.storage.sync.set({threshold: ui.value/10}, function() {  });
	}
});

    });



