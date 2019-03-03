var oldUrl = null
var oldCommentsNumber = 0

function hideBuggedElements() {
  $("div[id^='continueThread']").hide()
  $($('div[class ^= Comment]').find('span:contains(Comment deleted by user)')).hide()
}

function getRequest() {  
  var request = {} 
  $("div[data-test-id=comment]:not([data-processed])").map((index, element) => { 
    var id = $(element).parent().parent().parent().attr("id")  
    var text = $(element).text() 
    $(element).attr("data-processed", true)  
    request[id] = text 
  }) 
  return request 
}

function setToxicity(response) {
  Object.keys(response).map((key) => {
    $("#" + key).parent().parent().attr("data-toxicity", response[key])
  })

  setParent()

  var elements = $("[data-toxicity]:not([data-parent-id]").toArray()
  aggregateToxicity(elements)
  sortElements(elements)
}

function aggregateToxicity(elements) {
  elements.map((element, index) => {
    var elementIndex = $(element).attr("data-debug-index") || index
    var id = $(element).find("div > div").attr("id")
    var children = $("[data-parent-id=" + id + "]").toArray()

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

function sortElements(elements) {
  elements.sort(stableCompare)
  elements.map((element) => {
    var id = $(element).find("div > div").attr("id")
    var parent = $(element).parent()
    
    var children = $("[data-parent-id=" + id + "]").toArray()

    $(element).detach()
    sortElements(children)
    parent.prepend(element)
  })
}

function setParent() {
  $("div[data-toxicity] div[id] > div:first-child > div:nth-last-child(2), div[id^='moreComments'] > div:first-child > div:last-child").map((index, element) => {
    var parentId = $(element).attr("class").split(" ")[0]
    $(element).parent().parent().parent().parent().attr("data-parent-id", parentId)
  })
}

function filterToxicComments() {  
  hideBuggedElements() 
  request = getRequest() 
  Toxic.sendToxicityRequest(request, setToxicity)  
}

function initSaveToxicityPopups() {
  $('body').on('click', '.set-toxic', function() {
    var parentPopup = $(this).parent().parent().parent().parent()
    var value = $(this).attr('class').split(' ')[1]
    var parentText = $('div[data-target='+$(parentPopup).attr('id')+']')
    var parent = $(parentText).parent().parent().parent().parent().parent()
    
    var text = $(parentText).text()
    var data = {
      text: text,
      toxic: $(parent).attr('data-toxicity'),
      url: location.href
    }
    Toxic.sendSaveToxicityRequest(data, function() {
      console.log("Thanks!")
      WebuiPopovers.hideAll();
    })
  })
}

function addSaveToxicityPopups() {
  $("div[data-test-id=comment]").webuiPopover({
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
  var commentsNumber = $("div[data-test-id=comment]").length 
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
