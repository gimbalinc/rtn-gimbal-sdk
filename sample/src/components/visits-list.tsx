import React, { Component } from 'react';
import { FlatList, NativeEventEmitter, StyleSheet, Text, View } from 'react-native';

import { PlaceManager, PlaceManagerEvent } from 'rtn-gimbal-sdk';
import type { Visit } from 'rtn-gimbal-sdk';

interface Props {}

interface State {
  visits: Visit[];
}

export class VisitsList extends Component<Props, State> {
  _placeEventEmitter: NativeEventEmitter;

  constructor(props: any) {
    super(props);
    this.state = {
      visits: [],
    };
    this._placeEventEmitter = new NativeEventEmitter(PlaceManager);
  }

  render() {
    return (
      <View style={styles.topContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Visits List</Text>
        </View>
        <View style={styles.listContainer}>
          <FlatList
            data={this.state.visits}
            renderItem={({ item, index }) => <VisitsListItem visit={item} index={index} />}
            ItemSeparatorComponent={Separator}
          />
        </View>
      </View>
    );
  }

  componentDidMount() {
    this.refreshList();

    const listener = (_visit: any) => {
      console.log('Refreshing Visits List');
      this.refreshList();
    };
    this._placeEventEmitter.addListener(PlaceManagerEvent.VISIT_START, listener);
    this._placeEventEmitter.addListener(PlaceManagerEvent.VISIT_START_WITH_DELAY, listener);
    this._placeEventEmitter.addListener(PlaceManagerEvent.VISIT_END, listener);
  }

  componentWillUnmount() {
    this._placeEventEmitter.removeAllListeners(PlaceManagerEvent.VISIT_START);
    this._placeEventEmitter.removeAllListeners(PlaceManagerEvent.VISIT_START_WITH_DELAY);
    this._placeEventEmitter.removeAllListeners(PlaceManagerEvent.VISIT_END);
  }

  refreshList() {
    PlaceManager.getCurrentVisits().then((newVisits: Array<Visit>) => {
      console.log(`current visits: ${JSON.stringify(newVisits)}`);
      const newVisitIds = newVisits.map((visit: Visit) => visit.visitId);
      newVisitIds.sort();
      const oldVisitIds = this.state.visits.map((visit) => visit.visitId);
      oldVisitIds.sort();
      if (
        newVisitIds.length !== oldVisitIds.length ||
        !newVisitIds.every((val: string, index: number) => val === oldVisitIds[index])
      ) {
        this.setState({
          visits: newVisits,
        });
      }
    });
  }
}

interface VisitsListProps {
  visit: Visit;
  index: number;
}

function VisitsListItem(props: VisitsListProps) {
  const localOffset = new Date().getTimezoneOffset() * 60_000;
  const arrivalTime = new Date(props.visit.arrivalTimeInMillis - localOffset)
    .toISOString()
    .substring(5, 19)
    .replace('T', ' ');

  return (
    <View style={[styles.transcriptItem]}>
      <View style={styles.transcriptItemRow}>
        <View>
          <Text style={styles.important}>{props.visit.place.name}</Text>
        </View>
        <View>
          <Text style={styles.time}>{arrivalTime}</Text>
        </View>
      </View>
      <View style={styles.transcriptItemRow}>
        <Text>{props.visit.visitId}</Text>
      </View>
    </View>
  );
}

function Separator(_props: any) {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    flexGrow: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderWidth: 2,
    borderRadius: 6,
  },
  listContainer: {
    flex: 1,
    flexGrow: 1,
    padding: 8,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    flexGrow: 1,
  },
  headerIcon: {
    padding: 8,
  },
  transcriptItem: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    alignContent: 'space-between',
    padding: 4,
  },
  transcriptItemRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },
  important: {
    fontWeight: 'bold',
  },
  time: {
    fontVariant: ['tabular-nums'],
  },
  separator: { borderWidth: 0.25 },
});
