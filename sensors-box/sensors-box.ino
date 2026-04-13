#include <WiFiS3.h>
#include <DHT11.h>
#include "env.h"

#define DHTPIN 2
#define MQ135PIN A0

DHT11 dht11(DHTPIN);
WiFiClient client;

void connectWiFi() {
  Serial.print("Connecting to WiFi");

  while (WiFi.begin(WIFI_SSID, WIFI_PASSWORD) != WL_CONNECTED) {
    Serial.print(".");
    delay(1000);
  }

  Serial.println();
  Serial.println("WiFi connected!");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
}

void sendSensorData(int temperature, int humidity, int airQuality) {
  String json = "{";
  json += "\"temperature\":" + String(temperature) + ",";
  json += "\"humidity\":" + String(humidity) + ",";
  json += "\"air_quality\":" + String(airQuality);
  json += "}";

  Serial.println("Sending JSON:");
  Serial.println(json);

  if (!client.connect(SERVER_HOST, SERVER_PORT)) {
    Serial.println("Server connection failed");
    return;
  }

  client.println("POST " + String(SERVER_PATH) + " HTTP/1.1");
  client.println("Host: " + String(SERVER_HOST));
  client.println("Content-Type: application/json");
  client.print("Content-Length: ");
  client.println(json.length());
  client.println("Connection: close");
  client.println();
  client.println(json);

  Serial.println("Request sent");

  // Optional: read response
  unsigned long timeout = millis();
  while (client.connected() && millis() - timeout < 3000) {
    while (client.available()) {
      Serial.write(client.read());
      timeout = millis();
    }
  }

  client.stop();
  Serial.println("\nConnection closed");
}

void setup() {
  Serial.begin(9600);

  // Better ADC precision for Uno R4
  analogReadResolution(12);

  connectWiFi();
}

void loop() {
  int temperature = 0;
  int humidity = 0;

  int result = dht11.readTemperatureHumidity(temperature, humidity);

  if (result != 0) {
    Serial.print("DHT11 error: ");
    Serial.println(DHT11::getErrorString(result));
    delay(2000);
    return;
  }

  int airQuality = analogRead(MQ135PIN);

  Serial.print("Temp: ");
  Serial.print(temperature);
  Serial.print(" °C, Humidity: ");
  Serial.print(humidity);
  Serial.print(" %, Air: ");
  Serial.println(airQuality);

  sendSensorData(temperature, humidity, airQuality);

  delay(5000); // every 5 sec
}