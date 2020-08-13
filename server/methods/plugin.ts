import { Meteor } from 'meteor/meteor';
import { Match, check } from 'meteor/check';

import Plugins from '../../models/Plugins';
import Platforms from '../../models/Platforms';
import Users from '../../models/Users';
import Files from '../../models/Files';
import Clicks from '../../models/Clicks';
import { UploadedPlugin, Plugin, ModifiedPlugin, SubmittedReview } from '../../lib/types/Plugin';

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

      for (const review of plugin.reviews) {
        if (!review) continue;

        const reviewUser = Users.findOneById(review.userId);
        if (reviewUser && reviewUser.name) {
          review.author = reviewUser.name;
          review.authorEmail = reviewUser.emails[0].address;
        } else {
          review.author = 'Unnamed User';
        }
      }
    }

    return plugin;
  },

  'plugin/submit'(pluginData: UploadedPlugin) {
    const userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('not-authorized');
    }

    check(pluginData, {
      name: String,
      description: Match.Optional(String),
      public: Boolean,
      versionName: String,
      externalLink: Match.Optional(String),
      platforms: [String],
      help: Match.Optional(String),
      fileHeader: Match.Optional({
        name: String,
        size: Number,
        type: String,
      }),
      fileData: Match.Optional(String),
    });

    const name = pluginData.name.trim().substr(0, 60);
    const description = pluginData.description?.trim().substr(0, 100);
    const versionName = pluginData.versionName.trim().substr(0, 40);
    const externalLink = pluginData.externalLink?.trim();
    const help = pluginData.help?.trim();
    const { fileHeader, fileData } = pluginData;

    if (!pluginData.platforms.length) {
      throw new Meteor.Error('invalid-data', 'missing-platform');
    }

    for (const platformCode of pluginData.platforms) {
      const platform = Platforms.findOneById(platformCode);
      if (!platform) {
        throw new Meteor.Error('invalid-data', 'unknown-platform', platformCode);
      }
    }

    if (!externalLink && !fileData) {
      throw new Meteor.Error('invalid-data', 'missing-file');
    }

    let fileId;

    if (fileData) {
      const maxFileSize = 1024 * 1024;
      const allowedTypes = [
        'application/x-7z-compressed',
        'application/zip',
        'application/x-rar-compressed',
        'text/javascript'
      ];

      if (!fileHeader) {
        throw new Meteor.Error('invalid-data');
      }
      if (fileHeader.size > maxFileSize) {
        throw new Meteor.Error('invalid-data');
      }
      if (!allowedTypes.includes(fileHeader.type)) {
        throw new Meteor.Error('invalid-data');
      }
      if (fileData.length > maxFileSize * 1.1) {
        throw new Meteor.Error('invalid-data');
      }

      fileId = Files.insertFile(fileHeader.name, fileHeader.size, fileHeader.type, fileData);
    }

    const newPluginData: Plugin = {
      name,
      description,
      help,
      tags: [],
      versions: [],
      reactions: {},
      reviews: [],
      score: 0,
      userId,
      public: pluginData.public,
    };

    newPluginData.versions.push({
      _id: Random.id(),
      name: versionName,
      externalLink,
      fileId,
      platforms: pluginData.platforms,
    });

    return Plugins.addPlugin(newPluginData);
  },

  'plugin/submitFile'(pluginId, pluginData) {
    const userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('not-authorized');
    }

    check(pluginId, String);
    const plugin = Plugins.findOneById(pluginId);
    if (!plugin) {
      throw new Meteor.Error('invalid-data');
    }

    if (plugin.userId !== userId) {
      throw new Meteor.Error('not-authorized');
    }

    check(pluginData, {
      versionName: String,
      externalLink: Match.Optional(String),
      platforms: [String],
      fileHeader: Match.Optional({
        name: String,
        size: Number,
        type: String,
      }),
      fileData: Match.Optional(String),
    });

    const versionName = pluginData.versionName.trim().substr(0, 40);
    const externalLink = pluginData.externalLink?.trim();
    const { fileHeader, fileData } = pluginData;

    if (!pluginData.platforms.length) {
      throw new Meteor.Error('invalid-data', 'missing-platform');
    }

    for (const platformCode of pluginData.platforms) {
      const platform = Platforms.findOneById(platformCode);
      if (!platform) {
        throw new Meteor.Error('invalid-data', 'unknown-platform', platformCode);
      }
    }

    if (!externalLink && !fileData) {
      throw new Meteor.Error('invalid-data', 'missing-file');
    }

    let fileId;

    if (fileData) {
      const maxFileSize = 1024 * 1024;
      const allowedTypes = [
        'application/x-7z-compressed',
        'application/zip',
        'application/x-rar-compressed',
        'text/javascript'
      ];

      if (!fileHeader) {
        throw new Meteor.Error('invalid-data');
      }
      if (fileHeader.size > maxFileSize) {
        throw new Meteor.Error('invalid-data');
      }
      if (!allowedTypes.includes(fileHeader.type)) {
        throw new Meteor.Error('invalid-data');
      }
      if (fileData.length > maxFileSize * 1.1) {
        throw new Meteor.Error('invalid-data');
      }

      fileId = Files.insertFile(fileHeader.name, fileHeader.size, fileHeader.type, fileData);
    }

    const pluginVersion = {
      _id: Random.id(),
      name: versionName,
      externalLink,
      fileId,
      platforms: pluginData.platforms,
      _createdAt: new Date(),
      _updatedAt: new Date(),
    };

    Plugins.addVersion(pluginId, pluginVersion);
  },

  'plugin/edit'(pluginData: ModifiedPlugin) {
    const userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('not-authorized');
    }

    check(pluginData, {
      _id: String,
      name: String,
      description: Match.Optional(String),
      public: Boolean,
      help: Match.Optional(String),
    });

    const plugin = Plugins.findOneById(pluginData._id);
    if (!plugin) {
      throw new Meteor.Error('invalid-data');
    }

    if (plugin.userId !== userId) {
      throw new Meteor.Error('not-authorized');
    }

    Plugins.updatePlugin(pluginData);
  },

  'plugin/file/delete'(pluginId: string, fileId: string) {
    const userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('not-authorized');
    }

    check(pluginId, String);
    check(fileId, String);

    const plugin = Plugins.findOneById(pluginId);
    if (!plugin) {
      throw new Meteor.Error('invalid-data');
    }

    if (plugin.userId !== userId) {
      throw new Meteor.Error('not-authorized');
    }

    for (const version of plugin.versions) {
      if (version._id === fileId) {
        Plugins.removeVersion(pluginId, fileId);
        return;
      }
    }

    throw new Meteor.Error('invalid-data');
  },

  'plugin/review'(reviewData: SubmittedReview) {
    const userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('not-authorized');
    }

    check(reviewData, {
      pluginId: String,
      comment: String,
      rating: Number,
    });

    const plugin = Plugins.findOneById(reviewData.pluginId);
    if (!plugin) {
      throw new Meteor.Error('invalid-data');
    }

    if (plugin.userId === userId) {
      throw new Meteor.Error('not-authorized');
    }

    if (!reviewData.rating || isNaN(Number(reviewData.rating)) || reviewData.rating > 5) {
      throw new Meteor.Error('invalid-data');
    }

    if (!reviewData.comment) {
      throw new Meteor.Error('invalid-data');
    }

    for (const review of plugin.reviews) {
      if (review.userId === userId) {
        Plugins.updateUserReview(userId, reviewData);
        return;
      }
    }

    Plugins.addUserReview(userId, reviewData);
  },

  'plugin/review/delete'(pluginId: string) {
    const userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('not-authorized');
    }

    check(pluginId, String);

    const plugin = Plugins.findOneById(pluginId);
    if (!plugin) {
      throw new Meteor.Error('invalid-data');
    }

    if (plugin.userId === userId) {
      throw new Meteor.Error('not-authorized');
    }

    for (const review of plugin.reviews) {
      if (review.userId === userId) {
        Plugins.removeUserReview(userId, pluginId);
        return;
      }
    }

    throw new Meteor.Error('invalid-data');
  },

  'plugin/click'(pluginId: string) {
    const address = this.connection?.clientAddress;
    Clicks.insertClick(pluginId, Meteor.userId(), address);
  },

  'plugin/like'(pluginId: string) {
    const userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('not-authorized');
    }

    const plugin = Plugins.findOneById(pluginId);
    if (!plugin) {
      throw new Meteor.Error('plugin-not-found');
    }

    if (Plugins.userLikedPlugin(userId, pluginId)) {
      Plugins.dislike(pluginId, userId);
    } else {
      Plugins.like(pluginId, userId);
    }
  },

  'plugin/list'(platformCode: string) {
    check(platformCode, String);

    const platform = Platforms.findOneById(platformCode);
    if (!platform) {
      throw new Meteor.Error('invalid-platform');
    }

    return Plugins.findPlatformMasterlist(platformCode).fetch();
  }
});

DDPRateLimiter.addRule({
  type: 'method',
  name: 'plugin/click',
}, 5, 1000);

DDPRateLimiter.addRule({
  type: 'method',
  name: 'plugin/like',
}, 5, 1000);


DDPRateLimiter.addRule({
  type: 'method',
  name: 'plugin/submit',
}, 3, 10000);