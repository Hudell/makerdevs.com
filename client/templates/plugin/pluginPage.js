import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

import toastr from 'toastr';

import Plugins from '../../../models/Plugins';
import './pluginPage.html';


Template.pluginPage.helpers({
  plugin() {
    return Template.instance().plugin.get();
  },
  isLoaded() {
    return Template.instance().isLoaded.get();
  }
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
