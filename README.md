# MQTT.js

Fork of the Espruino MQTT library

Added QoS handshake support and receiving messages over 127 bytes

# TODO
 - Cycle the outbound buffer to limit the stored messages
 - Restart after disconnect
 - Retain a list and subscribe to multiple topics at start and restart