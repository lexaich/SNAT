
// var oldUrl = null
// var oldCommentsNumber = 0

// function hideBuggedElements() {
//   $("div[id^='moreComments'], div[id^='continueThread']").hide()
//   $($('div[class ^= Comment]').find('span:contains(Comment deleted by user)')).hide()
// }

// function getRequest() {
//   var request = {}
//   $("div[data-test-id=comment]:not([data-processed])").map((index, element) => {
//     var id = $(element).parent().parent().parent().attr("id")
//     var text = $(element).text()
//     $(element).attr("data-processed", true)
//     request[id] = text
//   })
//   return request
// }

// function setToxicity(response) {
//   Object.keys(response).map((key) => {
//     $("#" + key).parent().parent().attr("data-toxicity", response[key])
//   })
//   setParent()
//   sortElements($("[data-toxicity]:not([data-parent-id]").toArray())
// }

// function sortElements(elements) {
//   elements.sort((e1, e2) => {
//     var toxicity1 = parseFloat(e1.getAttribute("data-toxicity"))
//     var toxicity2 = parseFloat(e2.getAttribute("data-toxicity"))
//     if (toxicity1 < toxicity2)
//       return -1
//     else
//       return 1
//   })
//   elements.reverse().map((element) => {
//     var id = $(element).find("div > div").attr("id")
//     var parent = $(element).parent()
    
//     var copy = $(element).clone()
//     var children = $("[data-parent-id=" + id + "]").toArray()

//     $(element).detach()
//     sortElements(children)
//     // $('что').appendTo('куда')
//     parent.prepend(copy)
//   })
// }

// function setParent() {
//   $("div[data-toxicity] div[id] > div:first-child > div:nth-last-child(2)").map((index, element) => {
//     var parentId = $(element).attr("class").split(" ")[0]
//     $(element).parent().parent().parent().parent().attr("data-parent-id", parentId)
//   })
// }

// function filterToxicComments() {
//   hideBuggedElements()
//   request = getRequest()
//   sendToxicityRequest(request, setToxicity)
// }

// function checkPage() {
//   var commentsNumber = $("div[data-test-id=comment]").length
//   if ((oldUrl != window.location.href) || (oldCommentsNumber < commentsNumber)) {
//     oldUrl = window.location.href
//     oldCommentsNumber = commentsNumber
//     filterToxicComments()    
//   }
// }


// setInterval(checkPage, 5000)



window.onload = function (){


    $("div[data-test-id=comment]").webuiPopover({
        placement:'top',// Значения: auto,top,right,bottom,left,top-right,top-left,bottom-right,bottom-left
        width:'auto',// Ширина, числом
        height:'auto',// Высота, числом
        trigger:'hover',// Значения: click, hover
        style:'',// Значения:  '', inverse
        delay:{
        show: 1,
        hide: 300
      },// Время задержки окошка, работает только, когда trigger == hover
        cache:true,// Если кэш равен false, popover будет пересоздаваться каждый раз
        multi:false,// Разрешить показ сразу нескольких окошек одновременно
        arrow:true,// Показать стрелки или нет
        title:'Выбрать класс токсичности',// Заголовок, если пустая строка, заголовок будет автоматически скрываться
        content:`<div class="toxic" style="font-size: 15px;">
            <p class="set_toxic fn">toxic</p>
            <p class="set_toxic fp"> not toxic</p>
          </div>

          `,// Содержание, может быть функцией
        closeable:false,// Показывать крестик закрытия окна или нет
        padding:true,// Отступ у контента
        type:'html',// Тип контента, значения: 'html', 'iframe', 'async'
        url:''// Если не пустая строка, контент будет загружаться из указанного адреса
    });

$('body').on('click','.set_toxic',function(){
      // data-target="webuiPopover0"
var parent = $(this).parent().parent().parent().parent()
    var value = $(this).attr('class').split(' ')[1]
    var text = $('div[data-target='+$(parent).attr('id')+']').text()
    var data = {text:text,class:value}
    // var elem = $(parent).attr('id')
    // $.ajax({
    //   url:API_PATH,
    //   method:'POST',
    //   data:data,

    // })
    console.log(data)
})

}

