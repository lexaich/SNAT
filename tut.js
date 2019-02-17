var port = chrome.runtime.connect({name: "site"});

port.postMessage({message: "loaded site"});
function ready() {
	action()
    console.log()
    if($('body *').is('.themaCommentTable > tbody > tr')){
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
	var arr_send = {}

	$(document).find('.themaCommentTable > tbody > tr[data-analyze != true]').each((index,item)=>{
		var post = $(item).find('.themaCommentRight')

		var key = $($(post).find('a')[0]).attr('name')
		if(key!='undefined'){

			item.setAttribute("data-analyze","true")

			var content = $(post).find('.row-content-tut')
			$(content).css({"font-size":"18px"})
			GLOBAL_DATA.old_text[key] = ($(content).html())
			var text = $(content).find('a,br,img').remove()
			text = $(content).text()
			
			$(content).html(`
					<a class="unlock" data-index="`+key+`">This post is marked as toxic. Click here to show text</a>
				`)
			// console.log(text)
			arr_send[key] = text
		}

	})

	function callback(answ) {
		answ.forEach((key)=>{


			var id_post = $(document).find('a[name='+key+']')
			var post = $(id_post).parent()
			var content = $(post).find('.row-content-tut').html(GLOBAL_DATA.old_text[key])
			$(content).append('<a class="lock" data-index="'+key+'">Lock here</a>')
		})
	}
	// console.log(arr_send)
	send(arr_send, callback)
}

function unlock(e,key){
	
	if(e){
		e.preventDefault()
		var key = $(this).attr('data-index')
	}
	
	var id_post = $(document).find('a[name='+key+']')
	var post = $(id_post).parent()
	var content = $(post).find('.row-content-tut').html(GLOBAL_DATA.old_text[key])

	$(content).append('<a class="lock" data-index="'+key+'">Lock here</a>')
}

function lock(e,key){
	if(e){
		e.preventDefault()
		var key = $(this).attr('data-index')
	}
	var id_post = $(document).find('a[name='+key+']')
	var post = $(id_post).parent()
	var content = $(post).find('.row-content-tut').html(GLOBAL_DATA.old_text[key])

	$(content).html(`
					<a class="unlock" data-index="`+key+`">This post is marked as toxic. Click here to show text</a>
				`)
}

$(document).on('click', '.unlock', unlock);
$(document).on('click', '.lock', lock);


$(document).on("DOMNodeInserted", function (event) {

	if(!GLOBAL_DATA.analyze){
		GLOBAL_DATA.analyze = true
		console.log('loop')
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
