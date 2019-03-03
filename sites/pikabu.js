// TODO make abstraction ToxicSorter for such classes

var oldUrl = null
var oldCommentsNumber = 0

function getRequest() {  
  var request = {} 
  $("div.comment:not([data-processed])").map((index, element) => { 
    var id = $(element).parent().parent().parent().attr("id")  
    var text = $(element).text() 
    $(element).attr("data-processed", true)  
    request[id] = text 
  }) 
  return request 
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

function setToxicity(response) {
  Object.keys(response).map((key) => {
    $("#" + key).attr("data-toxicity", response[key])
  })

  var elements = $('.comments__container > .comment').toArray()
  aggregateToxicity(elements)
  sortElements(elements)
}

function filterToxicComments() {  
  request = getRequest() 
  Toxic.sendToxicityRequest(request, setToxicity)  
}

function initSaveToxicityPopups() {
  $('body').on('click', '.set-toxic', function() {
    var parentPopup = $(this).parent().parent().parent().parent()
    var parentText = $('div[data-target='+$(parentPopup).attr('id')+']')
    var parent = $(parentText).parent().parent()
    
    var text = $(parentText).text()
    var data = {
      text: text,
      toxic: $(parent).attr('data-toxicity'),
      url: location.href
    }
    Toxic.sendSaveToxicityRequest(data, function() {
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
    filterToxicComments()
    addSaveToxicityPopups()
  }  
  if (newPageLoaded) {
    initSaveToxicityPopups()
  }
}  

setInterval(checkPage, 5000)
