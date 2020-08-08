import { Session } from 'meteor/session';

import './contentWrapper.html';
import '../templates/empty/empty.html';

Template.contentWrapper.helpers({
  pageTitle() {
    return Session.get('pageTitle') || 'MakerDevs.com';
  },

  breadcrumbs() {
    return Session.get('breadcrumbs') || [];
  },
});