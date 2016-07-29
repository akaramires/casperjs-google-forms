var system = require('system');
var casper = require('casper').create({
 viewportSize: {width: 1000, height: 1000},
 pageSettings: {
  "userAgent": 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1',
  "loadImages": false,
  "loadPlugins": false,
  "javascriptEnabled": true
},
});

if (system.args.length < 6) {
  casper.echo("Email and password must be passed.");
  casper.exit();
}

var email = system.args[4];
var password = system.args[5];
console.log('Email: ', email);
console.log('Password: ', password);

casper.logandscreen = function(text) {
  console.log(text);
  casper.captureSelector('screenshots/' + text + '.jpg', 'body');
};

casper.on("page.error", function(msg, trace) {
  this.echo("Page Error: " + msg, "ERROR");
});

casper.start("https://accounts.google.com/Login?hl=EN", function() {
  casper.logandscreen("1 - page opened");

  this.fillSelectors('form#gaia_loginform', {
    'input[name="Email"]': email,
  }); 

  casper.logandscreen('2 - email filled');

  this.click("#next");

  this.wait(3000, function() {
    this.waitForSelector("#Passwd",
      function success() {
        casper.logandscreen('3 - show password field');

        this.fillSelectors('form#gaia_loginform', {
          'input[name="Passwd"]': password,
        });

        casper.logandscreen('4 - password filled');

        this.click("#signIn"); //Click sign in button
        this.wait(8000, function() {
          casper.logandscreen('5 - form submitting');
        });
      },
      function fail() {
        console.log("FAIL...");
      });
  });
});
casper.run();