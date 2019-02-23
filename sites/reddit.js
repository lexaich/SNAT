var oldUrl = null

function getRequest() {
  var request = {}
  $("div[data-test-id=comment]:not([data-toxicity])").map((index, element) => {
    var id = $(element).parent().parent().parent().attr("id")
    var text = $(element).text()
    request[id] = text
  })
  return request
}

function setToxicity(response) {
  Object.keys(response).map((key) => {
    $("#" + key).parent().parent().attr("data-toxicity", response[key])
  })
  setParent()
  sortElements($("[data-toxicity]:not([data-parent-id]").toArray())
}

function sortElements(elements) {
  elements.sort((e1, e2) => {
    var toxicity1 = parseFloat(e1.getAttribute("data-toxicity"))
    var toxicity2 = parseFloat(e2.getAttribute("data-toxicity"))
    if (toxicity1 < toxicity2)
      return -1
    else
      return 1
  })
  elements.reverse().map((element) => {
    var id = $(element).find("div > div").attr("id")
    var parent = $(element).parent()
    var copy = $(element).clone()
    var children = $("[data-parent-id=" + id + "]").toArray()

    $(element).remove()
    sortElements(children)
    parent.prepend(copy)
  })
}

function setParent() {
  $("div[data-toxicity] div[id] > div:first-child > div:nth-last-child(2)").map((index, element) => {
    var parentId = $(element).attr("class").split(" ")[0]
    $(element).parent().parent().parent().parent().attr("data-parent-id", parentId)
  })
}

function filterToxicComments() {
  if (oldUrl != window.location.href) {
    oldUrl = window.location.href
    console.log("Filter loaded")
    request = getRequest()
    sendToxicityRequest(request, setToxicity)
  }
}

setInterval(filterToxicComments, 100)

// var target = $("div[data-test-id=comment]").parent().parent().parent().parent();
// var observer = new MutationObserver(function(mutations) {
//   mutations.forEach(function(mutation) {
//     console.log(mutation.type);
//   });    
// });
// var config = { attributes: true, childList: true, characterData: true };
// observer.observe(target, config);