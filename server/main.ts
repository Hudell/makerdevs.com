import { Meteor } from 'meteor/meteor';
import './startup';

import '../models/Platforms';
import '../models/Plugins';
import '../models/PluginVersions';
import '../models/Reviews';

import './publications/plugins';
import './publications/latestPlugins';

import './methods/plugin';

