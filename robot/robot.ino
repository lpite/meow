#include <WiFiS3.h>
#include <Servo.h>
#include <NewPing.h>

// --- WiFi & Server Credentials ---
const char ssid[] = "aaaaaaaaaaaaaaaaaa";
const char pass[] = "0985962047";
const char server[] = "192.168.50.65"; // CHANGE TO YOUR SERVER IP
int port = 3000;

WiFiClient client;

// --- Motor Pins ---
const int MOTOR_A_IA = 13;
const int MOTOR_A_IB = 12;
const int MOTOR_B_IA = 11;
const int MOTOR_B_IB = 10;

// --- Servo Setup ---
Servo servo1;
Servo servo2;

// --- Sensor Pins (CJMCU-6814) ---
const int PIN_CO  = A0;
const int PIN_NO2 = A1;
const int PIN_NH3 = A2;

// --- Ultrasonic Sensors ---
#define TRIG_LEFT   2
#define ECHO_LEFT   3
#define TRIG_FRONT  4
#define ECHO_FRONT  5
#define TRIG_RIGHT  6
#define ECHO_RIGHT  7

#define MAX_DISTANCE 200
#define OBSTACLE_DIST 20 // Distance in cm to trigger avoidance

NewPing sonarLeft(TRIG_LEFT, ECHO_LEFT, MAX_DISTANCE);
NewPing sonarFront(TRIG_FRONT, ECHO_FRONT, MAX_DISTANCE);
NewPing sonarRight(TRIG_RIGHT, ECHO_RIGHT, MAX_DISTANCE);

// --- Vacuum Tuning ---
const int FORWARD_TIME = 1500; // Time to drive straight (ms)
const int TURN_TIME = 600;     // Time for a 90-degree turn (ms)

// Helper function to safely read distance
int safePing(NewPing &sonar) {
  int d = sonar.ping_cm();
  return d ? d : MAX_DISTANCE;
}

// ==========================================
//          1-MINUTE ROAMING VACUUM
// ==========================================
void roamAndClean(unsigned long durationMillis) {
  Serial.print("Starting continuous cleaning for ");
  Serial.print(durationMillis / 1000);
  Serial.println(" seconds...");
  
  unsigned long startTime = millis();
  
  // Start moving immediately
  moveForward();

  // Keep looping until the time is up
  while (millis() - startTime < durationMillis) {
    
    // Constantly check the front sensor
    if (safePing(sonarFront) < OBSTACLE_DIST) {
      stopMotors();
      avoidObstacle(); // Decide which way to turn
      
      // After dodging the obstacle, resume moving forward
      moveForward(); 
    }
    
    // Short delay to prevent the ultrasonic pulses from interfering with each other
    delay(30); 
  }

  // Time is up!
  stopMotors();
  Serial.println("Cleaning timer finished. Awaiting next command.");
}

void setup() {
  Serial.begin(115200);
  
  pinMode(MOTOR_A_IA, OUTPUT); pinMode(MOTOR_A_IB, OUTPUT);
  pinMode(MOTOR_B_IA, OUTPUT); pinMode(MOTOR_B_IB, OUTPUT);
  stopMotors();

  servo1.attach(8);
  servo2.attach(9);
  servo1.write(0); 
  servo2.write(0);

  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("WiFi module failed!");
    while (true);
  }

  Serial.print("Connecting to SSID: ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
    if(millis() > 15000 && WiFi.status() != WL_CONNECTED) {
       WiFi.begin(ssid, pass);
    }
  }
  Serial.println("\nWiFi Connected!");
}

void loop() {
  askServerForCommand();
  delay(1000); 
}

