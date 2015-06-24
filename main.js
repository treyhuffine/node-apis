var fs = require("fs"),
    http = require("http"),
    url = require("url"),
    request = require("request"),
    exec = require("child_process").exec,
    md5 = require("MD5"),
    Calc = require("./calc");

http.createServer(responseHandler).listen(8888);

function responseHandler(req,resp) {
  resp.writeHead(200, {"Content-Type": "text/plain"});
  if (req.url.match("fav")) {
    resp.end("");
    return;
  }

  var apiRequest = req.url.match(/\/([\w]+)\//),
      apiFunction = (apiRequest ? apiRequest[1] : ""),
      apiValue = req.url.replace(/\/([\w]+)\//, "");
  switch (apiFunction) {
    case "gravatarUrl":
      gravatarResponse(resp, apiValue);
      break;
    case "Calc":
      var result = Calc.calculatorResponse(apiValue);
      resp.end(result);
      break;
    case "Counts":
      countsResponse(resp, apiValue);
      break;
    default:
      defaultResponse(resp);
  }
}

function gravatarResponse(resp, email) {
  var gravatarHash = md5(email),
      gravatarUrl = "gravatar.com/avatar/" + gravatarHash;
  resp.end(gravatarUrl);
}
function countsResponse(resp, apiValue) {
  var responseString = decodeURI(apiValue).split(" "),
      spaces = responseString.length - 1,
      words = responseString.length,
      letters = responseString.join(" ").length;
  resp.end(JSON.stringify({letters: letters, spaces: spaces, words: words}));
}
function defaultResponse(resp) {
  resp.write("Not a valid API call\n\nUse the following format: \n  /gravatarUrl/validEmail@email.com\n  /Calc/1+1\n  /Counts/use anyString");
  resp.end();
}
