package com.gimbal.rtn;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.gimbal.android.Beacon;
import com.gimbal.android.BeaconSighting;

public class BeaconUtilities {
    static WritableMap toMap(BeaconSighting beaconSighting) {
        WritableMap map = Arguments.createMap();
        map.putInt("rssi", beaconSighting.getRSSI());
        map.putDouble("timeInMillis", beaconSighting.getTimeInMillis());
        map.putMap("beacon", toMap(beaconSighting.getBeacon()));
        return map;
    }

    static WritableMap toMap(Beacon beacon) {
        WritableMap map = Arguments.createMap();
        map.putString("identifier", beacon.getIdentifier());
        map.putString("uuid", beacon.getUuid());
        map.putString("name", beacon.getName());
        map.putString("iconURL", beacon.getIconURL());
        map.putInt("batteryLevel", beacon.getBatteryLevel().ordinal());
        map.putInt("temperature", beacon.getTemperature());
        return map;
    }
}
