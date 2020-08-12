import { ServiceConfiguration } from 'meteor/service-configuration';

import Services from '../../models/Services';

export const refreshLoginServices = () => {
  ServiceConfiguration.configurations.remove({});

  const cursor = Services.findAllEnabledServices();
  cursor.forEach((service) => {
    let columnName = 'clientId';
    switch (service.name.toLowerCase()) {
      case 'facebook':
        columnName = 'appId';
        break;
      case 'twitter':
        columnName = 'consumerKey';
        break;
    }

    const data: Record<string, string> = {
      loginStyle: service.loginStyle,
      secret: service.secret,
    };

    data[columnName] = service.clientId;

    ServiceConfiguration.configurations.upsert({
      service: service.name,
    }, {
      $set: data
    });
  });
};