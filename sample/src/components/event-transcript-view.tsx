import React, { Component, useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  GestureResponderEvent,
  Modal,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import { Event, EventFilter, EventTranscript, EventType } from '../utils/event-transcript';

import IconFA from 'react-native-vector-icons/FontAwesome';
import IconMI from 'react-native-vector-icons/MaterialIcons';

interface Props {}

interface State {
  events: Event[];
  eventFilterVisible: boolean;
  eventFilters: EventFilter[];
}

export function EventTranscriptViewFactory(transcript: EventTranscript): typeof Component {
  class EventTranscriptView extends Component<Props, State> {
    constructor(props: Props) {
      super(props);
      this.state = {
        events: [],
        eventFilterVisible: false,
        eventFilters: [],
      };
      for (const value in EventType) {
        this.state.eventFilters.push({ eventType: value as EventType, enabled: true });
      }
    }

    render() {
      return (
        <View style={styles.topContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Event Transcript</Text>
            <Pressable onPress={this.clearTranscript}>
              <IconFA name="trash-o" size={24} style={styles.headerIcon} />
            </Pressable>
            <Pressable onPress={this.presentListOptions}>
              <IconMI name="more-horiz" size={24} style={styles.headerIcon} />
            </Pressable>
          </View>
          <View style={styles.listContainer}>
            <FlatList
              data={this.state.events}
              renderItem={({ item }) => <TranscriptListItem event={item} />}
              ItemSeparatorComponent={Separator}
            />
          </View>
          <Modal
            visible={this.state.eventFilterVisible}
            onRequestClose={() => this.setState({ eventFilterVisible: false })}
            transparent={true}
          >
            <EventFilterEditor
              eventFilters={this.state.eventFilters}
              accept={(eventFilters) => {
                this.setState({
                  eventFilterVisible: false,
                  eventFilters: eventFilters,
                });
              }}
            />
          </Modal>
        </View>
      );
    }

    async componentDidMount() {
      this.refreshList();
      transcript.attach(() => {
        console.log('Notified of event transcript update');
        this.refreshList();
      });
    }

    async componentDidUpdate() {
      this.refreshList();
    }

    refreshList() {
      transcript.eventsWithFilter(this.state.eventFilters).then((events) => {
        console.log(`refreshing events view: ${events.length}/${this.state.events.length}`);
        events.sort((eventA, eventB) => eventB.when.getTime() - eventA.when.getTime());

        if (
          this.state.events.length !== events.length ||
          !this.state.events.every(
            (val, index) => val.when.valueOf() === events[index]?.when.valueOf()
          )
        ) {
          console.log(`updating events state: ${events.length}`);
          this.setState({
            events: events,
          });
        }
      });
    }

    clearTranscript = (_pressEvent: GestureResponderEvent) => {
      Alert.alert('Clear Transcript', 'Proceed with clearing the event transcript?', [
        {
          text: 'Cancel',
          onPress: () => console.log('Clearing Transcript cancelled'),
        },
        { text: 'OK', onPress: () => transcript.clearEvents() },
      ]);
    };

    presentListOptions = (_pressEvent: GestureResponderEvent) => {
      console.log('presentListOptions');
      this.setState({
        eventFilterVisible: true,
      });
    };
  }

  return EventTranscriptView;
}

interface TranscriptListItemProps {
  event: Event;
}

function TranscriptListItem(props: TranscriptListItemProps) {
  let event = props.event;
  const eventTime = new Date(event.when.getTime() - event.when.getTimezoneOffset() * 60_000)
    .toISOString()
    .substring(5, 19)
    .replace('T', ' ');

  return (
    <View style={[styles.transcriptItem]}>
      <View style={styles.transcriptItemRow}>
        <View>
          <Text style={styles.title}>{event.title}</Text>
        </View>
        <View>
          <Text style={styles.time}>{eventTime}</Text>
        </View>
      </View>
      <View style={styles.transcriptItemRow}>
        <Text>{event.message}</Text>
      </View>
    </View>
  );
}

function Separator(_props: any) {
  return <View style={styles.separator} />;
}

interface EventFilterEditorProps {
  eventFilters: EventFilter[];
  accept: (filterState: EventFilter[]) => void;
}

function EventFilterEditor(props: EventFilterEditorProps) {
  const [filterState, setFilterState] = useState(props.eventFilters);

  const toggleSwitch = (index: number) => {
    const newFilterState = filterState.slice();
    let filter = newFilterState[index];
    if (filter !== undefined) {
      filter.enabled = !filter.enabled;
    }
    setFilterState(newFilterState);
  };

  console.log(`filterState: ${JSON.stringify(filterState)}`);
  return (
    <View style={styles.modalContainer}>
      <View style={styles.filterView}>
        <Text style={styles.title}>Show Events</Text>
        <FlatList
          style={styles.settingsList}
          data={filterState}
          renderItem={({ item, index }) => (
            <View style={[styles.transcriptItemRow, styles.settingsItemRow]}>
              <Text style={styles.settingsText}>{item.eventType}</Text>
              <Switch value={item.enabled} onValueChange={() => toggleSwitch(index)} />
            </View>
          )}
        />
        <Button title="Accept" onPress={() => props.accept(filterState)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterView: {
    justifyContent: 'center',
    padding: 8,
    borderWidth: 1,
    shadowColor: '#404040',
    elevation: 4,
  },
  topContainer: {
    flex: 1,
    flexGrow: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
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
    paddingHorizontal: 12,
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
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  settingsList: {
    flexGrow: 0,
    marginVertical: 8,
  },
  settingsItemRow: {
    marginVertical: 4,
  },
  settingsText: {
    fontSize: 15,
    marginRight: 16,
  },
  time: {
    fontVariant: ['tabular-nums'],
  },
  separator: {
    borderWidth: 0.25,
  },
});
