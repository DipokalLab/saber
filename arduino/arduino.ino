#include "Arduino_BMI270_BMM150.h"
#include <MadgwickAHRS.h>
#include <ArduinoJson.h>

Madgwick filter;

void setup() {
  Serial.begin(115200); 
  
  if (!IMU.begin()) {
    Serial.println("Failed to initialize IMU!");
    while (1);
  }

  filter.begin(100); 
}

void loop() {
  float ax, ay, az;
  float gx, gy, gz;
  float mx, my, mz;

  if (IMU.accelerationAvailable() && IMU.gyroscopeAvailable() && IMU.magneticFieldAvailable()) {
    
    IMU.readAcceleration(ax, ay, az);
    IMU.readGyroscope(gx, gy, gz);
    IMU.readMagneticField(mx, my, mz);

    filter.update(gx, gy, gz, ax, ay, az, mx, my, mz);
    

    float pitch = filter.getPitch();
    float roll = filter.getRoll();
    float yaw = filter.getYaw();

    StaticJsonDocument<512> doc;

    // JsonObject rot = doc.createNestedObject("rot");
    // rot["pitch"] = pitch;
    // rot["roll"] = roll;
    // rot["yaw"] = yaw;

    JsonObject gyro = doc.createNestedObject("gyro");
    gyro["x"] = gx;
    gyro["y"] = gy;
    gyro["z"] = gz;

    // JsonObject accel = doc.createNestedObject("accel");
    // accel["x"] = ax;
    // accel["y"] = ay;
    // accel["z"] = az;

    serializeJson(doc, Serial);
    Serial.println();
  }
}