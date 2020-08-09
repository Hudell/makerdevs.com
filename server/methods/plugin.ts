import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check'

import Plugins from '../../models/Plugins';
import Platforms from '../../models/Platforms';
import Users from '../../models/Users';

Meteor.methods({
  'plugin/details'(pluginId) {
    check(pluginId, String);

    const plugin = Plugins.findOneById(pluginId);

    if (plugin) {
      const user = Users.findOneById(plugin.userId);
      if (user && user.name) {
        plugin.author = user.name;
      } else {
        plugin.author = 'Unnamed User';
      }

      const platforms: Array<string> = [];
      for (const version of plugin.versions) {
        if (!version) continue;

        for (const platformCode of version.platforms) {
          if (platforms.includes(platformCode)) {
            continue;
          }
          platforms.push(platformCode);
        }
      }

      plugin.platforms = platforms.map(code => Platforms.findOneById(code));

      for (const version of plugin.versions) {
        if (!version) continue;

        for (const review of version.reviews) {
          if (!review) continue;

          const reviewUser = Users.findOneById(review.userId);
          if (reviewUser && reviewUser.name) {
            review.author = reviewUser.name;
          } else {
            review.author = 'Unnamed User';
          }
        }
      }
    }

    return plugin;
  }
});