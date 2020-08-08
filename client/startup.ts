import { Meteor } from 'meteor/meteor';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import './templates/latestPlugins/latestPlugins';

Meteor.SubsCache = new SubsCache(-1, -1);

BlazeLayout.setRoot('#dynamic-layout');
