String receivedString;

void setup() {
  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  if (Serial.available() > 0) {
    receivedString = Serial.readStringUntil('\n');

    if (receivedString == "LED_ON") {
      digitalWrite(LED_BUILTIN, HIGH);
      Serial.println("Arduino: LED is now ON.");
    } else if (receivedString == "LED_OFF") {
      digitalWrite(LED_BUILTIN, LOW);
      Serial.println("Arduino: LED is now OFF.");
    } else {
      Serial.print("Arduino received: ");
      Serial.println(receivedString);
    }
  }
}