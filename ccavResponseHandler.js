const querystring = require("querystring");
var http = require("http"),
  fs = require("fs"),
  ccav = require("./ccavutil.js"),
  qs = require("querystring");

exports.postRes = async function (request, response) {
  console.log(request, "inside request");
  console.log(response, "inside response");
  var ccavEncResponse = "",
    ccavResponse = "",
    workingKey = "49A91DFE5E7F1E9633631C7CFB6CFF99", //Put in the 32-Bit key shared by CCAvenues.
    ccavPOST = "";

  ccavEncResponse += querystring.stringify(request.body);
  ccavPOST = qs.parse(ccavEncResponse);
  var encryption = ccavPOST.encResp;
  ccavResponse = await ccav.decrypt(encryption, workingKey);

  console.log(ccavResponse);
  var pData = "";
  pData = "<table border=1 cellspacing=2 cellpadding=2><tr><td>";
  pData = pData + ccavResponse.replace(/=/gi, "</td><td>");
  pData = pData.replace(/&/gi, "</td></tr><tr><td>");
  pData = pData + "</td></tr></table>";
  htmlcode =
    '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><title>Response Handler</title></head><body><center><font size="4" color="blue"><b>Response Page</b></font><br>' +
    pData +
    "</center><br></body></html>";
  response.writeHeader(200, { "Content-Type": "text/html" });
  response.write(htmlcode);
  response.end();
};
