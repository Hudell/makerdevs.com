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

publishComposite('latestPlugins', {
  find() {
    return Plugins.findLatest(20);
  },
  collectionName: 'latestPlugins',
});
