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

var GLOBAL_DATA = {}

function action(){
	$('.js-stream-item').each((index,item)=>{

		var data = $(item).find('.content')[0]
		// var header = $(data).find('.stream-item-header')[0]
		var content = $(data).find('.js-tweet-text-container')[0]
		// var footer = $(data).find('.ProfileTweet-actionList')[0]

		// console.log($(content).text())

		//var post = $('.js-stream-item')[1]
		//$(post).wrap('<div id="custom" style="opacity:0.2"></div>'); // обертка целевого элемента в свой собственный
		// $('#custom').css({"opacity":'1'})

	})

}

function send(mess){
	var data = {mess:mess}
	console.log(data)
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
}


// $(post).css({"display":"block","opacity":0})



