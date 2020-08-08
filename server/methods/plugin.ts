import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check'

import Plugins from '../../models/Plugins';

Meteor.methods({
  'plugin/details'(pluginId) {
    check(pluginId, String);

    const plugin = Plugins.findOneById(pluginId);
    return plugin;
  }
});