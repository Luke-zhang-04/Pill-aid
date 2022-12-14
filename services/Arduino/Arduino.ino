#include <ArduinoJson.h> // Must install through Arduino Library Manager
#include <LiquidCrystal.h>
#include <Servo.h>

const int backLight = 13;
const int buzzer = 8;

Servo servo1;
Servo servo2;
LiquidCrystal lcd(12, 11, 5, 4, 3, 2);

StaticJsonDocument<200> data;

// https://create.arduino.cc/projecthub/pythonpushover503/among-us-piezo-song-b7a259
void ringtone() {
  tone(buzzer, 1046);
  delay(250);
  tone(buzzer, 1244);
  delay(250);
  tone(buzzer, 1400);
  delay(250);
  tone(buzzer, 1510);
  delay(250);
  tone(buzzer, 1400);
  delay(250);
  tone(buzzer, 1244);
  delay(250);
  tone(buzzer, 1046);
  delay(250);
  noTone(buzzer);
  delay(500);
  tone(buzzer, 932);
  delay(125);
  tone(buzzer, 1174);
  delay(125);
  tone(buzzer, 1046);
  delay(250);
  // End of first
  noTone(buzzer);
  delay(500);
  tone(buzzer, 780);
  delay(250);
  tone(buzzer, 525);
  delay(250);
  noTone(buzzer);
  delay(250);
  // secont part
  tone(buzzer, 1046);
  delay(250);
  tone(buzzer, 1244);
  delay(250);
  tone(buzzer, 1400);
  delay(250);
  tone(buzzer, 1510);
  delay(250);
  tone(buzzer, 1400);
  delay(250);
  tone(buzzer, 1244);
  delay(250);
  tone(buzzer, 1400);
  delay(250);
  noTone(buzzer);
  delay(750);
  // fast part
  tone(buzzer, 1510);
  delay(125);
  tone(buzzer, 1400);
  delay(125);
  tone(buzzer, 1244);
  delay(125);
  tone(buzzer, 1510);
  delay(125);
  tone(buzzer, 1400);
  delay(125);
  tone(buzzer, 1244);
  delay(125);
  tone(buzzer, 1510);
  delay(125);
  tone(buzzer, 1400);
  delay(125);
  tone(buzzer, 1244);
  delay(125);
  tone(buzzer, 1510);
  delay(125);
  tone(buzzer, 1400);
  delay(125);
  tone(buzzer, 1244);
  delay(125);
  tone(buzzer, 1510);
  delay(125);
  noTone(buzzer);
  delay(500);
}

void lcdReset() {
  lcd.clear();
  lcd.setCursor(0, 0);
}

void dispensePills(int pill1Qt, int pill2Qt, bool useRingtone = true) {
  // Attach servos
  servo1.attach(9);
  servo2.attach(10);
  digitalWrite(backLight, LOW);

  // Reset both servos
  // NOTE that servo 1 and servo 2 are backwards
  // For servo 1, 0 is fully retracted
  // For servo 2, 180 is fully retracted
  servo1.write(0);
  delay(1000);
  servo2.write(180);
  delay(1000);

  if (useRingtone) {
    ringtone();
  }

  // Dispense one at a time (motors use a lot of voltage)
  for (int qt = 0; qt < pill1Qt; qt++) {
    servo1.write(180);
    delay(1000);
    servo1.write(30);
    delay(500);
  }
  servo1.write(0);
  delay(500);

  for (int qt = 0; qt < pill2Qt; qt++) {
    servo2.write(0);
    delay(1000);
    servo2.write(150);
    delay(500);
  }
  servo2.write(180);
  delay(500);

  // Stop servos from consuming power and turn LCD back on
  servo1.detach();
  servo2.detach();
  digitalWrite(backLight, HIGH);
}

void setup() {
  Serial.begin(9600);

  pinMode(backLight, OUTPUT);
  pinMode(buzzer, OUTPUT);
  dispensePills(0, 0, false);
  lcd.begin(16, 2);
}

void loop() {
  if (Serial.available()) {
    String input = Serial.readString();
    input.trim();

    DeserializationError err = deserializeJson(data, input);

    if (err) {
      lcdReset();
      lcd.print("Failed to parse");
    } else {
      lcdReset();
      lcd.print("Welcome, " + data["name"].as<String>());

      delay(500);
      dispensePills(data["pill1"].as<int>(), data["pill2"].as<int>());
      lcdReset();
      lcd.print("Pill 1: " + data["pill1"].as<String>() + " - DONE");
      lcd.setCursor(0, 1);
      lcd.print("Pill 2: " + data["pill2"].as<String>() + " - DONE");
    }
  }
}
