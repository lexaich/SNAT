var port = chrome.runtime.connect({name: "site"});

port.postMessage({message: "loaded site"});
function ready() {
	action()
    if($('html *').is('li.js-stream-item')){
    	$('html').css({'display':'block'})
    }else{
    	setTimeout(()=>{$('html').css({'display':'block'})},1000)
    }
  }
document.addEventListener("DOMContentLoaded", ready);

port.onMessage.addListener(function(request)
    {
        if(request.action == 'eval')
        {
            eval(request.func);
        }else if(request.action == 'start'){
        	$('html').css({'display':'none'})

        	
        }else if(request.action == 'set threshold'){
        	GLOBAL_DATA.threshold = request.threshold
        	console.log(request)
        }
    });

chrome.runtime.onMessage.addListener(request=>{
	eval(request.func);
})

var GLOBAL_DATA = {old_text:{},analyze:false,threshold:0}

function action(){

	setTimeout(function(){
		GLOBAL_DATA.analyze = false
	},5000)
	// console.log($('.permalink-container *').is('.permalink-replies'))
	var arr_send = {}
	$(document).find('ul.b-messages-thread > li[data-analyze != true]').each((index,item)=>{
		
		var key = $(item).attr('id')

		if(key!='undefined'){

			item.setAttribute("data-analyze","true")
			var content = $(item).find('.content')[0]
			// var content = $(data).find('.js-tweet-text-container')[0]
			GLOBAL_DATA.old_text[key] = ($(content).html())
			
			

			var text =  $(content).find('a,img').remove()
			text = $(content).text()
			// console.log(text)
			// lock(undefined,key)
			$(content).html(`
					<a class="unlock" data-index="`+key+`">This post is marked as toxic. Click here to show text</a>
				`)
			// $(content).append('<a class="lock" data-index="'+key+'">Lock here</a>')
			arr_send[key] = text
		}

	})

	function callback(answ) {
		// console.log(answ)
		answ.forEach((key)=>{

			if(key!='undefined'){
				var post = $('li#'+key)
				var content = $(post).find('.content')[0]
				$(content).html(GLOBAL_DATA.old_text[key])
				
				// delete GLOBAL_DATA.old_text[key]
				$(content).append('<a class="lock" data-index="'+key+'">Lock here</a>')
			}
		})
	}

	send(arr_send, callback)
}

function unlock(e,key){
	if(e){
		e.preventDefault()
		var key = $(this).attr('data-index')
	}	
	var post = $('li#'+key)
	var content = $(post).find('.content')[0]
	$(this).parent().html(GLOBAL_DATA.old_text[key])
	// delete GLOBAL_DATA.old_text[key]
	$(content).append('<a class="lock" data-index="'+key+'">Lock here</a>')
}

function lock(e,key){
	if(e){
		e.preventDefault()
		var key = $(this).attr('data-index')
	}
	var post = $('li#'+key)
	var content = $(post).find('.content')[0]
	$(content).find('a.lock').remove()
	GLOBAL_DATA.old_text[key] = ($(content).html())
	$(content).html(`
					<a class="unlock" data-index="`+key+`">This post is marked as toxic. Click here to show text</a>
				`)
}

$(document).on('click', '.unlock', unlock);
$(document).on('click', '.lock', lock);


$(document).on("DOMNodeInserted", function (event) {

	if(!GLOBAL_DATA.analyze){
		GLOBAL_DATA.analyze = true
		action()
	}else{

	}
	
});







function rand(min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function ID(str)
{
  return '_' + Math.random().toString(36).substr(2, 9);
};

