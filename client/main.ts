// import { Template } from 'meteor/templating';
// import { ReactiveVar } from 'meteor/reactive-var';

// import './main.html';

// Template.hello.onCreated(function helloOnCreated() {
//   // counter starts at 0
//   this.counter = new ReactiveVar(0);
// });

// Template.main.helpers({
//   // counter() {
//   //   return Template.instance().counter.get();
//   // },
// });

// Template.hello.events({
//   'click button'(event, instance) {
//     // increment the counter when button is clicked
//     instance.counter.set(instance.counter.get() + 1);
//   },
// });

// import '../imports/startup/accounts-config';
// import '../imports/ui/body';

import './startup';
import '../lib/router';

import './layout/body';
import '../models/client/LatestPlugins';


import './templates/latestPlugins/latestPlugins';
