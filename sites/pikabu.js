
// console.log('dfgdfg')
window.onload = init


function init(){
  var place = $('.comments__container')
  var childrens = $(place).children('.comment')


  
// console.log(place)
// console.log(childrens)
generate(childrens)

var response = sendDev(request)
setToxicity(response)
// console.log(response)
}

var request = {}
var scheme = []
var all = []
// request[id] = text 
function generate(childrens){
  // console.log(childrens)
  $(childrens).each((index,child)=>{
    
    var text = $(child).children('.comment__body ').children('.comment__content').text()
    var id = $(child).attr('id')
    // all.push({
    //   id:id,
    //   elem:child
    // })
    scheme.push({id:id,toxic:0,childrens:[],elem:child})

    request[id] = text
    if($(child).children('.comment__children')!=0){
      var childrensCild = $(child).children('.comment__children').children('.comment')
      // $.each(childrensCild,function(index,item){

      //   scheme[id]['childrens'].push({
      //     id:$(item).attr('id'),
      //     elem:item
      //   })
      // })
      generate(childrensCild)
    }
    // console.log()
  })


}


function sendDev(data){
  var out = {}
  for(var elem in data){
    out[elem] = Number(Math.random().toFixed(2))
  }
  return out
}

function aggregateToxicity(elements) {
  elements.forEach((element, index) => {
    var elementIndex = $(element).attr("data-debug-index") || index
    var id = $(element).attr("id")
    var children = $(element).find('.comment__children').children('.comment').toArray()

    aggregateToxicity(children)

    var overallToxicity = children.reduce(
      (acc, element) => acc + parseFloat(element.getAttribute("data-average-toxicity")),
      parseFloat(element.getAttribute("data-toxicity")) || 0
    )

    var averageToxicity = overallToxicity / (children.length + 1)

    $(element).attr("data-debug-index", elementIndex)
    $(element).attr("data-average-toxicity", averageToxicity)
    $(element).attr("data-average-toxicity-class", Math.max(Math.round(averageToxicity * 10), 5))
  })
}

function sortElements(elements) {
  elements.sort(stableCompare)
  elements.forEach((element) => {
    var id = $(element).attr("id")
    var parent = $(element).parent()

    var children = $(element).find(' > .comment__children > .comment').toArray()
    $(element).detach()
    sortElements(children)
    parent.prepend(element)
  })
}

function stableCompare(e1, e2) {
  var toxicity1 = parseInt(e1.getAttribute("data-average-toxicity-class"))
  var toxicity2 = parseInt(e2.getAttribute("data-average-toxicity-class"))
  var index1 = parseInt(e1.getAttribute("data-debug-index"))
  var index2 = parseInt(e2.getAttribute("data-debug-index"))

  if (toxicity1 < toxicity2)
    return 1
  else if (toxicity1 > toxicity2)
    return -1
  else if (index1 < index2)
    return 1
  else
    return -1
}



var oldUrl = null
// var oldCommentsNumber = 0

// function hideBuggedElements() {
//   $("div[id^='continueThread']").hide()
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

function setToxicity(response) {
  Object.keys(response).map((key) => {
    $("#" + key).attr("data-toxicity", response[key])
  })

  // setParent()

  var elements = $('.comments__container').children('.comment').toArray()
  aggregateToxicity(elements)
  sortElements(elements)
}



// function setParent() {
//   $("div[data-toxicity] div[id] > div:first-child > div:nth-last-child(2), div[id^='moreComments'] > div:first-child > div:last-child").map((index, element) => {
//     var parentId = $(element).attr("class").split(" ")[0]
//     $(element).parent().parent().parent().parent().attr("data-parent-id", parentId)
//   })
// }

// function filterToxicComments() {  
//   hideBuggedElements() 
//   request = getRequest() 
//   Toxic.sendToxicityRequest(request, setToxicity)  
// }

function initSaveToxicityPopups() {
  $('body').on('click', '.set-toxic', function() {
    // console.log(this)
    var parentPopup = $(this).parent().parent().parent().parent()
    // var value = $(this).attr('class').split(' ')[1]
    var parentText = $('div[data-target='+$(parentPopup).attr('id')+']')
    var parent = $(parentText).parent().parent()
    
    var text = $(parentText).text()
    var data = {
      text: text,
      toxic: $(parent).attr('data-toxicity'),
      url: location.href
    }
    console.log(data)
    Toxic.sendSaveToxicityRequest(data, function() {
      console.log("Thanks!")
      WebuiPopovers.hideAll();
    })
  })
}

function addSaveToxicityPopups() {
  $("div[class=comment__content]").webuiPopover({
    placement:'top',
    width:'auto',
    height:'auto',
    trigger:'hover',
    style:'',
    delay:{
      show: 1,
      hide: 300
    },
    cache:true,
    multi:false,
    arrow:true,
    content:`<div class="toxic" style="font-size: 15px;">
        <p class="set-toxic fn modern embossed-link">Wrong!</p>
      </div>`,
    closeable:false,
    padding:true,
    type:'html',
    url:''
  });
}

function checkPage() { 
  var commentsNumber = $("div[class=comment__content]").length 
  var newPageLoaded = (oldUrl != window.location.href)
  if (newPageLoaded || (oldCommentsNumber < commentsNumber)) {  
    oldUrl = window.location.href  
    oldCommentsNumber = commentsNumber 
    // filterToxicComments()
    addSaveToxicityPopups()
  }  
  if (newPageLoaded) {
    initSaveToxicityPopups()
  }
}  

setInterval(checkPage, 5000)
