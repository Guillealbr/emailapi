var express   = require('express'),
    bodyParser = require('body-parser'),
    utils = require('./utils'),
    router  = express.Router(),
    postmark = require("postmark"),
    fileStream = require('fs'),
    multer = require('multer');

// create app
var app = exports.app = express();
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// setting port
var port = process.env.PORT || utils.getPort()
app.set('port', port);

// parse application/json 
app.use(bodyParser.json({ type: 'application/json' }))

// allow get request from everywhere.-
app.all('*',function(req,res,next) { 
    if (!req.get('Origin')) return next();

    res.set('Access-Control-Allow-Origin','*');
    res.set("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
    res.set("Access-Control-Allow-Headers", "origin, x-requested-with, content-type, roleAuth");

    if ('OPTIONS' == req.method) return res.send("200");

    next();
});

router = exports.router = router;

router.post('/email/', function(req, res) {

    var client = new postmark.Client(utils.getAPIkey());
    var from = '';
    var to = '';
    var subject = 'Nueva Notificacion';
    var body = '';
    var htmlBody = '';

    if(!!req.body) {

      if(req.body.from === undefined || req.body.from === '') {
        return res.status(500).send({ message: 'From value is required'});
      }
      from = req.body.from;

      if(req.body.to === undefined || req.body.to === '') {
        return res.status(500).send({ message: 'To value is required'});
      }
      to = req.body.to;

      if(req.body.subject !== undefined) {
        subject = req.body.subject;
      }

      if((req.body.body === undefined || req.body.body === '') && (req.body.htmlBody === undefined || req.body.htmlBody === '')) {
        return res.status(500).send({ message: 'Body is required'});
      }
      body = req.body.body;

    } else {
      return res.status(500).send({ message: 'Body is required'});
    }


    if(req.body.body === undefined || req.body.body === '')
    {
      var email = {
                  From: req.body.from,
                  To: req.body.to,
                  Subject: req.body.subject,
                  HtmlBody:  req.body.htmlBody,
                  Attachments: req.body.Attachments
                 }
    }
    else
    {
      var email = {
                  From: req.body.from,
                  To: req.body.to,
                  Subject: req.body.subject,
                  TextBody:  req.body.body,
                  Attachments: req.body.Attachments
                 }
    }

  client.sendEmail(email, function(err, message) { 
    
    if(!!err) {
      return res.status(500).send(err);
    } else {
      return res.status(200).send(message); 
    }
    
  });
//return res.status(200).send();  
});

// Setting router with prefix;
app.use("/Api", router);

// start db connection
app.listen(app.get('port'));

return app;