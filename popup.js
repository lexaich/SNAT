var button_set = document.getElementById("set");
button_set.addEventListener("click", function(e){
	var num = Number(document.getElementById("number").value)/4
	// chrome.runtime.sendMessage(chrome.runtime.id,{action:'set threshold',threshold:num})
	chrome.storage.sync.set({threshold: num}, function() {
          // console.log('Value is set to ' + value);
        });

})

$("#slider").slider({
	value:0,
	min: 0,
	max: 3,
	step: 1,
	slide: function( event, ui ) {
		$( "#number" ).val( ui.value );
	}
});
$( "#number" ).val( $( "#slider" ).slider( "value" ) );

