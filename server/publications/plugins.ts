import { publishComposite } from 'meteor/reywood:publish-composite';
import { Match, check } from 'meteor/check';

import Plugins from '../../models/Plugins';

Meteor.publish('plugins', (query) => {
  check(query, Match.Maybe(String));

  if (query) {
    const filter = query.trim();
    if (filter) {
      return Plugins.searchPlugins(filter);
    }
  }

  return Plugins.findAll();
});

publishComposite('mv:masterlist', {
  find() {
    return Plugins.findPlatformMasterlist('mv');
  },
  collectionName: 'mv:masterlist',
});

publishComposite('mz:masterlist', {
  find() {
    return Plugins.findPlatformMasterlist('mz');
  },
  collectionName: 'mz:masterlist',
});

publishComposite('latestPlugins', {
  find() {
    return Plugins.findLatest(20);
  },
  collectionName: 'latestPlugins',
});
