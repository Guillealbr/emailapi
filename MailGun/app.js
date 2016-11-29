var express   = require('express'),
  	bodyParser = require('body-parser'),
  	Mailgun = require('mailgun-js'),
  	router  = express.Router(),
    formidable = require('formidable'),
    fileStream = require('fs'),
    multer = require('multer'),

    mandrill = require('mandrill-api/mandrill'),
    mandrill_client = new mandrill.Mandrill('rsYmvR5rtNsK0UXpm6f2UQ'),

    // defaultEmail = 'noreply@incoding.com.ar',
    defaultEmail = 'postmaster@incoding.com.ar',
    api_sandbox_key = 'key-df7e172ff6cc5a1a83e09bd1dd0e4e5e',
    api_sandbox_domain = 'sandbox39d95a0a52f6494bb61810c131df3109.mailgun.org',
    api_key = 'key-df7e172ff6cc5a1a83e09bd1dd0e4e5e',
    api_domain = 'incoding.com.ar';

// create app
var app = exports.app = express();

var mailgun = Mailgun({apiKey: api_sandbox_key, domain: api_sandbox_domain});

Object.prototype.hasOwnProperty = function(property) {
    return this[property] !== undefined;
};

// setting port
app.set('port', process.env.PORT || 8089);

// parse application/json 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

// allow get request from everywhere.-
app.all('*',function(req,res,next) { 
    if (!req.get('Origin')) return next();

    res.set('Access-Control-Allow-Origin','*');
    res.set("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
    res.set("Access-Control-Allow-Headers", "origin, x-requested-with, content-type, roleAuth");

    if ('OPTIONS' == req.method) return res.send("200");

    next();
});

// BASIC EMAIL WITH MAILGUN
router.post('/email', function(req, res, next) {

  if(!req.body.hasOwnProperty('to')) {
    res.status(404).send({ message: 'Missing "to" attribute', success: false });
  }

  if(!req.body.hasOwnProperty('subject')) {
    res.status(404).send({ message: 'Missing "subject" attribute', success: false });
  }

  if(!req.body.hasOwnProperty('message')) {
    res.status(404).send({ message: 'Missing "message" attribute', success: false });
  }

  next()  
}, function(req, res) {

	var from = !!req.body.from ? req.body.from : defaultEmail;
	var to = req.body.to;
	var subject = req.body.subject;
	var message = req.body.message;

  var data = {
    from: from,
    to: to,
    subject: subject,
    text: message
  };

  mailgun.messages().send(data, function (err, body) {

      if (err) {
          console.log("got an error: ", err);
          res.status(500).send({ success: false, message: 'error', error: err });
      }
      else {
          console.log("body", body);
          res.status(200).send({ success: true, message: 'Email sended', response: body });
      }
  });
});

// ATTACHMENT EMAIL WITH MAILGUN
router.post('/emailAttachment', function(req, res, next) {

  var form = new formidable.IncomingForm();

  var fields = [];
  var myfiles = [];
  var hasAttachment = false;

  form.on('field', function (field, value) {
    fields[field] = value;
  });

  form.on('file', function(field, file) {

    myfiles.push(new mailgun.Attachment({
      Name: file.name, 
      Content: new Buffer(file.path).toString('base64'),
      ContentType: file.type
    }));
    hasAttachment = true;
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
    res.status(500).send(err)
  });

  form.on('end', function() {
    
    var from = !!fields['from'] ? fields['from'] : defaultEmail;
    var to = fields['to'];
    var subject = fields['subject'];
    var message = fields['message'];

    var data = {
      from: from,
      to: to,
      subject: subject,
      html: message
    };

    if(hasAttachment) {
      data.attachment = myfiles;
    }

    mailgun.messages().send(data, function (err, body) {

        if (err) {
            res.status(500).send({ success: false, message: 'error', error: err });
        }
        else {
            res.status(200).send({ success: true, message: 'Email sended', response: body });
        }
    });
  });

  form.parse(req);
});

app.use("/api", router);

app.listen(app.get('port'));

console.log('Incoding EmailAPI started.-')

return app;