void askServerForCommand() {
  int valCO  = analogRead(PIN_CO);
  int valNO2 = analogRead(PIN_NO2);
  int valNH3 = analogRead(PIN_NH3);

  Serial.print("\nPinging Server | CO: "); Serial.print(valCO);
  Serial.print(" | NO2: "); Serial.print(valNO2);
  Serial.print(" | NH3: "); Serial.println(valNH3);

  if (client.connect(server, port)) {
    String url = "GET /api/robots/1/status?co=" + String(valCO) + "&no2=" + String(valNO2) + "&nh3=" + String(valNH3) + " HTTP/1.1";
    
    client.println(url);
    client.print("Host: ");
    client.println(server);
    client.println("Connection: close");
    client.println();

    unsigned long timeout = millis();
    while (client.available() == 0) {
      if (millis() - timeout > 3000) {
        Serial.println(">>> Client Timeout !");
        client.stop();
        return;
      }
    }

    String response = "";
    while (client.available()) {
      char c = client.read();
      response += c;
    }

    Serial.println("Server says: " + response);
    
    if (response.indexOf("CLEAN") != -1){
      roamAndClean(20000); // 60,000 ms = 1 minute
    }
    else if (response.indexOf("STOP") != -1) stopMotors();
    
    if (response.indexOf("SERVO_UP") != -1) {
      servo1.write(180); servo2.write(180);
    }
    else if (response.indexOf("SERVO_DOWN") != -1) {
      servo1.write(0); servo2.write(0);
    }

    client.stop();
  } else {
    Serial.println("Connection failed");
  }
}

// ==========================================
//          OBSTACLE AVOIDANCE
// ==========================================
void avoidObstacle() {
  Serial.println("Obstacle detected! Calculating path...");
  
  // Look left and right
  int leftDist = safePing(sonarLeft);
  int rightDist = safePing(sonarRight);
  
  Serial.print("Left: "); Serial.print(leftDist);
  Serial.print(" cm | Right: "); Serial.println(rightDist);

  // Decide where to go
  if (leftDist > rightDist && leftDist > OBSTACLE_DIST) {
    Serial.println("Turning Left");
    turnLeft();
    delay(TURN_TIME + random(-200, 200));
  } else if (rightDist > OBSTACLE_DIST) {
    Serial.println("Turning Right");
    turnRight();
    delay(TURN_TIME + random(-200, 200));
  } else {
    Serial.println("Trapped! Reversing...");
    moveBackward();
    delay(800);
    turnRight();
    delay(TURN_TIME * 2); // 180-degree turn
  }
  
  stopMotors();
  delay(200);
}

// Moves forward but constantly checks the front sensor
void moveForwardWithCheck(unsigned long duration) {
  unsigned long start = millis();
  moveForward();
  
  while (millis() - start < duration) {
    if (safePing(sonarFront) < OBSTACLE_DIST) {
      stopMotors();
      avoidObstacle();
      return; // Break out of the straight line if obstacle found
    }
    delay(30); // Prevent sensor echo collisions
  }
  stopMotors();
}

// ==========================================
//          VACUUM SQUARE ROUTINE
// ==========================================
void driveSquare() {
  Serial.println("Starting cleaning pattern...");
  
  for (int i = 0; i < 4; i++) {
    // 1. Move Forward (Using the sensor-checking function)
    moveForwardWithCheck(FORWARD_TIME);
    delay(200);
    
    // 2. Turn 90 Degrees
    turnRight();
    delay(TURN_TIME);
    
    // 3. Stop briefly
    stopMotors();
    delay(200);
  }
  Serial.println("Pattern complete.");
}

// --- Basic Motor Drivers ---
void moveForward() {
  digitalWrite(MOTOR_A_IA, HIGH); digitalWrite(MOTOR_A_IB, LOW);
  digitalWrite(MOTOR_B_IA, HIGH); digitalWrite(MOTOR_B_IB, LOW);
}

void moveBackward() {
  digitalWrite(MOTOR_A_IA, LOW);  digitalWrite(MOTOR_A_IB, HIGH);
  digitalWrite(MOTOR_B_IA, LOW);  digitalWrite(MOTOR_B_IB, HIGH);
}

void turnLeft() {
  digitalWrite(MOTOR_A_IA, LOW);  digitalWrite(MOTOR_A_IB, HIGH);
  digitalWrite(MOTOR_B_IA, HIGH); digitalWrite(MOTOR_B_IB, LOW);
}

void turnRight() {
  digitalWrite(MOTOR_A_IA, HIGH); digitalWrite(MOTOR_A_IB, LOW);
  digitalWrite(MOTOR_B_IA, LOW);  digitalWrite(MOTOR_B_IB, HIGH);
}

void stopMotors() {
  digitalWrite(MOTOR_A_IA, LOW); digitalWrite(MOTOR_A_IB, LOW);
  digitalWrite(MOTOR_B_IA, LOW); digitalWrite(MOTOR_B_IB, LOW);
}