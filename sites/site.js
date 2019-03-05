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

var ToxicSite = function(site) {
  this._oldUrl = null
  this._oldCommentsNumber = 0

  this.getUnprocessedComments = site.getUnprocessedComments
  this.getFirstLevelComments = site.getFirstLevelComments
  this.getAllComments = site.getAllComments
  this.getId = site.getId
  this.getChildren = site.getChildren
  this.getParent = site.getParent
  this.preload = site.preload || this.preload
}

ToxicSite.prototype = {
  preload: function() {

  },

  _getRequest: function() {
    var request = {} 
    this.getUnprocessedComments().map((index, element) => { 
      var id = this.getId(element)
      var text = $(element).text() 
      $(element).attr("data-processed", true)  
      request[id] = text 
    }) 
    return request 
  },

  _aggregateToxicity: function(elements) {
    elements.forEach((element, index) => {
      var elementIndex = $(element).attr("data-debug-index") || index
      var id = $(element).attr("id")
      var children = this.getChildren(element)

      this._aggregateToxicity(children)

      var overallToxicity = children.reduce(
        (acc, element) => acc + parseFloat(element.getAttribute("data-average-toxicity")),
        parseFloat(element.getAttribute("data-toxicity"))
      )

      var averageToxicity = overallToxicity / (children.length + 1)

      $(element).attr("data-debug-index", elementIndex)
      $(element).attr("data-average-toxicity", averageToxicity)
      $(element).attr("data-average-toxicity-class", Math.max(Math.round(averageToxicity * 10), 5))
    })
  },

  _sortElements: function(elements) {
    elements.sort(stableCompare)
    elements.forEach((element) => {
      var id = $(element).attr("id")
      var parent = this.getParent(element)
      var children = this.getChildren(element)

      $(element).detach()
      this._sortElements(children)
      parent.prepend(element)
    })
  },

  _setToxicityAndSort: function(response) {
    Object.keys(response).map((key) => {
      $("#" + key).attr("data-toxicity", response[key])
    })

    var elements = this.getFirstLevelComments()
    this._aggregateToxicity(elements)
    this._sortElements(elements) 
  },

  _filterToxicComments: function() {
    request = this._getRequest()
    ToxicAPI.sendToxicityRequest(request, (response) => {
      this._setToxicityAndSort(response)
    })  
  },

  _addSaveToxicityPopups: function() {
    this.getUnprocessedComments().webuiPopover({
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
  },

  _initSaveToxicityPopups: function() {
    $('body').on('click', '.set-toxic', function() {
      var parentPopup = $(this).parent().parent().parent().parent()
      var parentText = $('div[data-target=' + $(parentPopup).attr('id') + ']')
      var parent = $(parentText).parent().parent()      
      var text = $(parentText).text()
      var data = {
        text: text,
        toxic: $(parent).attr('data-toxicity'),
        url: window.location.href
      }
      ToxicAPI.sendSaveToxicityRequest(data, function() {
        WebuiPopovers.hideAll();
      })
    })
  },

  _checkPage: function() {
    var commentsNumber = this.getAllComments().length 
    var newPageLoaded = (this._oldUrl != window.location.href)
    if (newPageLoaded) {  
      this._oldUrl = window.location.href  
      this._initSaveToxicityPopups()
    }  
    if (newPageLoaded || (this._oldCommentsNumber < commentsNumber)) {
      this._oldCommentsNumber = commentsNumber 
      this.preload()
      this._addSaveToxicityPopups()
      this._filterToxicComments()
    }
  },

  initialize: function() {
    setInterval(() => {
      this._checkPage()
    }, 1000)
  }
}