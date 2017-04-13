# MQTT.js

Fork of the Espruino MQTT library

Added QoS handshake support and receiving messages over 127 bytes


## Sample client for Pico WiFi

```javascript

var server = "xxxx.com"; // the ip of your MQTT broker
var options = { // all optional - the defaults are below
  client_id : getSerial(), // the client ID sent to MQTT - it's a good idea to define your own static one based on `getSerial()`
  keep_alive: 60, // keep alive time in seconds
  port: 1883, // port number
  clean_session: true,
  username: "xxxxxx", // default is undefined
  password: "*******",  // default is undefined
  protocol_name: "MQTT", // or MQIsdp, etc..
  protocol_level: 4, // protocol level
};


/**
var exports = {}

ADD MODULE HERE

var mqtt = exports.create(server, options);
*/

var mqtt = require("MQTT").create(server, options /*optional*/);
var WIFI_NAME = "XXXXXXXXX";
var WIFI_OPTIONS = { password : "********" };
var IP;
var RE_CONNECT = 10 * 60000;
var connected = false;

var wifi = require("EspruinoWiFi");

mqtt.on('connected', function() {
  console.log('MQTT connected');
  connected = true;
  mqtt.subscribe("test/time");
  mqtt.publish("test/espruino", "Hello :"+IP, 1);
});

mqtt.on('disconnected', function() {
  console.log('MQTT disconnected');
  connected = false;
  var reconnect = setTimeout(function () {
          mqtt.connect();
        }, RE_CONNECT);
});

mqtt.on('publish', function (pub) {
  try {
    var msgJ = JSON.parse(pub.message);
    if(msgJ.time) {
      setTime(msgJ.time);
      console.log('Time set to: '+now());
    }
  }
  catch(e) {
    if (connected) mqtt.publish("test/espruino",e);
  }
    console.log(JSON.stringify(pub));
    console.log("topic: "+pub.topic);
    console.log("message: "+pub.message);
});

function makeid()
{
  var msg = {};
  msg.date = new Date().toString();
  msg.ver = process.version;
  msg.env = process.env;
  msg.chpTemp = E.getTemperature();
  msg.v = E.getAnalogVRef();
  //msg.free = Flash.getFree();
  msg.mem = process.memory();

  return JSON.stringify(msg);
}

function postIt()
{
  var msg = "MSG : " + makeid();
  //var msg = "MSG : " + JSON.stringify(options);
  if (connected) mqtt.publish("test/espruino", msg, 1);
}

function onInit()
{
  //console.log("**** STARTING ****");
  wifi.connect(WIFI_NAME, WIFI_OPTIONS, function(err) {
    if (err) {
      console.log("Connection error: "+err);
      return;
    }
    console.log("WiFi Connected!");
    wifi.getIP(function (err, res) {
      if (!err) {
        console.log(res.ip);
        IP = res.ip;
        mqtt.connect();
      } else {
        console.log(err);
      }
    });
    ts = setInterval(function() {postIt();}, 100000);
  });
}
save();

```
