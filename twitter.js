var port = chrome.runtime.connect({name: "site"});

port.postMessage({message: "loaded site"});
function ready() {
	action()
    $('body').css({'display':'block'})
  }
document.addEventListener("DOMContentLoaded", ready);

port.onMessage.addListener(function(request)
    {
        if(request.action == 'eval')
        {
            eval(request.func);
        }else if(request.action == 'start'){
        	$('body').css({'display':'none'})

        	
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
	var arr_send = {}
	$(document).find('li.js-stream-item[data-analyze != true]').each((index,item)=>{
		
		var key = $(item).attr('data-item-id')

		if(key!='undefined'){

			item.setAttribute("data-analyze","true")
			var data = $(item).find('.content')[0]
			var content = $(data).find('.js-tweet-text-container')[0]
			GLOBAL_DATA.old_text[key] = ($(content).html())
			
			

			var text =  $(content).find('a,img').remove()
			text = $(content).text()
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
				var post = $('.js-stream-item[data-item-id = '+key+']')

				var content = $(post).find('.js-tweet-text-container')[0]
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
	var post = $('.js-stream-item[data-item-id = '+key+']')
	var content = $(post).find('.js-tweet-text-container')[0]
	$(this).parent().html(GLOBAL_DATA.old_text[key])
	// delete GLOBAL_DATA.old_text[key]
	$(content).append('<a class="lock" data-index="'+key+'">Lock here</a>')
}

function lock(e,key){
	if(e){
		e.preventDefault()
		var key = $(this).attr('data-index')
	}
	var post = $('.js-stream-item[data-item-id = '+key+']')
	var content = $(post).find('.js-tweet-text-container')[0]
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


function send(mess, callback){
  var out = []

  chrome.storage.sync.get(['threshold'], function(result) {
  	// console.log(result)
  	  var data = {"threshold": result.threshold, "messages": mess}
  	  fetch("http://localhost:5000/api",
		{
		    headers: {
		      'Accept': 'application/json',
		      'Content-Type': 'application/json'
		    },
		    method: "POST",
		    body: JSON.stringify(data)
		})
		.then(function(res){ callback(res) })
		.catch(function(res){ console.log(res) })
	  // $.ajax({
	  //   url:'http://localhost:5000/api',
	  //   method: "POST",
	  //   data: JSON.stringify(data),
	  //   dataType:'json',
	  //   success:function(res){
	  //   	callback(res)
	  //   },
	  //   error:function(err){
	  //   	console.log(err)

	  //   }
	  // })
    });
}




function rand(min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function ID(str)
{
  return '_' + Math.random().toString(36).substr(2, 9);
};

