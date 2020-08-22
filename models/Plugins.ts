import { Base } from './Base';
import { MongoDocument } from '../lib/types/MongoDocument';
import { Plugin, ModifiedPlugin, SubmittedReview, PluginVersion } from '../lib/types/Plugin';

class PluginsModel extends Base {
  constructor() {
    super('plugins');
    this.ensureIndex('userId');
    this.ensureIndex('public');

    this._db.friendlySlugs({
      slugFrom: 'name',
      slugField: 'slug',
      distinct: true,
      updateSlug: false,
      createOnUpdate: true,
    });

    this.updateSlugs();
  }

  public findOneByImportedId(importedId: string): Plugin | undefined {
    const plugin = this.findOne({
      importedId,
    });

    if (plugin) {
      return plugin as Plugin;
    }
  }

  public addPlugin(record: Plugin): string {
    return this.insert(record);
  }

  public findPlatformMasterlist(platformCode: string): Mongo.Cursor<MongoDocument> {
    const options = {
      sort: {
        name: 1,
      },
      fields: {
        _id: 1,
        name: 1,
        description: 1,
        public: 1,
        slug: 1,
      },
    };

    const query = {
      'versions.platforms': platformCode,
      public: true,
    };

    return this.find(query, options);
  }

  public userLikedPlugin(userId: string, pluginId: string): boolean {
    const query = {
      _id: pluginId,
      'reactions.like': userId,
    };

    return this.find(query, {}).count() > 0;
  }

  public like(pluginId: string, userId: string): void {
    const query = {
      _id: pluginId,
    };

    const data = {
      $addToSet: {
        'reactions.like': userId,
      },
    };

    this.update(query, data);
  }

  public dislike(pluginId: string, userId: string): void {
    const query = {
      _id: pluginId,
    };

    const data = {
      $pull: {
        'reactions.like': userId,
      },
    };

    this.update(query, data);
  }

  public updatePlugin(newData: ModifiedPlugin): void {
    const query = {
      _id: newData._id,
    };

    const data = {
      $set: {
        name: newData.name,
        description: newData.description,
        public: newData.public,
        help: newData.help,
      },
    };

    this.update(query, data);
  }

  public addUserReview(userId: string, reviewData: SubmittedReview): void {
    const query = {
      _id: reviewData.pluginId,
    };

    const data = {
      $addToSet: {
        reviews: {
          userId,
          rating: reviewData.rating,
          comment: reviewData.comment,
          _createdAt: new Date(),
          _updatedAt: new Date(),
        }
      },
    };

    this.update(query, data);
  }

  public updateUserReview(userId: string, reviewData: SubmittedReview): void {
    const query = {
      _id: reviewData.pluginId,
      'reviews.userId': userId,
    };

    const data = {
      $set: {
        'reviews.$.rating': reviewData.rating,
        'reviews.$.comment': reviewData.comment,
        'reviews.$._updatedAt': new Date(),
      },
    };

    this.update(query, data);
  }

  public removeUserReview(userId: string, pluginId: string): void {
    const query = {
      _id: pluginId,
      'reviews.userId': userId,
    };

    const data = {
      $pull: {
        'reviews': {
          'userId': userId,
        },
      },
    };

    this.update(query, data);
  }

  public searchPlugins(filter: string): Mongo.Cursor<MongoDocument> {
    const query = {
      $or: [
        {
          public: true,
          name: new RegExp(`.*${ filter }.*`, 'i'),
        },
        {
          public: true,
          description: new RegExp(`.*${ filter }.*`, 'i'),
        }
      ]
    };

    const options = {
      fields: {
        name: 1,
        description: 1,
        public: 1,
        'versions.platforms': 1,
        slug: 1,
      }
    };

    return this.find(query, options);
  }

  public findAllPlatformsByUser(userId: string) {
    const query: Record<string, any> = {
      userId,
      public: true,
    };

    const options = {
      fields: {
        'versions.platforms': 1,
        _createdAt: 1,
      },
    };

    return this.find(query, options);
  }

  public findAllByUser(userId: string, includeDrafts: boolean) {
    const query: Record<string, any> = {
      userId,
    };

    if (!includeDrafts) {
      query.public = true;
    }

    const options = {
      fields: {
        name: 1,
        description: 1,
        public: 1,
        'versions.platforms': 1,
        slug: 1,
        _createdAt: 1,
      },
      sort: {
        _updatedAt: -1,
      },
    };

    return this.find(query, options);
  }

  public addVersion(pluginId: string, version: PluginVersion): void {
    const query = {
      _id: pluginId,
    };

    const data = {
      $addToSet: {
        versions: version
      },
    };

    this.update(query, data);
  }

  public removeVersion(pluginId: string, versionId: string): void {
    const query = {
      _id: pluginId,
      'versions._id': versionId,
    };

    const data = {
      $pull: {
        'versions': {
          '_id': versionId,
        },
      },
    };

    this.update(query, data);
  }

  public findAllCreators(): Mongo.Cursor<MongoDocument> {
    return this.find({
      public: true,
    }, {
      fields: {
        userId: 1,
        'versions.platforms': 1,
        _createdAt: 1,
      }
    })
  }
}

export default new PluginsModel();
