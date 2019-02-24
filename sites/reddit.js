var port = chrome.runtime.connect({name: "site"});

port.postMessage({message: "loaded site"});
port.onMessage.addListener(function(request)
    {
        if(request.action == 'eval')
        {
            eval(request.func);
        }
    });
chrome.runtime.onMessage.addListener(request=>{
  eval(request.func);
})


function getRequest() {
  var request = {}
  var delted_comments = $($('div[class ^= Comment]').find('span:contains(Comment deleted by user)'))

  $("div[data-test-id=comment]").map((index, element) => {

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

    $(element).detach()
    sortElements(children)
    // $('что').appendTo('куда')
    parent.prepend(copy)
  })
}

function setParent() {
  $("div[data-toxicity] div[id] > div:first-child > div:nth-last-child(2)").map((index, element) => {
    var parentId = $(element).attr("class").split(" ")[0]
    $(element).parent().parent().parent().parent().attr("data-parent-id", parentId)
  })
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("Request loaded")
  request = getRequest()
  sendToxicityRequest(request, setToxicity)
});

// $(document).on("DOMNodeInserted", function (event) {

//     console.log('loop')

  
// });



// .ixBuze {
//     height: 16px;
//     margin-bottom: 8px;
//     width: 176px;
//     background-color: rgb(214, 214, 214);
//     border-radius: 4px;
// }
// .dwhAtJ {
//     height: 124px;
//     margin-bottom: 12px;
//     width: 100%;
//     background-color: rgb(214, 214, 214);
//     border-radius: 4px;
// }

