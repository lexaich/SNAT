
var port = chrome.runtime.connect({name: "site"});

port.postMessage({message: "loaded site"});

port.onMessage.addListener(function(request)
    {
        if(request.action == 'eval')
        {
            eval(request.func);
        }else if(request.action == 'start'){
        	action()
        }
    });

chrome.runtime.onMessage.addListener(request=>{
	eval(request.func);
})

var GLOBAL_DATA = {old_text:{},analyze:false}

function action(){
	setTimeout(function(){
		GLOBAL_DATA.analyze = false
	},5000)
	var arr_send = {}
	$(document).find('li.js-stream-item[data-analyze != true]').each((index,item)=>{

		var key = $(item).attr('data-item-id')
		if(key!='undefined'){
			var data = $(item).find('.content')[0]
			item.setAttribute("data-analyze","true")
			// var header = $(data).find('.stream-item-header')[0]
			var content = $(data).find('.js-tweet-text-container')[0]
			
			GLOBAL_DATA.old_text[key] = ($(content).html())

			var text =  $(content).find('a,img').remove()
			text = $(content).text()

			arr_send[key] = text
		}

	})
	var answ = send(arr_send)

	answ.forEach((item,index)=>{

		if(item!='undefined'){

			var post = $('.js-stream-item[data-item-id = '+item+']')
			var content = $(post).find('.js-tweet-text-container')[0]
			$(content).html(`
				<a class="unlock" data-index="`+item+`">unlock</a>
			`)
		}
	})
}

$(document).on('click', '.unlock', function(e){
	e.preventDefault()
	var num = $(this).attr('data-index')
	// console.log(GLOBAL_DATA.old_text[num])
	$(this).parent().html(GLOBAL_DATA.old_text[num])
});


$('ol.stream-items').on("DOMNodeInserted", function (event) {

	if(!GLOBAL_DATA.analyze){
		GLOBAL_DATA.analyze = true
		// console.log('loop')
		action()
	}else{

	}
	
});


function send(mess){
	var out = []
	for(var key in mess){
		if(rand(0,1)){
			out.push(key)
		}
	}

	// var data = {mess:mess}
	// console.log(data)
	// $.ajax({
	// 	url:'',
	// 	data:data,
	// 	dataType:'json',
	// 	success:function(res){
	// 		console.log(res)
	// 	},
	// 	error:function(err){
	// 		console.log(err)
	// 	}
	// })
	return out
}



function rand(min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function ID(str)
{
  return '_' + Math.random().toString(36).substr(2, 9);
};

