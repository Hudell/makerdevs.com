import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

import toastr from 'toastr';

import Plugins from '../../../models/Plugins';
import { Modal } from '../../utils/modal';
import './pluginFile';
import './pluginPage.html';

const getPlugin = () => {
  return Template.instance().plugin.get();
};

const fillLatestFiles = (plugin) => {
  //Return the most recent file of each platform
  const platforms = {};
  for (const version of plugin.versions) {
    for (const platform of version.platforms) {
      if (!platforms[platform] || platforms[platform]._createdAt < version._createdAt) {
        platforms[platform] = version;
      }
    }
  }

  const files = [];
  for (const platform in platforms) {
    const file = platforms[platform];
    if (!files.includes(file)) {
      files.push(file);
    }
  }

  // If the number of files is not even, then tell the last file to use a largeColumn
  if (files.length && files.length % 2 === 1) {
    files[files.length -1].largeColumn = true;
  }

  plugin.latestFiles = files;
};

const fillOtherFiles = (plugin) => {
  const files = [];
  const latestFiles = plugin.latestFiles;

  for (const version of plugin.versions) {
    if (latestFiles.includes(version)) {
      continue;
    }

    files.push(version);
  }

  // If the number of files is not even, then tell the last file to use a largeColumn
  if (files.length && files.length % 2 === 1) {
    files[files.length -1].largeColumn = true;
  }

  plugin.otherFiles = files.sort((file1, file2) => {
    return file2._createdAt - file1._createdAt;
  })
};

const refreshData = (instance) => {
  const pluginId = FlowRouter.getParam('pluginId');

  Meteor.call('plugin/details', pluginId, (err, data) => {
    instance.isLoaded.set(true);

    if (err) {
      if (err.error === 'not-authorized' && err.reason === 'private') {
        toastr.error("This plugin is only visible to its author.");
        const userSlug = err.details;
        if (userSlug) {
          FlowRouter.go(`/profile/${ userSlug }`);
          return;
        }

        FlowRouter.go(`/home`);
      }

      toastr.error("Failed to load plugin data.");
      console.log(err);
      return;
    }

    if (!data) {
      instance.isInvalid.set(true);
      Session.set('pageTitle', 'Invalid Plugin Id');
      return;
    }

    Session.set('pageTitle', `Plugin Details - ${ data.name }`);
    fillLatestFiles(data);
    fillOtherFiles(data);

    instance.plugin.set(data);
  });
};


const checkReaction = (reactionId) => {
  const plugin = getPlugin();

  return plugin?.reactions && plugin.reactions[reactionId]?.includes(Meteor.userId());
};

Template.pluginPage.helpers({
  plugin() {
    return getPlugin();
  },
  draft() {
    return !getPlugin().public;
  },
  isLoaded() {
    return Template.instance().isLoaded.get();
  },
  isValid() {
    return !Template.instance().isInvalid.get();
  },
  hasOlderFiles() {
    return getPlugin().otherFiles?.length > 0;
  },
  platformName(code) {
    const plugin = getPlugin();

    for (const platform of plugin.platforms) {
      if (platform._id == code) {
        return platform.name;
      }
    }

    return code.toUpperCase();
  },
  reviews() {
    const plugin = getPlugin();

    return plugin.reviews?.sort((item1, item2) => item2._createdAt - item1._createdAt);
  },
  liked() {
    return checkReaction('like');
  },
  canReview() {
    const userId = Meteor.userId();
    if (!userId) {
      return false;
    }

    const plugin = getPlugin();
    if (userId == plugin.userId) {
      return false;
    }

    return true;
  },

  canEdit() {
    const userId = Meteor.userId();
    if (!userId) {
      return false;
    }

    const plugin = getPlugin();
    if (userId == plugin.userId) {
      return true;
    }

    return false;
  },
  likeCount() {
    const plugin = getPlugin();
    return plugin.reactions?.like?.length;
  },
  singleLike() {
    const plugin = getPlugin();
    return plugin.reactions?.like?.length === 1;
  },
});

Template.pluginPage.events({
  'click .download-link'(e, instance) {
    const pluginId = FlowRouter.getParam('pluginId');
    Meteor.call('plugin/click', pluginId);
  },
  'click .like-btn'(e, instance) {
    const pluginId = FlowRouter.getParam('pluginId');
    Meteor.call('plugin/like', pluginId, () => {
      refreshData(instance);
    });
  },
  'click .donate-btn'(e, instance) {
    const plugin = getPlugin();
    if (!plugin.donationUrl) {
      toastr.info('This plugin has no donation info.');
      return;
    }

    window.open(plugin.donationUrl);
  },
  'click .edit-btn'(e, instance) {
    const pluginId = FlowRouter.getParam('pluginId');
    FlowRouter.go(`/plugin/edit/${ pluginId }`);
  },
  'click .new-file-btn'(e, instance) {
    const pluginId = FlowRouter.getParam('pluginId');
    FlowRouter.go(`/plugin/newFile/${ pluginId }`);
  },
  'click .review-btn'(e, instance) {
    const pluginId = FlowRouter.getParam('pluginId');
    FlowRouter.go(`/plugin/review/${ pluginId }`);
  },
  'click .delete-review-btn'(e, instance) {
    Modal.show('Do you want to delete your review?', 'Click Confirm to permanently delete your review.', () => {
      const pluginId = FlowRouter.getParam('pluginId');

      Meteor.call('plugin/review/delete', pluginId, (err, result) => {
        if (err) {
          console.log(err);
          toastr.error("Failed to delete the review. Try again.");
          return;
        }

        toastr.success("Review deleted successfully.");
        refreshData(instance);
      });
    });
  },
});

Template.pluginPage.onCreated(function() {
  this.plugin = new ReactiveVar(false);
  this.isLoaded = new ReactiveVar(false);
  this.isInvalid = new ReactiveVar(false);

  refreshData(this);
});
