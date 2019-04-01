var tut = new ToxicSite({
  preload: function() {
    this.getAllComments().map((index, comment) => {
      $(comment).attr("id", this.getId(comment))
    })
  },

  getUnprocessedComments: function() {
    return $(".themaCommentTable > tbody > tr:not([data-processed])")
  },

  getFirstLevelComments: function() {
    return this.getAllComments().toArray()
  },

  getAllComments: function() {
    return $(".themaCommentTable > tbody > tr")
  },

  getId: function(element) {
    return $(element).find(".themaCommentRight a[name]").attr("name")
  },

  getChildren: function(element) {
    return []
  },

  getParent: function(element) {
    return null
  },

  getText: function(element){
    var clone = $(element).find(".row-content-tut").clone()
   return clone.children().remove().end().text()
  },
})

// TODO This is a fix to get rid of element sorting and wrong comment modal
tut._sortElements = function() {}
tut._addSaveToxicityPopups = function() {}

tut.initialize()

