import { Platform } from 'react-native';
import {
  check,
  Permission,
  PERMISSIONS,
  request,
  RESULTS,
  requestNotifications,
  checkNotifications,
  requestMultiple,
  NotificationOption,
} from 'react-native-permissions';

import Constants from './constants';

export enum LocationPermission {
  Always = 'Always',
  WhenInUse = 'When In Use',
  Never = 'Never',
}

export class Permissions {
  checkLocationPermission = async () => {
    if (this._isPlatformiOS()) {
      const alwaysGranted = await check(PERMISSIONS.IOS.LOCATION_ALWAYS).then(
        (value) => value === RESULTS.GRANTED
      );
      const whenInUseGranted = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(
        (value) => value === RESULTS.GRANTED
      );
      return alwaysGranted
        ? LocationPermission.Always
        : whenInUseGranted
        ? LocationPermission.WhenInUse
        : LocationPermission.Never;
    } else if (this._isPlatformAndroid()) {
      const fineGranted = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(
        (value) => value === RESULTS.GRANTED
      );
      const coarseGranted = await check(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION).then(
        (value) => value === RESULTS.GRANTED
      );
      const backgroundGranted = await check(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION).then(
        (value) => value === RESULTS.GRANTED
      );

      return backgroundGranted
        ? LocationPermission.Always
        : fineGranted || coarseGranted
        ? LocationPermission.WhenInUse
        : LocationPermission.Never;
    } else {
      throw Constants.UNKNOWN_PLATFORM;
    }
  };

  checkNotificationPermissionGranted = async () => {
    if (this._isPlatformAndroid() && Platform.Version < 33) {
      return true;
    }
    return await checkNotifications().then(({ status }) => {
      return status === RESULTS.GRANTED;
    });
  };

  requestLocation = async () => {
    if (this._isPlatformiOS()) {
      const alwaysGranted = await request(PERMISSIONS.IOS.LOCATION_ALWAYS).then(
        (value) => value === RESULTS.GRANTED
      );
      if (alwaysGranted) {
        return LocationPermission.Always;
      }
      const whenInUseGranted = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(
        (value) => value === RESULTS.GRANTED
      );
      return whenInUseGranted ? LocationPermission.WhenInUse : LocationPermission.Never;
    } else if (this._isPlatformAndroid()) {
      const permissions: Permission[] = [
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
      ];
      if (Platform.Version >= 31) {
        permissions.push(PERMISSIONS.ANDROID.BLUETOOTH_SCAN);
      }

      const statuses = await requestMultiple(permissions);
      const coarseGranted =
        statuses[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION] === RESULTS.GRANTED;
      const fineGranted = statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === RESULTS.GRANTED;
      const backgroundGranted = await check(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION).then(
        (value) => value === RESULTS.GRANTED
      );
      return backgroundGranted
        ? LocationPermission.Always
        : fineGranted || coarseGranted
        ? LocationPermission.WhenInUse
        : LocationPermission.Never;
    } else {
      throw Constants.UNKNOWN_PLATFORM;
    }
  };

  requestNotification = async () => {
    const options: NotificationOption[] = [];
    if (this._isPlatformiOS()) {
      options.push('alert');
      options.push('sound');
    }
    return await requestNotifications(options).then(({ status }) => {
      console.log(`${status}`);
      return status === RESULTS.GRANTED;
    });
  };

  _isPlatformiOS() {
    return Platform.OS === Constants.IOS;
  }

  _isPlatformAndroid() {
    return Platform.OS === Constants.ANDROID;
  }
}
