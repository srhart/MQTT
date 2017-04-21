/**
 * Sample Script with retry and error handling for Pico WiFi
 *
 * Send an epoc to test/time from another server to set the correct time on the pico
 * Ex. mosquitto_pub -m "{\"time\":`date +%s`}" -t test/time
 */
var mqtt = require("MQTT").create(server, options /*optional*/);
var WIFI_NAME = "wwwwwww";
var WIFI_OPTIONS = { password : "********" };
var IP;
var RE_CONNECT = 10 * 60000; // 10 Mins
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

mqtt.on('error', function(err) {
    console.log('MQTT Error '+err);
});

mqtt.on('publish', function (pub) {
    try {
        var msgJ = JSON.parse(pub.message);
        if(msgJ.time) {
            setTime(msgJ.time);
            console.log('Time set to: '+new Date().toString());
            return;
        }
    }
    catch(e) {
        if (connected) mqtt.publish("test/espruino",e);
        console.log(e);
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
        var ts = setInterval(function() {postIt();}, 100000);
    });
}
save();