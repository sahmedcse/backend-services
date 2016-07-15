var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var email = require('sendgrid').mail;

app.use(bodyParser.json());

var server = app.listen(process.env.PORT || 3000, function() {
  var port = server.address().port;
  console.log("Server running on port", port);
});

app.post("/email", function(request, response) {
  var emailJson = request.body;
  console.log("JsonObj ", emailJson);

  sendEmail(emailJson);

  response.status(200).end();

});

function sendEmail(emailJson) {
  var emailFrom = new email.Email(emailJson.emailFrom);
  var emailTo = new email.Email(emailJson.emailTo);
  var subject = emailJson.subject;
  var content = new email.Content("text/plain", emailJson.emailContent);
  var mail = new email.Mail(emailFrom, subject, emailTo, content);

  var sg = require('sendgrid').SendGrid("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");

  var requestBody = mail.toJSON();
  var request = sg.emptyRequest();
  request.method = 'POST';
  request.path = '/v3/mail/send';
  request.body = requestBody;
  sg.API(request, function (response) {
    console.log(response.statusCode);
  });
};
