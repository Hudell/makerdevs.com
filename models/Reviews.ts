import { Meteor } from 'meteor/meteor';

import { Base } from './Base';

class ReviewsModel extends Base {
  constructor() {
    super('reviews');
  }
}

export default new ReviewsModel();
