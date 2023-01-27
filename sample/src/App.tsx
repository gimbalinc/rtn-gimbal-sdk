import React, { Component } from 'react';
import {
  Button,
  EmitterSubscription,
  NativeEventEmitter,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { TabView, SceneMap } from 'react-native-tab-view';
import { Gimbal, GimbalDebugger, PlaceManager, PlaceManagerEvent, AnalyticsManager } from 'rtn-gimbal-sdk';
import type { Visit } from 'rtn-gimbal-sdk';
// CommunicationManager

import { VisitsList } from './components/visits-list';
import { LocationPermission, Permissions } from './utils/permissions';
import { EventTranscript, EventType } from './utils/event-transcript';

interface AppProps {}

interface AppState {
  appInstanceId: string | null;
  locationPermission: LocationPermission | null;
  notificationPermissionGranted: boolean | null;
}

export function AppFactory(
  eventTranscript: EventTranscript,
  permissions: Permissions,
  EventTranscriptView: typeof Component
) {
  class App extends Component<AppProps, AppState> {
    _placeListeners: EmitterSubscription[];
    _communicationListeners: EmitterSubscription[];

    constructor(props: any) {
      super(props);

      this.state = {
        appInstanceId: '--',
        locationPermission: null,
        notificationPermissionGranted: null,
      };
      this._placeListeners = [];
      this._communicationListeners = [];

      eventTranscript.append(new Date(), EventType.App, 'Starting App', '');
    }

    render() {
      const isLocationPermissionGranted =
        this.state.locationPermission === LocationPermission.Always ||
        this.state.locationPermission === LocationPermission.WhenInUse;

      const Body = !this.state.notificationPermissionGranted
        ? RequestNotificationPermissionFactory(permissions, this.onNotificationResult)
        : !isLocationPermissionGranted
        ? RequestLocationPermissionFactory(permissions, this.onLocationResult)
        : BodyTabViewFactory(EventTranscriptView);

      return (
        <SafeAreaProvider>
          <SafeAreaView style={styles.topContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.welcome}>Gimbal React Native Sample</Text>
              <Text>AI Id: {this.state.appInstanceId}</Text>
              <Text>Location Permission: {this.state.locationPermission}</Text>
            </View>

            <View style={styles.bodyContainer}>
              {this.state.locationPermission !== null && <Body />}
            </View>
          </SafeAreaView>
        </SafeAreaProvider>
      );
    }

    componentDidMount() {
      this._updateGimbalState();
      this._addPlaceListeners();
      this._addCommunicationListeners();
      this._updatePermissionState();

      // AnalyticsManager.setUserAnalyticsID("YOUR_ANALYTICS_ID");
      AnalyticsManager.deleteUserAnalyticsID();
    }

    componentWillUnmount() {
      this._removePlaceListeners();
      this._removeCommunicationListeners();
    }

    _updatePermissionState() {
      permissions.checkNotificationPermissionGranted().then(this.onNotificationResult);
      permissions.checkLocationPermission().then(this.onLocationResult);
    }

    onLocationResult = (permission: LocationPermission) => {
      console.log(`location permission state: ${permission}`);
      this.setState({
        locationPermission: permission,
      });
      if (permission === LocationPermission.Always || permission === LocationPermission.WhenInUse) {
        this.startGimbal();
      }
    };

    onNotificationResult = (granted: boolean) => {
      console.log(`notification permission granted: ${granted}`);
      this.setState({
        notificationPermissionGranted: granted,
      });
    };

    _updateGimbalState() {
      Gimbal.getApplicationInstanceIdentifier().then((identifier) => {
        console.log(`App Instance ID: ${identifier}`);
        this.setState({
          appInstanceId: identifier,
        });
      });
    }

    // Gimbal module
    startGimbal = async () => {
      if (!(await Gimbal.isStarted())) {
        console.log('Starting Gimbal');
        GimbalDebugger.enableDebugLogging();
        GimbalDebugger.enablePlaceLogging();
        Gimbal.start();
        eventTranscript.append(
          new Date(),
          EventType.App,
          'Gimbal Started',
          'Places / Communications / Est. Loc'
        );
      }
    };

    _addPlaceListeners() {
      if (this._placeListeners.length > 0) {
        return;
      }

      const placeEventEmitter = new NativeEventEmitter(PlaceManager);

      const visitStartSubscription = placeEventEmitter.addListener(
        PlaceManagerEvent.VISIT_START,
        (visit: Visit) => {
          console.log(`VisitStart: ${JSON.stringify(visit)}`);
          eventTranscript.append(
            new Date(visit.arrivalTimeInMillis),
            EventType.Place,
            visit.place.name,
            'ARRIVED'
          );
        }
      );

      const visitStartWithDelaySubscription = placeEventEmitter.addListener(
        PlaceManagerEvent.VISIT_START_WITH_DELAY,
        (visit: Visit) => {
          console.log(`VisitStartWithDelay: ${JSON.stringify(visit)}`);
          if (visit.delay && visit.delay > 0) {
            eventTranscript.append(
              new Date(visit.arrivalTimeInMillis),
              EventType.Place,
              visit.place.name,
              `ARRIVED with delay: ${visit.delay} sec`
            );
          }
        }
      );

      const visitEndSubscription = placeEventEmitter.addListener(
        PlaceManagerEvent.VISIT_END,
        (visit: Visit) => {
          console.log(`VisitEnd: ${JSON.stringify(visit)}`);

          const minutes = Math.floor(visit.dwellTimeInMillis / 60_000);
          const seconds = Math.floor((visit.dwellTimeInMillis % 60_000) / 1000);

          eventTranscript.append(
            new Date(visit.departureTimeInMillis),
            EventType.Place,
            visit.place.name,
            `DEPARTED with dwell: ${minutes}m${seconds < 10 ? '0' : ''}${seconds}s`
          );
        }
      );

      this._placeListeners.push(
        visitStartSubscription,
        visitStartWithDelaySubscription,
        visitEndSubscription
      );
    }

    _removePlaceListeners() {
      this._placeListeners.forEach((listener) => {
        listener.remove();
      });
      this._placeListeners = [];
    }

    _addCommunicationListeners() {
      if (this._communicationListeners.length > 0) {
        return;
      }

      // const communicationEventEmitter = new NativeEventEmitter(CommunicationManager);

      // const notificationClickedSubscription = communicationEventEmitter.addListener(
      //   'NotificationClicked',
      //   communicationsList => {
      //     console.log(`NotificationClicked: ${JSON.stringify(communicationsList)}`);
      //     communicationsList.communications.forEach(communication =>
      //       eventTranscript.append(
      //         new Date(),
      //         EventType.Communication,
      //         communication.title,
      //         'CLICKED'
      //       )
      //     );
      //   }
      // );
      //
      // this.communicationListeners = [notificationClickedSubscription];
    }

    _removeCommunicationListeners() {
      this._communicationListeners.forEach((listener) => {
        listener.remove();
      });
      this._communicationListeners = [];
    }
  }

  return App;
}

function BodyTabViewFactory(EventTranscriptView: typeof Component) {
  function BodyTabView() {
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
      { key: 'transcript', title: 'Transcript' },
      { key: 'places', title: 'Visits' },
    ]);
    const renderScene = SceneMap({
      transcript: EventTranscriptView,
      places: VisitsList,
    });

    return (
      <TabView
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        renderTabBar={() => null}
      />
    );
  }

  return BodyTabView;
}

