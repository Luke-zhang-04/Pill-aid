import serial

ser = serial.Serial("/dev/serial0", 9600, timeout=1)

pill1Qt = int(input("How much of Pill 1? "))
pill2Qt = int(input("How much of Pill 2? "))

# NOTE: unfortunately, f-strings were introduced in Python 3.6, but the PI runs 3.4, and I don't want to deal with Rasbian at the moment
ser.write(
    bytes('{"pill1": ' + str(pill1Qt) + ', "pill2": ' + str(pill2Qt) + "}", "UTF-8")
)

# try:
#     while 1:
#         response = ser.readline()
#         print("RES", response)
# except KeyboardInterrupt:
#     ser.close()
