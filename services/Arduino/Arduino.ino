#include <Servo.h>

Servo servo1;

int pos = 0;

void setup() {
  servo1.attach(9);

  servo1.write(170);
  delay(1000);

  for (int dispenses = 0; dispenses < 5; dispenses++) {
    servo1.write(0);
    delay(1000);
    servo1.write(120);
    delay(500);
  }

  servo1.write(180);
  delay(250);
  servo1.write(170);
}

void loop() {}
