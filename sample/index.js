import { AppRegistry } from 'react-native';
import { AppFactory } from './src/App';
import { name as appName } from './app.json';

import { EventTranscript } from './src/utils/event-transcript';
import { EventTranscriptViewFactory } from './src/components/event-transcript-view';
import { Permissions } from './src/utils/permissions';

const transcript = new EventTranscript();
const permissions = new Permissions();
const EventTranscriptView = EventTranscriptViewFactory(transcript);
const SampleApp = AppFactory(transcript, permissions, EventTranscriptView);

AppRegistry.registerComponent(appName, () => SampleApp);