function RequestLocationPermissionFactory(
  permissions: Permissions,
  onLocationResult: (permission: LocationPermission) => void
) {
  class RequestLocationPermission extends Component {
    render() {
      return (
        <>
          <Text>
            This app requires Location permission to trigger Gimbal Place and Communication Events.
          </Text>
          <View style={styles.spacer} />
          <Button title="Enable" onPress={this.onPress} />
        </>
      );
    }

    onPress() {
      permissions.requestLocation().then((permission) => onLocationResult(permission));
    }
  }

  return RequestLocationPermission;
}

function RequestNotificationPermissionFactory(
  permissions: Permissions,
  onNotificationResult: (granted: boolean) => void
) {
  class RequestNotificationPermission extends Component {
    render() {
      return (
        <>
          <Text>
            This app requires Notification permission to present Place-triggered Communications
          </Text>
          <View style={styles.spacer} />
          <Button title="Enable" onPress={this.onPress} />
        </>
      );
    }

    onPress() {
      permissions.requestNotification().then((permission) => onNotificationResult(permission));
    }
  }

  return RequestNotificationPermission;
}

const styles = StyleSheet.create({
  topContainer: {
    padding: 4,
    flex: 1,
    ...Platform.select({
      ios: {
        backgroundColor: 'snow',
      },
    }),
  },
  headerContainer: {
    margin: 4,
    padding: 16,
    borderWidth: 2,
    borderRadius: 6,
  },
  bodyContainer: {
    margin: 4,
    padding: 4,
    justifyContent: 'center',
    flex: 1,
    flexGrow: 1,
  },
  spacer: {
    height: 16,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  important: {
    fontWeight: 'bold',
  }
});
