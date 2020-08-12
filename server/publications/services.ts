import Services from '../../models/Services';

Meteor.publish('services', () => {
  return Services.findAllLoginOptions();
});
