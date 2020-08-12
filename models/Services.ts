import { Mongo } from 'meteor/mongo';

import { Base } from './Base';
import { Service } from '../lib/types/Service';
import { MongoDocument } from '../lib/types/MongoDocument';

class ServicesModel extends Base {
  constructor() {
    super('services');
    this.ensureIndex('service');
  }

  addService(serviceData: Service): string {
    return this.insert(serviceData);
  }

  updateService(serviceId: string, serviceData: Service): void {
    this.update({
      _id: serviceId,
    }, {
      $set: serviceData,
    });
  }

  removeService(serviceId: string): void {
    this.remove({
      _id: serviceId,
    });
  }

  findAllLoginOptions(): Mongo.Cursor<MongoDocument> {
    return this.find({
      enabled: true,
    }, {
      fields: {
        name : 1,
        buttonText: 1,
        buttonIcon: 1,
        loginStyle: 1,
      },
    });
  }

  findAllEnabledServices(): Mongo.Cursor<MongoDocument> {
    return this.find({
      enabled: true,
    }, {});
  }

  findAllDisabledServices(): Mongo.Cursor<MongoDocument> {
    return this.find({
      enabled: {
        $ne: true,
      },
    }, {});
  }
}

export default new ServicesModel();
