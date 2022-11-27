#include <ArduinoJson.h> // Must install through Arduino Library Manager
#include <LiquidCrystal.h>
#include <Servo.h>

const int backLight = 13;

Servo servo1;
Servo servo2;
LiquidCrystal lcd(12, 11, 5, 4, 3, 2);

StaticJsonDocument<200> data;

void lcdReset() {
  lcd.clear();
  lcd.setCursor(0, 0);
}

void dispensePills(int pill1Qt, int pill2Qt) {
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
  digitalWrite(backLight, HIGH);
  lcd.begin(16, 2);
}

void loop() {
  if (Serial.available()) {
    String input = Serial.readString();
    input.trim();

    DeserializationError err = deserializeJson(data, input);

    if (err) {
      lcdReset();
      lcd.print("Failed to parse object?!?!");
    } else {
      lcdReset();
      lcd.print("Pill 1: " + data["pill1"].as<String>());
      lcd.setCursor(0, 1);
      lcd.print("Pill 2: " + data["pill2"].as<String>());

      delay(500);
      dispensePills(data["pill1"].as<int>(), data["pill2"].as<int>());
      lcdReset();
      lcd.print("Pill 1: " + data["pill1"].as<String>() + " - DONE");
      lcd.setCursor(0, 1);
      lcd.print("Pill 2: " + data["pill2"].as<String>() + " - DONE");
    }
  }
}
