var fs = require("fs"),
    http = require("http"),
    url = require("url"),
    request = require("request"),
    exec = require("child_process").exec,
    md5 = require("MD5"),
    Calc = require("./calc"),
    Firebase = require('firebase');

http.createServer(responseHandler).listen(8888);

var fbRef = new Firebase("https://treyhuffine-sample-apps.firebaseio.com/node-api/");
var fbEntries = fbRef.child("entries")
var totalsRef = fbRef.child("totals");

function responseHandler(req,resp) {
  resp.writeHead(200, {"Content-Type": "text/plain"});
  if (req.url.match("fav")) {
    resp.end("");
    return;
  }

  var apiRequest = req.url.match(/\/([\w]+)\//),
      apiFunction = (apiRequest ? apiRequest[1] : ""),
      apiValue = req.url.replace(/\/([\w]+)\//, ""),
      apiResult;
  results = {
    apiEndPoint: apiFunction,
    apiValue: apiValue,
    timeStamp: Firebase.ServerValue.TIMESTAMP,
    ipAddress: req.connection.remoteAddress,
    userAgent: req.headers['user-agent']
  };
  if (req.url === "/" || req.url === "") {
    resp.writeHead(200, {"Content-Type": "text/html"});
    fs.readFile('index.html', 'utf8', function (err,data) {
      resp.end(data);
    });
  } else {
    switch (apiFunction) {
      case "gravatarUrl":
        apiResult = gravatarResponse(resp, apiValue);
        resp.end(apiResult);
        break;
      case "Calc":
        apiResult = Calc.calculatorResponse(apiValue);
        resp.end(apiResult);
        break;
      case "Counts":
        apiResult = countsResponse(resp, apiValue);
        resp.end(apiResult);
        break;
      default:
        apiResult = "Error";
        apiFunction = "Error";
        defaultResponse(resp);
    }
    results.apiResult = apiResult;
    storeResults(results);
    var useCounter = totalsRef.child(apiFunction);
    useCounter.transaction(function (current_value) {
      return (current_value || 0) + 1;
    });
  }
}

function gravatarResponse(resp, email) {
  var gravatarHash = md5(email),
      gravatarUrl = "gravatar.com/avatar/" + gravatarHash;
  return gravatarUrl;
}
function countsResponse(resp, apiValue) {
  var responseString = decodeURI(apiValue).split(" "),
      spaces = responseString.length - 1,
      words = responseString.length,
      letters = responseString.join(" ").length;
  return JSON.stringify({letters: letters, spaces: spaces, words: words});
}
function defaultResponse(resp) {
  resp.write("Not a valid API call\n\nUse the following format: \n  /gravatarUrl/validEmail@email.com\n  /Calc/1+1\n  /Counts/use anyString");
  resp.end();
}
function storeResults(results) {
  fbEntries.push(results);
}