//   <div class="_2o0N1VHuLszWHqY5A8iayv"><div class="_2114DnVtHe_0MtbEW85tnL"><div class="_3j7WNOCzFwCp1SXZGJP1-V"><div class="_2q7IQ0BUOWeEZoeAxN555e x03auy-7 cYehNo"><i class="icon icon-upvote _2Jxk822qXs4DaXwsN7yyHA"></i></div><div class="_1iKd82bq_nqObFvSH1iC_Q x03auy-8 jcBcln"><i class="icon icon-downvote ZyxIIl4FP5gHGrJDzNpUC"></i></div></div><div class="_3tQxKBNuEJsKH_mPQEy34W"><div class="x03auy-9 ixBuze"></div><div class="x03auy-10 dwhAtJ"></div></div></div><div class="_2114DnVtHe_0MtbEW85tnL"><div class="_3j7WNOCzFwCp1SXZGJP1-V"><div class="_2q7IQ0BUOWeEZoeAxN555e x03auy-7 cYehNo"><i class="icon icon-upvote _2Jxk822qXs4DaXwsN7yyHA"></i></div><div class="_1iKd82bq_nqObFvSH1iC_Q x03auy-8 jcBcln"><i class="icon icon-downvote ZyxIIl4FP5gHGrJDzNpUC"></i></div></div><div class="_3tQxKBNuEJsKH_mPQEy34W"><div class="x03auy-9 ixBuze"></div><div class="x03auy-10 dwhAtJ"></div></div></div><div class="_2114DnVtHe_0MtbEW85tnL"><div class="_3j7WNOCzFwCp1SXZGJP1-V"><div class="_2q7IQ0BUOWeEZoeAxN555e x03auy-7 cYehNo"><i class="icon icon-upvote _2Jxk822qXs4DaXwsN7yyHA"></i></div><div class="_1iKd82bq_nqObFvSH1iC_Q x03auy-8 jcBcln"><i class="icon icon-downvote ZyxIIl4FP5gHGrJDzNpUC"></i></div></div><div class="_3tQxKBNuEJsKH_mPQEy34W"><div class="x03auy-9 ixBuze"></div><div class="x03auy-10 dwhAtJ"></div></div></div><div class="_2114DnVtHe_0MtbEW85tnL"><div class="_3j7WNOCzFwCp1SXZGJP1-V"><div class="_2q7IQ0BUOWeEZoeAxN555e x03auy-7 cYehNo"><i class="icon icon-upvote _2Jxk822qXs4DaXwsN7yyHA"></i></div><div class="_1iKd82bq_nqObFvSH1iC_Q x03auy-8 jcBcln"><i class="icon icon-downvote ZyxIIl4FP5gHGrJDzNpUC"></i></div></div><div class="_3tQxKBNuEJsKH_mPQEy34W"><div class="x03auy-9 ixBuze"></div><div class="x03auy-10 dwhAtJ"></div></div></div><div class="_2114DnVtHe_0MtbEW85tnL"><div class="_3j7WNOCzFwCp1SXZGJP1-V"><div class="_2q7IQ0BUOWeEZoeAxN555e x03auy-7 cYehNo"><i class="icon icon-upvote _2Jxk822qXs4DaXwsN7yyHA"></i></div><div class="_1iKd82bq_nqObFvSH1iC_Q x03auy-8 jcBcln"><i class="icon icon-downvote ZyxIIl4FP5gHGrJDzNpUC"></i></div></div><div class="_3tQxKBNuEJsKH_mPQEy34W"><div class="x03auy-9 ixBuze"></div><div class="x03auy-10 dwhAtJ"></div></div></div><div class="_2114DnVtHe_0MtbEW85tnL"><div class="_3j7WNOCzFwCp1SXZGJP1-V"><div class="_2q7IQ0BUOWeEZoeAxN555e x03auy-7 cYehNo"><i class="icon icon-upvote _2Jxk822qXs4DaXwsN7yyHA"></i></div><div class="_1iKd82bq_nqObFvSH1iC_Q x03auy-8 jcBcln"><i class="icon icon-downvote ZyxIIl4FP5gHGrJDzNpUC"></i></div></div><div class="_3tQxKBNuEJsKH_mPQEy34W"><div class="x03auy-9 ixBuze"></div><div class="x03auy-10 dwhAtJ"></div></div></div><div class="_2114DnVtHe_0MtbEW85tnL"><div class="_3j7WNOCzFwCp1SXZGJP1-V"><div class="_2q7IQ0BUOWeEZoeAxN555e x03auy-7 cYehNo"><i class="icon icon-upvote _2Jxk822qXs4DaXwsN7yyHA"></i></div><div class="_1iKd82bq_nqObFvSH1iC_Q x03auy-8 jcBcln"><i class="icon icon-downvote ZyxIIl4FP5gHGrJDzNpUC"></i></div></div><div class="_3tQxKBNuEJsKH_mPQEy34W"><div class="x03auy-9 ixBuze"></div><div class="x03auy-10 dwhAtJ"></div></div></div><div class="_2114DnVtHe_0MtbEW85tnL"><div class="_3j7WNOCzFwCp1SXZGJP1-V"><div class="_2q7IQ0BUOWeEZoeAxN555e x03auy-7 cYehNo"><i class="icon icon-upvote _2Jxk822qXs4DaXwsN7yyHA"></i></div><div class="_1iKd82bq_nqObFvSH1iC_Q x03auy-8 jcBcln"><i class="icon icon-downvote ZyxIIl4FP5gHGrJDzNpUC"></i></div></div><div class="_3tQxKBNuEJsKH_mPQEy34W"><div class="x03auy-9 ixBuze"></div><div class="x03auy-10 dwhAtJ"></div></div></div><div class="_2114DnVtHe_0MtbEW85tnL"><div class="_3j7WNOCzFwCp1SXZGJP1-V"><div class="_2q7IQ0BUOWeEZoeAxN555e x03auy-7 cYehNo"><i class="icon icon-upvote _2Jxk822qXs4DaXwsN7yyHA"></i></div><div class="_1iKd82bq_nqObFvSH1iC_Q x03auy-8 jcBcln"><i class="icon icon-downvote ZyxIIl4FP5gHGrJDzNpUC"></i></div></div><div class="_3tQxKBNuEJsKH_mPQEy34W"><div class="x03auy-9 ixBuze"></div><div class="x03auy-10 dwhAtJ"></div></div></div><div class="_2114DnVtHe_0MtbEW85tnL"><div class="_3j7WNOCzFwCp1SXZGJP1-V"><div class="_2q7IQ0BUOWeEZoeAxN555e x03auy-7 cYehNo"><i class="icon icon-upvote _2Jxk822qXs4DaXwsN7yyHA"></i></div><div class="_1iKd82bq_nqObFvSH1iC_Q x03auy-8 jcBcln"><i class="icon icon-downvote ZyxIIl4FP5gHGrJDzNpUC"></i></div></div><div class="_3tQxKBNuEJsKH_mPQEy34W"><div class="x03auy-9 ixBuze"></div><div class="x03auy-10 dwhAtJ"></div></div></div></div>