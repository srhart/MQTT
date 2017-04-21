# MQTT.js

Fork of the Espruino MQTT library

Fix and clean adding about 350 bytes

Fixes:
 - handle part messages delivered in data buffer (on 'data')
 - handle multiple messages in one data buffer
 - decode messages with a remaining length above 127 bytes
 - provide correct QoS handshakes back to broker
 - produce valid message and subscribe pids
 - handle disconnects and other error conditions more gracefully

Now returns connection MQTT error ENUM so it can be translated into local language:

    1: 'UNACCEPTABLE_PROTOCOL_VERSION',
    2: 'IDENTIFIER_REJECTED',
    3: 'SERVER_UNAVAILABLE',
    4: 'BAD_USER_NAME_OR_PASSWORD',
    5: 'NOT_AUTHORIZED'

## Sample client for Pico WiFi

See *pico-wifi.js* for example code
