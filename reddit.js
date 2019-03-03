var port = chrome.runtime.connect({name: "site"});

port.postMessage({message: "loaded site"});
function ready() {
	$('html').css({'display':'block'})
	action()

	// блюр странички
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

	setTimeout(function(){
		GLOBAL_DATA.analyze = false
	},5000)
	
	var scheme = {}
	var scheme_arr = []
	var place = $($($($($(document).find('div.Comment')[0]).parent()[0]).parent()[0]).parent()[0]).parent()[0]
	var comments = $(place).children('div')


	var data = $.each(comments,function(index,item){

		var post = $(item).children().children()


		var tredlines_container =  $(post).children('div')[0]
		var comment_container = $(post).children('div')[1]
		var text = $(comment_container).find('div[data-test-id=comment]').text()

		var tredlines = $(tredlines_container).children('div')
		var tredlines_count = tredlines.length

		var element = {
			div:post[0],
			id:$(post[0]).attr('id'),
			text:text,
			parent:[],
		}


		function get_array(index,tredline_item){
			var ids = $(tredline_item).attr('class').split(' ')

			if(ids.length == 2){


			}else if(ids.length == 3){
				element['parent'].push(ids[0])
			}

		}
		$.each(tredlines,get_array)
		scheme_arr.push(element)

	})

	var arr_send = {}
	scheme_arr.forEach(item=>{
		if(item.text!='')
		arr_send[item.id] = item.text
	})



var answ = send_dev(arr_send)

function send_dev(mess){
    var out = {}
    for(var id in mess){
        out[id] = Number(Math.random().toFixed(2))

    }
    return out 
}




set_toxic(answ,scheme_arr)
function set_toxic(answ,scheme_arr_in){

	scheme_arr_in.forEach(item=>{
		if(item.text!=''){
			item['toxicity'] = answ[item.id]
		}
		
	})


}

averedge_toxic(scheme_arr)
function averedge_toxic(scheme_arr_in){
	scheme_arr_in.forEach((item,index,arr)=>{
		if(item.text=='')return true


			item['total_toxicity'] = Number(item['toxicity'])

			var childrens = arr.filter(child=>{
				if(child.parent.indexOf(item.id)!=-1&&child.text!=''){
					if(child['toxicity']!=undefined){// потому что more replies тоже дети но без токсичности

						item['total_toxicity'] = item['total_toxicity'] + Number(child['toxicity']);
					} 
						
					return true
				}
			})

			item['total_toxicity'] = item['total_toxicity']/(childrens.length+1)
			item['total_toxicity'] = item['total_toxicity'].toFixed(2)

	})
}
var scheme_out = sort(scheme_arr)

function sort(scheme_arr_in){

	var to_sort = []
	var structure = {root:[]}
	var cheked = []
	scheme_arr_in.forEach((item,index,arr)=>{

		if(item.parent==0){
			to_sort.push()

			structure['root'].push({toxic:Number(item['total_toxicity']),id:item.id,div:item['div']})

		}else{

			var brothers = arr.filter(child=>{
				if(item.parent.length==child.parent.length&&item.parent[item.parent.length-1]==child.parent[child.parent.length-1]){
					if(cheked.indexOf(child.id)==-1){
						cheked.push(child.id)

						if(!structure[item.parent[item.parent.length-1]]){

							if(child.text==''){
								var toxic = child.parent.length+2
							}else{
								var toxic = Number(child['total_toxicity'])
							}
							structure[item.parent[item.parent.length-1]] = [{toxic:toxic,id:child['id'],div:child['div']}]
						}else{

							if(child.text==''){
								var toxic = child.parent.length+2
							}else{
								var toxic = Number(child['total_toxicity'])
							}
							structure[item.parent[item.parent.length-1]].push({toxic:toxic,id:child['id'],div:child['div']})
						}

						Number(child['total_toxicity']);
					} 
						
					return true
				}
			})
		}
		
	})


	for(var group in structure){

		getSort(structure[group])

	}

	var out = []
	structure['root'].forEach((root,index,arr)=>{
		set_html(root,index,arr.length-1)
	})

	var cheked = []

	function set_html(Root,cur_number,last_number){
		// console.log(Root)
		out.push(Root.div)
		var cur = structure[Root.id]

		if(cur!=undefined)
		{
			cur.forEach((item,index,arr)=>{
				if(item.toxic<2){
					set_html(item,index,arr.length-1)
				}

			})
			cur.reverse().forEach((item,index,arr)=>{
				if(item.toxic>2){
					out.push(item.div)

				}
				
			})
		}
	}

	function getSort(data) {
		if(data.length<=1)return data
        var i,j;
        for(i = 1; i < data.length; i++)
        {
            over = data[i]; 
             

            for(j = i-1; j >= 0 && data[j]['toxic'] > over['toxic']; j--) 

            {
                data[j+1] = data[j];
            }
            data[j+1] = over;
        }
        //возвращаем обработанный массив
	    return data;
    }
    return out
}


	setTimeout(function(){$(place).html(''); },4000)

	setTimeout(function(){rebuild(scheme_out)},5000)
	
	function rebuild(elements){
		elements.forEach(item=>{

			$(place).append(item)

		})
		
	}

	function callback(answ) {
		// console.log(answ)
		answ.forEach((key)=>{

			if(key!='undefined'){
				var post = $('#'+key)

				var content = $(post).next()
				$(content).html(GLOBAL_DATA.old_text[key])
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

