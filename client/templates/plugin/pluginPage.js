import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

import toastr from 'toastr';
import gravatar from 'gravatar';

import Plugins from '../../../models/Plugins';
import './pluginPage.html';

const getPlugin = () => {
  return Template.instance().plugin.get();
};

const getLatestFiles = () => {
  //Return the most recent file of each platform
  const plugin = getPlugin();

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

  return files;
};

Template.pluginPage.helpers({
  plugin() {
    return getPlugin();
  },
  isLoaded() {
    return Template.instance().isLoaded.get();
  },
  latestFiles() {
    return getLatestFiles();
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

    const allReviews = [];
    for (const version of plugin.versions) {
      allReviews.push(...version.reviews);
    }

    return allReviews.sort((item1, item2) => item2._createdAt - item1._createdAt);
  },
  avatarUrl(email) {
    return gravatar.url(email, {}, true);
  },
});

Template.pluginPage.onCreated(function() {
  const pluginId = FlowRouter.getParam('pluginId');

  this.plugin = new ReactiveVar(false);
  this.isLoaded = new ReactiveVar(false);

  Meteor.call('plugin/details', pluginId, (err, data) => {
    this.isLoaded.set(true);

    if (err) {
      toastr.error("Failed to load plugin data.");
      console.log(err);
      return;
    }

    Session.set('pageTitle', `Plugin Details - ${ data.name }`);
    this.plugin.set(data);
  });
});
