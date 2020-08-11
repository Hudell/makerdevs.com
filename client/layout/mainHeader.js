import { Session } from 'meteor/session';
import { _ } from 'meteor/underscore';

import './mainHeader.html';

Template.mainHeader.events({
  'submit #searchForm'(e, instance) {
    e.preventDefault();
    const query = $('#siteSearch').val();

    FlowRouter.go(`/search/${ query }`);
  }
});
