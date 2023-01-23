package com.gimbal.rtn;

import android.location.Location;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.gimbal.android.Attributes;
import com.gimbal.android.Beacon.BatteryLevel;
import com.gimbal.android.BeaconSighting;
import com.gimbal.android.Place;
import com.gimbal.android.PlaceEventListener;
import com.gimbal.android.PlaceManager;
import com.gimbal.android.Visit;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Nonnull;

public class PlaceManagerModule extends PlaceManagerSpec {
    public static final String NAME = "RtnGimbalPlaceManager";

    private enum Event {
        VISIT_START,
        VISIT_START_WITH_DELAY,
        VISIT_END,
        PLACE_BEACON_SIGHTING,
        LOCATION_DETECTED;

        @NonNull
        @Override
        public String toString() {
            // NOTE: when used as a event listener name, it must be unique app-wide
            return "GIMBAL_EVENT_" + this.name();
        }

        public String key() {
            return "EVENT_" + this.name();
        }
    }

    PlaceManagerModule(ReactApplicationContext context) {
        super(context);
        addPlaceEventListenerOnMainThread();
    }

    private void addPlaceEventListenerOnMainThread() {
        new Handler(Looper.getMainLooper()).post(() -> {
            Log.i("PlaceManager", "Adding place event listener");
            PlaceManager.getInstance().addListener(forwarder);
        });
    }

    @NonNull
    @Override
    public String getName() {
        return NAME;
    }

    @Override
    @ReactMethod
    public void startMonitoring() {
        PlaceManager.getInstance().startMonitoring();
    }

    @Override
    @ReactMethod
    public void stopMonitoring() {
        PlaceManager.getInstance().stopMonitoring();
    }

    @Override
    @ReactMethod
    public void isMonitoring(Promise promise) {
        promise.resolve(PlaceManager.getInstance().isMonitoring());
    }

    @Override
    @ReactMethod
    public void getCurrentVisits(Promise promise) {
        promise.resolve(toArray(PlaceManager.getInstance().currentVisits()));
    }

    @Override
    @ReactMethod
    public void addListener(String eventName) {
        // TODO: send any place events queued since start of app
    }

    @Override
    @ReactMethod
    public void removeListeners(double count) {
        // no-op?
    }

    @Override
    protected Map<String, Object> getTypedExportedConstants() {
        // Keys must align with JS native module getConstants() property names.
        Map<String, Object> constants = new HashMap<>();
        for (BatteryLevel level: BatteryLevel.values()) {
            constants.put("BATTERY_LEVEL_" + level.name(), level.name());
        }
        for (Event event: Event.values()) {
            constants.put(event.key(), event.toString());
        }
        return constants;
    }

    @SuppressWarnings("FieldCanBeLocal")
    private final PlaceEventListener forwarder = new PlaceEventListener() {
        @Override
        public void onVisitStart(Visit visit) {
            Log.d("PlaceManager", "Visit started: " + visit.getPlace().getName());
            sendEvent(Event.VISIT_START, toMap(visit));
        }

        @Override
        public void onVisitStartWithDelay(Visit visit, int i) {
            Log.d("PlaceManager", "Visit started with delay: " + visit.getPlace().getName());
            WritableMap visitWithDelay = toMap(visit);
            visitWithDelay.putInt("delay", i);
            sendEvent(Event.VISIT_START_WITH_DELAY, visitWithDelay);
        }

        @Override
        public void onVisitEnd(Visit visit) {
            Log.d("PlaceManager", "Visit ended: " + visit.getPlace().getName());
            sendEvent(Event.VISIT_END, toMap(visit));
        }

        @Override
        public void onBeaconSighting(BeaconSighting beaconSighting, List<Visit> list) {
            sendEvent(Event.PLACE_BEACON_SIGHTING, toMap(beaconSighting, list));
        }

        @Override
        public void locationDetected(Location location) {
            sendEvent(Event.LOCATION_DETECTED, toMap(location));
        }

        private void sendEvent(@Nonnull Event event, @Nullable WritableMap data) {
            BridgeUtilities.sendEvent(getReactApplicationContext(), event.toString(), data);
        }
    };

    private static WritableMap toMap(Visit visit) {
        WritableMap map = Arguments.createMap();
        map.putMap("place", toMap(visit.getPlace()));
        map.putString("visitId", visit.getVisitID());
        map.putDouble("arrivalTimeInMillis", visit.getArrivalTimeInMillis());
        map.putDouble("departureTimeInMillis", visit.getDepartureTimeInMillis());
        map.putDouble("dwellTimeInMillis", visit.getDwellTimeInMillis());
        return map;
    }

    private static WritableMap toMap(Place place) {
        WritableMap map = Arguments.createMap();
        map.putString("identifier", place.getIdentifier());
        map.putString("name", place.getName());
        map.putMap("attributes", toMap(place.getAttributes()));
        return map;
    }

    private static WritableMap toMap(Attributes attributes) {
        WritableMap map = Arguments.createMap();
        if (attributes != null) {
            for (String key : attributes.getAllKeys()) {
                map.putString(key, attributes.getValue(key));
            }
        }
        return map;
    }

    private static WritableMap toMap(Location location) {
        WritableMap map = Arguments.createMap();
        map.putDouble("latitude", location.getLatitude());
        map.putDouble("longitude", location.getLongitude());
        map.putDouble("accuracy", location.getAccuracy());
        return map;
    }

    private static WritableMap toMap(BeaconSighting beaconSighting, List<Visit> visits) {
        WritableMap map = Arguments.createMap();
        map.putMap("beaconSighting", BeaconUtilities.toMap(beaconSighting));
        map.putArray("visits", toArray(visits));
        return map;
    }

    private static WritableArray toArray(List<Visit> visits) {
        WritableArray array = Arguments.createArray();
        for (Visit visit: visits) {
            array.pushMap(toMap(visit));
        }
        return array;
    }
}
