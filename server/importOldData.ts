import Plugins from '../models/Plugins';
import Users from '../models/Users';

import { Plugin, PluginVersion, PluginReview } from '../lib/types/Plugin';
import { User } from '../lib/types/User';

import { oldPlugins } from '../data/plugins';
import { oldPluginVersions } from '../data/pluginVersions';
import { oldPluginComments } from '../data/pluginComments';
import { oldUsers } from '../data/users';

Meteor.startup(() => {
  // Add the old plugins
  const userIds: Record<string, string> = {};

  for (const user of oldUsers) {
    const userData: User = {
      name: user.name,
      emails: [{
        address: user.email,
        verified: false,
      }],
      services: {
        mvplugins: {
          id: user.id,
          password: user.password,
        }
      },
      website: user.website,
      views: 0,
      about: user.about || undefined,
      importedId: user.id,
      _createdAt: new Date(`${ user.created_at }Z`),
      _updatedAt: new Date(`${ user.updated_at }Z`),
    };

    try {
      userData.views = parseInt(user.views);
    } catch(e) {
    }

    const id = Users.addUser(userData);
    userIds[user.id] = id;
  }

  for (const plugin of oldPlugins) {
    const existingPlugin = Plugins.findOneByImportedId(plugin.id);
    if (existingPlugin) {
      continue;
    }

    const pluginData: Plugin = {
      name: plugin.name,
      description: plugin.description,
      importedId: plugin.id,
      help: plugin.help || '',
      tags: (plugin.tags || '').split(',').map(tag => tag.trim()),
      versions: [],
      reactions: {
      },
      userId: userIds[plugin.user_id],
      _createdAt: new Date(`${ plugin.created_at }Z`),
      _updatedAt: new Date(`${ plugin.updated_at }Z`),
    };

    for (const version of oldPluginVersions) {
      if (version.plugin_id !== plugin.id) {
        continue;
      }

      const versionData: PluginVersion = {
        _id: Random.id(),
        name: version.name,
        importedId: version.id,
        downloadLink: version.download_link ? `https://mvplugins.com/${ version.download_link}` : undefined,
        externalLink: version.external_link,
        platforms: ['mv'],
        reviews: [],
        score: 0,
        _createdAt: new Date(`${ version.created_at }Z`),
        _updatedAt: new Date(`${ version.updated_at }Z`),
      };

      for (const comment of oldPluginComments) {
        if (comment.plugin_version_id !== version.id) {
          continue;
        }

        const commentData: PluginReview = {
          rating: parseInt(comment.rating),
          comment: comment.comment,
          userId: userIds[comment.user_id],
          _createdAt: new Date(`${ comment.created_at }Z`),
          _updatedAt: new Date(`${ comment.updated_at }Z`),
        };

        if (commentData.rating >= 3) {
          if (!pluginData.reactions.like) {
            pluginData.reactions.like = [];
          }
          pluginData.reactions.like.push(commentData.userId);
        }

        versionData.reviews.push(commentData);
      }

      pluginData.versions.push(versionData);
    }

    Plugins.addPlugin(pluginData);
  }
});
