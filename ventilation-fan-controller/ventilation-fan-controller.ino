#include <WiFiS3.h>
#include <ArduinoHttpClient.h>
#include "env.h"
#include <ArduinoJson.h>

const int RELAY_PIN = 7;

WiFiClient wifi;
HttpClient client = HttpClient(wifi, API_HOST, API_PORT);

unsigned long lastCheck = 0;
const unsigned long interval = 5000; // 5 seconds

void setup() {
    Serial.begin(115200);

    pinMode(RELAY_PIN, OUTPUT);
    digitalWrite(RELAY_PIN, LOW);

    connectWiFi();
}

void loop() {
    if (millis() - lastCheck >= interval) {
        lastCheck = millis();

        checkVentilationStatus();
    }
}

void connectWiFi() {
    Serial.print("Connecting to WiFi");

    while (WiFi.begin(WIFI_SSID, WIFI_PASS) != WL_CONNECTED) {
        delay(1000);
        Serial.print(".");
    }

    Serial.println("\nConnected!");
    Serial.println(WiFi.localIP());
}

void checkVentilationStatus() {
    Serial.println("Checking API...");

    client.get(API_PATH);

    int statusCode = client.responseStatusCode();
    String response = client.responseBody();

    Serial.print("HTTP Status: ");
    Serial.println(statusCode);

    Serial.print("Response: ");
    Serial.println(response);

    if (statusCode == 200) {
      DynamicJsonDocument doc(256);
      deserializeJson(doc, response);
      bool fan = doc["fan"];

      digitalWrite(RELAY_PIN, fan ? HIGH : LOW);
    }

    client.stop();
}