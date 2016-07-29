var options = {
 viewportSize: {width: 1000, height: 5000},
 pageSettings: {
  "userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.76 YaBrowser/16.6.0.6383 (beta) Safari/537.36",
  "loadImages": false,
  "loadPlugins": false,
  "javascriptEnabled": true
},
};

var system = require('system');
var casper = require('casper').create(options);
var mouse = require("mouse").create(casper);

if (system.args.length < 8) {
  casper.echo("Email, password, formId, color must be passed.");
  casper.exit();
}

var COLORS = {
  red:         { x: 663, y: 104, color: '#DB4437'},
  pink:        { x: 730, y: 104, color: '#E91E63'},
  purple:      { x: 797, y: 104, color: '#9C27B0'},
  deep_purple: { x: 864, y: 104, color: '#673AB7'},
  
  indigo:      { x: 663, y: 175, color: '#3F51B5'},
  blue:        { x: 730, y: 175, color: '#4285F4'},
  light_blue:  { x: 797, y: 175, color: '#03A9F4'},
  cyan:        { x: 732, y: 175, color: '#00BCD4'},
  
  teal:        { x: 663, y: 242, color: '#009688'},
  green:       { x: 730, y: 242, color: '#0F9D58'},
  lime:        { x: 797, y: 242, color: '#CDDC39'},
  orange:      { x: 798, y: 242, color: '#FF9800'},
  
  brown:       { x: 663, y: 310, color: '#795548'},
  grey:        { x: 730, y: 310, color: '#9E9E9E'},
  blue_grey:   { x: 797, y: 310, color: '#607D8B'}
};

var email = system.args[4];
var password = system.args[5];
var formId = system.args[6];
var color = COLORS[system.args[7]];

casper.logAndCapture = function(text) {
  console.log(text);
  casper.captureSelector('screenshots/' + text + '.jpg', 'body');
};

casper.on("page.error", function(msg, trace) {
  this.echo("Page Error: " + msg, "ERROR");
});

casper.on( 'page.initialized', function(){
  this.evaluate(function(){
    var isFunction = function(o) {
      return typeof o == 'function';
    };

    var bind,
    slice = [].slice,
    proto = Function.prototype,
    featureMap;

    featureMap = {
      'function-bind': 'bind'
    };

    function has(feature) {
      var prop = featureMap[feature];
      return isFunction(proto[prop]);
    }

    if (!has('function-bind')) {
      bind = function bind(obj) {
        var args = slice.call(arguments, 1),
        self = this,
        nop = function() {
        },
        bound = function() {
          return self.apply(this instanceof nop ? this : (obj || {}), args.concat(slice.call(arguments)));
        };
        nop.prototype = this.prototype || {};
        bound.prototype = new nop();
        return bound;
      };
      proto.bind = bind;
    }
  });
});

casper.start('https://accounts.google.com/Login?hl=EN', function() {
  casper.logAndCapture("1 - page opened");

  this.fillSelectors('form#gaia_loginform', {
    'input[name="Email"]': email,
  }); 

  casper.logAndCapture('2 - email filled');

  this.click("#next");

  this.wait(3000, function() {
    this.waitForSelector("#Passwd",
      function success() {
        casper.logAndCapture('3 - show password field');

        this.fillSelectors('form#gaia_loginform', {
          'input[name="Passwd"]': password,
        });

        casper.logAndCapture('4 - password filled');

        this.click("#signIn"); 

        this.wait(5000, function() {
          casper.logAndCapture('5 - logged in');

          casper.thenOpen('https://docs.google.com/forms/u/0/d/' + formId + '/edit', function() { 
            casper.logAndCapture("6 - form opened");
            this.click('.freebirdFormeditorViewHeaderThemeButton');

            this.wait(500, function() {
              casper.logAndCapture("7 - pallete opened");

              this.wait(500, function() {
                casper.mouse.click(color.x, color.y); 

                this.wait(1000, function() {
                  casper.logAndCapture("8 - color changed");
                });
              });
            });
          });
        });
      }, function fail() {
        console.log("FAIL...");
      });
  });
});

casper.run();