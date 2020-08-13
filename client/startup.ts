import { Meteor } from 'meteor/meteor';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import './templates/latestPlugins/latestPlugins';
import './templates/modal/modal';

Meteor.SubsCache = new SubsCache(-1, -1);

BlazeLayout.setRoot('#dynamic-layout');

Meteor.SubsCache.subscribe('userData');
// Meteor.SubsCache.subscribe('allUserData');

Template.registerHelper("gt", function (v1: any, v2: any) {
  return v1 > v2;
});

Template.registerHelper("gte", function (v1: any, v2: any) {
  return v1 >= v2;
});

Template.registerHelper("isUser", function (id: string) {
  return id === Meteor.userId();
});