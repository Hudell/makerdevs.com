import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import Services from '../../models/Services';
import { Service } from '../../lib/types/Service';
import { refreshLoginServices } from '../functions/refreshLoginServices';

Meteor.methods({
  'services/get'() {
    const user = Meteor.user();
    if (!user || !user.admin) {
      throw new Meteor.Error('not-authorized');
    }

    const services = Services.findAll();
    return services.fetch();
  },

  'services/add'(serviceData: Service) {
    const user = Meteor.user();
    if (!user || !user.admin) {
      throw new Meteor.Error('not-authorized');
    }

    check(serviceData, {
      name: String,
      clientId: String,
      secret: String,
      loginStyle: String,
      buttonIcon: String,
      buttonText: String,
      enabled: Boolean,
    });

    Services.addService(serviceData);
    refreshLoginServices();
  },

  'services/update'(serviceId, serviceData: Service) {
    const user = Meteor.user();
    if (!user || !user.admin) {
      throw new Meteor.Error('not-authorized');
    }

    check(serviceId, String);

    check(serviceData, {
      name: String,
      clientId: String,
      secret: String,
      loginStyle: String,
      buttonIcon: String,
      buttonText: String,
      enabled: Boolean,
    });

    Services.updateService(serviceId, serviceData);
    refreshLoginServices();
  },

  'services/delete'(serviceId: Service) {
    const user = Meteor.user();
    if (!user || !user.admin) {
      throw new Meteor.Error('not-authorized');
    }

    check(serviceId, String);

    Services.removeService(serviceId);
    refreshLoginServices();
  },
});
