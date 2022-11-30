import serial
import firebase_admin
from firebase_admin import credentials, firestore
import json
from datetime import datetime as date
import itertools
from functools import reduce

file = open("./config.json")
config = json.load(file)
file.close()

ser = serial.Serial("/dev/serial0", 9600, timeout=1)


def should_dispense_now(pill) -> bool:
    yday = date.today().timetuple().tm_yday
    now = date.now()

    return (
        ("lastDispensed" not in pill or pill["lastDispensed"] != yday)
        and now.hour >= pill["hour"]
        and now.minute >= pill["min"]
    )


cred = credentials.Certificate("./admin-sdk.json")
app = firebase_admin.initialize_app(cred)
db = firestore.client(app)

collection = db.collection(config["userid"])
user_data = collection.get()
allPills = filter(
    lambda data: data[1]["name"] == config["name"],
    map(lambda data: (data, data.to_dict()), user_data),
)

pill1 = []
pill2 = []

for pill in allPills:
    if pill[1]["medType"].lower() == config[
        "pill1Type"
    ].lower() and should_dispense_now(pill[1]):
        pill1.append(pill)
    elif pill[1]["medType"].lower() == config[
        "pill2Type"
    ].lower() and should_dispense_now(pill[1]):
        pill2.append(pill)

# NOTE: unfortunately, f-strings were introduced in Python 3.6, but the PI runs 3.4, and I don't want to deal with Raspbian and Debian at the moment
if len(pill1) or len(pill2):
    yday = date.today().timetuple().tm_yday
    pill1_qt = reduce(lambda prev, cur: prev + cur[1]["dosage"], pill1, 0)
    pill2_qt = reduce(lambda prev, cur: prev + cur[1]["dosage"], pill2, 0)

    ser.write(
        bytes(
            '{"pill1": {pill1_qt}, "pill2": {pill2_qt}, "name": {name}}'.format(
                pill1_qt=pill1_qt,
                pill2_qt=pill2_qt,
                name=config.name,
            ),
            "UTF-8",
        )
    )

    for [doc, val] in itertools.chain(pill1, pill2):
        doc.reference.update({"lastDispensed": yday})
