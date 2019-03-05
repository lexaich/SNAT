var pikabu = new ToxicSite({
  getUnprocessedComments: function() {
    return $(".page-story div.comment:not([data-processed]):visible")
  },

  getFirstLevelComments: function() {
    return $('.comments__container > .comment').toArray()
  },

  getAllComments: function() {
    return $(".page-story div.comment:visible")
  },

  getId: function(element) {
    return $(element).attr("id")
  },

  getChildren: function(element) {
    return $(element).find(' > .comment__children > .comment[data-toxicity]').toArray()
  },

  getParent: function(element) {
    return $(element).parent()
  },
})

pikabu.initialize()