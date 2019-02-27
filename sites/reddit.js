var oldUrl = null
var oldCommentsNumber = 0

function hideBuggedElements() {
  $("div[id^='moreComments'], div[id^='continueThread']").hide()
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
      parseFloat(element.getAttribute("data-toxicity"))
    )

    var averageToxicity = overallToxicity / (children.length + 1)

    console.log(overallToxicity)

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
  $("div[data-toxicity] div[id] > div:first-child > div:nth-last-child(2)").map((index, element) => {
    var parentId = $(element).attr("class").split(" ")[0]
    $(element).parent().parent().parent().parent().attr("data-parent-id", parentId)
  })
}

function filterToxicComments() {
  hideBuggedElements()
  request = getRequest()
  sendToxicityRequest(request, setToxicity)
}

function checkPage() {
  var commentsNumber = $("div[data-test-id=comment]").length
  if ((oldUrl != window.location.href) || (oldCommentsNumber < commentsNumber)) {
    oldUrl = window.location.href
    oldCommentsNumber = commentsNumber
    filterToxicComments()    
  }
}


setInterval(checkPage, 5000)
