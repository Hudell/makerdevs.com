import { Meteor } from 'meteor/meteor';

Meteor.methods({
  'data/import'() {
    const user = Meteor.user();
    if (!user || !user.admin) {
      throw new Meteor.Error('not-authorized');
    }

    throw new Meteor.Error('no-data-to-import');
    // import('../importOldData');
  },
});
