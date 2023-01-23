import AsyncStorage from '@react-native-async-storage/async-storage';
import AsyncLock from 'async-lock';

export enum EventType {
  App = 'App',
  Place = 'Place',
  Communication = 'Communication',
}

export interface EventFilter {
  enabled: boolean;
  eventType: EventType;
}

const STORAGE_LOCK_KEY = 'STORAGE_LOCK_KEY';

export class EventTranscript {
  private _events: Event[] | null;
  private _update_callbacks: (() => void)[];
  private _lock = new AsyncLock();

  constructor() {
    this._events = null;
    this._update_callbacks = [];
  }

  async append(dateTime: Date, eventType: EventType, title: string, message: string | null) {
    this.appendEvent(new Event(dateTime, eventType, title, message));
  }

  async appendEvent(event: Event) {
    await this._lock.acquire(STORAGE_LOCK_KEY, async () => {
      const sequence = await this._getSequence();
      const newSequencePair: [string, string] = ['@sample_sequence', (sequence + 1).toString()];
      const eventKey = '@sample_event_' + sequence.toString().padStart(6, '0');
      const newEventPair: [string, string] = [eventKey, JSON.stringify(event)];

      await AsyncStorage.multiSet([newSequencePair, newEventPair]);
      if (this._events !== null) {
        this._events.push(event);
      }
    });
    this._upon_update();
  }

  async _getSequence(): Promise<number> {
    try {
      const sequence = await AsyncStorage.getItem('@sample_sequence');
      return sequence == null ? 0 : parseInt(sequence, 10);
    } catch (e) {
      console.log('_getSequence exception: ' + e);
      return 0;
    }
  }

  async _loadEvents() {
    if (this._events !== null) {
      return;
    }
    try {
      const eventKeys = (await AsyncStorage.getAllKeys()).filter((value) =>
        value.startsWith('@sample_event_')
      );

      this._events = (await AsyncStorage.multiGet(eventKeys))
        .map((pair) => pair[1] || '{}')
        .map((json) => Event.fromJson(json));
    } catch (e) {
      console.log('fetching events exception: ' + e);
      this._events = [];
    }
  }

  async events(): Promise<Event[]> {
    await this._loadEvents();
    return this._events || [];
  }

  async eventsWithFilter(eventFilters: EventFilter[]): Promise<Event[]> {
    let filteredEvents = await this.events();

    eventFilters.forEach((eventFilter) => {
      if (!eventFilter.enabled) {
        filteredEvents = filteredEvents.filter(
          (event) => event.eventType !== eventFilter.eventType
        );
      }
    });
    return filteredEvents;
  }

  async clearEvents() {
    console.log('Clearing event transcript');
    await this._lock.acquire(STORAGE_LOCK_KEY, async () => {
      const eventKeys = (await AsyncStorage.getAllKeys()).filter((value) =>
        value.startsWith('@sample_event_')
      );
      await AsyncStorage.multiRemove(eventKeys);
      await AsyncStorage.removeItem('@sample_sequence');
      this._events = null;
    });
    this._upon_update();
  }

  _upon_update() {
    this._update_callbacks.forEach((callback: () => void) => {
      try {
        callback();
      } catch (error) {
        console.error(`An exception was thrown within the change callback: ${error}`);
      }
    });
  }

  attach(update_callback: () => void) {
    this._update_callbacks.push(update_callback);
  }

  detach(callbackToRemove: () => void) {
    this._update_callbacks = this._update_callbacks.filter(
      (callback) => callbackToRemove !== callback
    );
  }
}

export class Event {
  when: Date;
  eventType: EventType;
  title: string;
  message: string | null;

  constructor(when: Date, eventType: EventType, title: string, message: string | null) {
    this.when = when;
    this.eventType = eventType;
    this.title = title;
    this.message = message;
  }

  static fromJson(json: string): Event {
    return JSON.parse(json, Event.reviver);
  }

  static reviver = (key: string, value: any) => {
    if (typeof value === 'undefined') {
      return null;
    }
    if (key === '') {
      return new Event(value.when, value.eventType, value.title, value.message);
    }
    switch (key) {
      case 'when':
        return new Date(value);
      case 'eventType':
        switch (value) {
          case 'App':
            return EventType.App;
          case 'Place':
            return EventType.Place;
          case 'Communication':
            return EventType.Communication;
          default:
            return null;
        }
      case 'title':
      case 'message':
        return value;
      default:
        return null;
    }
  };
}
