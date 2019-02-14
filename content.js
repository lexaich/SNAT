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

// отлавливаем когда есть посты, собираем все строки и отправляем их на сервер предварительно обрав лишнее. записываем все посты по номерам что бы помнить если что какой из них нужно скрыть. скрывать посты посредством скрытия всего поста и замены его на псевдо объект который отрисует свою верстку на его месте с кнопкой раскрыть. функция раскрытия будет этот номер или даже просто этот объект поста убирать нашу верстку и возвращать исходный стиль

var GLOBAL_DATA = {old_text:[]}

function action(){
	var arr_send = []
	$('.js-stream-item').each((index,item)=>{

		var data = $(item).find('.content')[0]
		// var header = $(data).find('.stream-item-header')[0]
		var content = $(data).find('.js-tweet-text-container')[0]
		GLOBAL_DATA.old_text.push($(content).html())
		// var footer = $(data).find('.ProfileTweet-actionList')[0]
		arr_send.push($(content).text())
		

	})
	var answ = send(arr_send)
	answ.forEach((item,index)=>{
		if(item){
			var post = $('.js-stream-item')[index]
			var content = $(post).find('.js-tweet-text-container')[0]
			
			$(content).html(`
				<a class="unlock" data-index="`+index+`">unlock</a>
			`)
		}
	})

$(document).on('click', '.unlock', function(e){
	e.preventDefault()
	var num = $(this).attr('data-index')
	console.log(GLOBAL_DATA.old_text[num])
	$(this).parent().html(GLOBAL_DATA.old_text[num])
});





}



function send(mess){
	var out = []
	mess.forEach(item=>{
		if(rand(0,1)){
			out.push(true)
		}else{
			out.push(false)
		}
	})
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


// $(post).css({"display":"block","opacity":0})



function rand(min, max)
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}