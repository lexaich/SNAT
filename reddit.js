var port = chrome.runtime.connect({name: "site"});

port.postMessage({message: "loaded site"});
function ready() {
	$('html').css({'display':'block'})
	action()
    // if($('html *').is('li.js-stream-item')){
    	
    // }else{
    	// setTimeout(()=>{$('html').css({'display':'block'})},1000)
    // }
  }
document.addEventListener("DOMContentLoaded", ready);

port.onMessage.addListener(function(request)
    {
        if(request.action == 'eval')
        {
            eval(request.func);
        }else if(request.action == 'start'){

        	// $('html').css({'display':'none'})

        	
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
	// console.log('ffd')
	setTimeout(function(){
		GLOBAL_DATA.analyze = false
	},5000)
	// console.log($('.permalink-container *').is('.permalink-replies'))
	
	var scheme = {}
	var scheme_arr = []
	var place = $($($($($(document).find('div.Comment')[0]).parent()[0]).parent()[0]).parent()[0]).parent()[0]
	var comments = $(place).children('div')
	// console.log($(comments).children().children())
	// var data = $(document).find('div.Comment').each(function(index,item){

	var data = $.each(comments,function(index,item){
			// console.log(item)
		var post = $(item).children().children()

		// var post_lvl3 = $(item).parent()[0]
		// var post_lvl2 = $(post_lvl3).parent()[0]
		// var post_lvl1 = $(post_lvl2).parent()[0]

		var tredlines_container =  $(post).children('div')[0]
		var comment_container = $(post).children('div')[1]
		var text = $(comment_container).find('div[data-test-id=comment]').text()

		var tredlines = $(tredlines_container).children('div')
		var tredlines_count = tredlines.length
		
		// var thread_indexs = []
		
		//console.log(comment_container)
		// console.log($(post).attr('id'))
		// var parent_id = $(post).attr('id')
		// if(parent_id.indexOf('moreComments-')!=-1)
		// {
			// console.log('moreComments')
		// }
		

		var cur_index = ''
		var last_index = {}
		function get_object(index,tredline_item){
			var parent_id = $($($(tredline_item).parent()[0]).parent()[0]).attr('id')
			if(parent_id.indexOf('moreComments-')!=-1)
			{
				// console.log(last_index)
			}

			if(index==tredlines_count-1){//если это последний элемент
				var theme_ids_name = $(tredline_item).attr('class').split(' ')
				var theme_ids = $(tredline_item)[0]
				if(theme_ids_name.length!=2){// если это удаленный комент
					//console.log('message delet by user')
				}else if(theme_ids_name.length==2){ // если это завершающий тред списка
					theme_ids_name = $($(theme_ids).children('div')[0]).attr('class').split(' ')
					if(cur_index == ''){ // если первый тред в списке, то он и будет заверщающим этот список
					 //console.log('parent theme1:',theme_ids_name[0])
						cur_index = theme_ids_name[0]
						if(!scheme[cur_index]){ // если такого треда еще не было то зоздаем его
							 //console.log('new parent theme:',theme_ids_name[0])
							scheme[cur_index] = {"threads":1,"message":text,"avg_toxicity":0,"div":item,"more_comments":{}}
						
						}else{ // если тред был, то добавляем ему текст
							//console.log('add parent theme:',theme_ids_name[0])
							// scheme[cur_index]['threads'] = scheme[cur_index]['threads']+1
							scheme[cur_index]['message']  = text
						}
						// last_index = scheme[cur_index]
				
					}else{ // если это завершения дерева тредов
						cur_index = theme_ids_name[0]
						if(!last_index[cur_index]){ // если еще не было этого треда создаем его и записываем текст
							// console.log('new child theme2:',theme_ids_name[0])
							last_index[cur_index] = {"threads":1,"message":text,"avg_toxicity":0,"div":item,"more_comments":{}}
						}else{ // если он был, то добавляем ему текст
							//console.log('child theme2:',theme_ids_name[0])
							// last_index[cur_index]['threads'] = last_index[cur_index]['threads']+1,
							last_index[cur_index]['message'] = text
							// console.log('child theme:',theme_ids_name[0])
							// last_index[cur_index]['message'].push($(comment_container).find('p').text())
						}
						// last_index = last_index[cur_index]
					}

				}else{
					console.log(21,theme_ids_name)
				}

			}else{ // если есть еще уровни вложенности
				var theme_ids_name = $($(tredline_item)).attr('class').split(' ')
				var theme_ids = $(tredline_item)[0]
				var name_thread = theme_ids[0]
				//console.log('parent thread num: '+index,theme_ids_name[0])
				//cur_index = theme_ids_name[0]
				if(cur_index == ''){ // если это самое начало
					// console.log('parent theme1:',theme_ids_name[0])
					cur_index = theme_ids_name[0]
					if(!scheme[cur_index]){ // если не было элемента в корне то создаем его
						// console.log('new child theme:',theme_ids_name[0])
						scheme[cur_index] = {"threads":1,"message":'',"avg_toxicity":0,"div":item,"more_comments":{}}
					
					}else{ // если был, то приписываем ему +1
						scheme[cur_index]['threads'] = scheme[cur_index]['threads']+1
					}
					last_index = scheme[cur_index]
				
				}else{ // если это не самое начало 
					cur_index = theme_ids_name[0]
					if(!last_index[cur_index]){ // проверяем есть ли в предыдущем этот тред
						// console.log('parent theme2:',theme_ids_name[0])
						last_index[cur_index] = {"threads":1,"message":'',"avg_toxicity":0,"div":item,"more_comments":{}}
					}else{ // если есть, то добавляем ему 1
						// console.log('child theme:',theme_ids_name[0])
						last_index[cur_index]['threads'] = last_index[cur_index]['threads']+1
					}
					last_index = last_index[cur_index]
				
				}
				// thread_indexs.push(theme_ids_name[0])
			}
			return {"gfgfg":55}

		}
		var element = {
			div:post[0],
			id:$(post[0]).attr('id'),
			text:text,
			// childern:'',
			parent:[],
		}
		// console.log('============')
		function get_array(index,tredline_item){
			var ids = $(tredline_item).attr('class').split(' ')

			if(ids.length == 2){
				// element['children'] = $($(tredline_item).children()[0]).attr('class').split(' ')[0]
			}else if(ids.length == 3){
				element['parent'].push(ids[0])
			}
			// console.log(tredline_item)
		}
		$.each(tredlines,get_array)
		scheme_arr.push(element)
			//console.log(tredlines)	
	})
	// var test = 
	// console.log(scheme_arr)
	var arr_send = {}
	scheme_arr.forEach(item=>{
		if(item.text!='')
		arr_send[item.id] = item.text
	})

	// console.log(test)
// 	var arr_send = {}

// var arr_send = {}
// var loop1 = getFiniteValue(scheme);

// function getFiniteValue(obj) { // создание запроса
// 	var out = {}
// 	var key = ''
//     getProp(obj);
    
//     function getProp(o) {
//         for(var prop in o) {
//             if(typeof(o[prop]) === 'object') {
//                 if(prop!='message'){
//                     key = prop
//                 }
//                 getProp(o[prop]);
//             } else {
//                 out[key] = o[prop]
//             }
//         }
//     }
//     return out
// }
// console.log(loop1)
var answ = send(arr_send)
function send(mess){
    var out = {}
    for(var id in mess){
        out[id] = Math.random().toFixed(2)
    }
    return out 
}


// // console.log(arr_send)
// console.log(answ)
corelate(answ,scheme_arr)
function corelate(answ,scheme_arr_in){
	scheme_arr_in.forEach(item=>{
		if(item.text!=''){
			item['toxicity'] = answ[item.id]
		}
		
	})
	// return scheme_arr.map(item=>{

	// })
	}

summ(scheme_arr)
function summ(scheme_arr_in){
	scheme_arr_in.forEach((item,index,arr)=>{
		if(item.text=='')return true

		// if(item.parent.length==0){
			item['total_toxicity'] = Number(item['toxicity'])
			// item['total_toxicity'] = 'M '+item['toxicity']
			// // console.log(item.total_toxicity)
			// console.log('parent',item.div)
			var childrens = arr.filter(child=>{
				
				if(child.parent.indexOf(item.id)!=-1&&child.text!=''){
					if(child['toxicity']!=undefined){// потому что more replies тоже дети но без токсичности
						// console.log('child',child.div)
						// console.log(item['total_toxicity'],child['toxicity'])
						item['total_toxicity'] = item['total_toxicity'] + Number(child['toxicity']);
					} 
						
					return true
				}
			})
			item['total_toxicity'] = item['total_toxicity']/(childrens.length+1)
			item['total_toxicity'] = item['total_toxicity'].toFixed(2)
		// console.log(arr)
	})
}
// console.log(scheme_arr)
var scheme_out = sort(scheme_arr)
function sort(scheme_arr_in){

	var cheked = []
	var global_to_sort = []
	var structure = {}
	scheme_arr_in.forEach((item,index,arr)=>{
		if(item.text=='')return true
			cheked.push(item.id)
		var to_sort = [item.total_toxicity]

		

		// if(item.parent==0){
			var brothers = arr.filter(child=>{
				if(JSON.stringify(item.parent)==JSON.stringify(child.parent)
					&&child.text!=''
					&&item.id!=child.id
					&&cheked.indexOf(child.id)==-1
					){
					// console.log(item.parent,child.parent)
					cheked.push(child.id)
					to_sort.push(child['total_toxicity'])
					// to_sort.push(child.div)
					// structure[child.id] =  child['total_toxicity']
					return true
				}
			})
			global_to_sort.push(to_sort)

			// to_sort.
			// var sorted = getSort(to_sort)
			// to_sort.push(item['total_toxicity'])
			// structure[item['total_toxicity']] = item.id
			// var childrens = arr.filter(child=>{if(child.parent.indexOf(item.id)!=-1)return true})
		// }
		

	})
	console.log(1,global_to_sort)
	// var sorted = global_to_sort.map(item=>{
	// 	return getSort(item)
	// })
	// console.log(2,sorted)
	
	// console.log(global_to_sort)

	var out = []
	// sorted.forEach(item=>{
	// 	var id = structure[item]
	// 	var placed_elems = scheme_arr_in.filter(child=>{
	// 		if(child.id==id||child.parent.indexOf(id)!=-1){
	// 			return true
	// 		}

	// 	})
	// 	out.push(placed_elems)
		
	// })
	var output = []
	out.forEach(item=>{
		item.forEach(elemt=>{
			output.push(elemt)
		})
	})
console.log(scheme_arr)
return output

	function getSort(data) {
        var i,j;
        for(i = 1; i < data.length; i++)
        {
            over = data[i]; 
             
            for(j = i-1; j >= 0 && data[j] > over; j--) 
            {
                data[j+1] = data[j];
            }
            data[j+1] = over;
        }
        //возвращаем обработанный массив
	    return data;
    }

}

// console.log(scheme_arr)
// var loop2 = corelate(answ, loop1)
// function corelate(answ,obj) {
//     getProp(obj);
//     var key = ''
//     function getProp(o) {
//         for(var prop in o) {
//             // var key = ''
//             if(typeof(o[prop]) === 'object') {
//                 // key = con
//                 for(var id in answ){
//                     if(id==prop){
//                         // console.log('f')
//                         o[prop]['toxicity'] = answ[id]
//                     }
//                 }
//                 // console.log(o[prop]['toxicity'])
//                 getProp(o[prop]);
//                  // key = prop
//             } else {

//             }
//         }
//     }
// }
// var loop3 = summ(loop2)
// function summ(obj) {
    
//     // var key = ''
//     // var toxic = 0
//     // var last = {}
//     for(var subRoot in obj){
//        var Root = obj[subRoot]
//        Root["total_toxicity"] = [Root["toxicity"]]
//         getProp(Root);
//         Root["avg_toxicity"] = Number(average(Root["total_toxicity"]).toFixed(2))
//     }
    
//     function getProp(o) {

//         for(var prop in o) {
//             var sub_root = o[prop]
//             // var key = ''
//             // console.log(o)
//             if(typeof(sub_root) === 'object') {
//                 if(sub_root["toxicity"]!=undefined){
//                     Root['total_toxicity'].push(sub_root["toxicity"]) 
//                 }
                
//                 // console.log(sub_root['total_toxicity'])
//                 getProp(sub_root);

//                 // console.log(o[prop])
//             } 
//         }
//     }
//     function average(arr){
//         var summ = 0
//         var count = arr.length
//         // console.log(count)
//         arr.forEach((item)=>{summ=summ+Number(item)})
//         // console.log(summ)
//         return summ/count
//     }

//     return obj
// }

// console.log(loop3)
// Очищаем родительский элемент
	
// setTimeout(function(){$(place).html(''); },4000)
	// setTimeout(function(){rebuild(scheme_out)},5000)
	
	function rebuild(elements){
		elements.forEach(item=>{
			// console.log(item.id)
			// if(item.text!='')
			// if(item.parent.indexOf('t1_eh0ese6')!=-1)

			$(place).append(item.div)
		})
		
	}

// Расстановка комментария (subRoot)
// - elements = Сортируем Object.values(subRoot["children"]) по полю avg_toxicity
// - Для element из elements:
//   - Добавляем на страницу element["div"]
//   - Расставляем (element)
// Начальный вызов - (root)

// перебор всех коментов и формирование ответа в формате ключ:текс где ключ это смерженные по уровню вложенности подряд от корня до элемента его id. для поиска потом конкретного комента раскручивать id в обратном порядке и навигировать внутри объекта, который должен обновляться переодически с подгрузкой новых коментов. 
// для переноса диалогов, определяем самый родительный диалог в котором он располагается,  перебираем все элементы которые в нем стоят для сохранения структуры, записываем их отдельно и доискиваем блоки с more replise добавляем в конец всего. после чего вырезаем массив и кладем в конец блока в котором хранится все блоки коментов на сайте. jquery должен позвалять работать с массивом.
	function callback(answ) {
		// console.log(answ)
		answ.forEach((key)=>{

			if(key!='undefined'){
				var post = $('#'+key)

				var content = $(post).next()
				$(content).html(GLOBAL_DATA.old_text[key])
				
				// delete GLOBAL_DATA.old_text[key]
				$(content).append('<a class="lock" data-index="'+key+'">Lock here</a>')
			}
		})
	}

	// send(arr_send, callback)
}

function unlock(e,key){
	if(e){
		e.preventDefault()
		var key = $(this).attr('data-index')
	}	
	var post = $('#'+key)

	var content = $(post).next()
	$(this).parent().html(GLOBAL_DATA.old_text[key])
	// delete GLOBAL_DATA.old_text[key]
	$(content).append('<a class="lock" data-index="'+key+'">Lock here</a>')
}

function lock(e,key){
	if(e){
		e.preventDefault()
		var key = $(this).attr('data-index')
	}
	var post = $('#'+key)

	var content = $(post).next()
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
		// action()
		console.log('loop')
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

