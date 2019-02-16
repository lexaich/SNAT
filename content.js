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
			var content = $(data).find('.js-tweet-text-container')[0]
			GLOBAL_DATA.old_text[key] = ($(content).html())

			var text =  $(content).find('a,img').remove()
			text = $(content).text()
			$(content).append('<a class="lock" data-index="'+key+'">Lock here</a>')
			arr_send[key] = text
		}

	})

	function callback(answ) {
		answ.forEach((item,index)=>{

			if(item!='undefined'){

				var post = $('.js-stream-item[data-item-id = '+item+']')
				var content = $(post).find('.js-tweet-text-container')[0]
				$(content).html(`
					<a class="unlock" data-index="`+item+`">This post is marked as toxic. Click here to show text</a>
				`)
			}
		})
	}

	// send(arr_send, callback)
}

$(document).on('click', '.unlock', function(e){
	e.preventDefault()
	var num = $(this).attr('data-index')
	// console.log(GLOBAL_DATA.old_text[num])
	$(this).parent().html(GLOBAL_DATA.old_text[num])
});
$(document).on('click', '.lock', function(e){
	e.preventDefault()
	// console.log(this)
	var key = $(this).attr('data-index')
	var post = $('.js-stream-item[data-item-id = '+key+']')
	var content = $(post).find('.js-tweet-text-container')[0]
	GLOBAL_DATA.old_text[key] = ($(content).html())
	$(content).html(`
					<a class="unlock" data-index="`+key+`">This post is marked as toxic. Click here to show text</a>
				`)
});


$('ol.stream-items').on("DOMNodeInserted", function (event) {

	if(!GLOBAL_DATA.analyze){
		GLOBAL_DATA.analyze = true
		// console.log('loop')
		action()
	}else{

	}
	
});


function send(mess, callback){
  var out = []

  var data = mess
  $.ajax({
    url:'http://localhost:5000/api',
    method: "POST",
    data: JSON.stringify(data),
    dataType:'json',
    success:function(res){
      callback(res)
    },
    error:function(err){
      console.log(err)
    }
  })
}



function rand(min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function ID(str)
{
  return '_' + Math.random().toString(36).substr(2, 9);
};

