import './reviewPlugin.html';
import { _ } from 'meteor/underscore';
import toastr from 'toastr';
import { Session } from 'meteor/session';

const getPlugin = () => {
  return Template.instance().plugin.get();
};

const refreshData = (instance) => {
  const pluginId = FlowRouter.getParam('pluginId');

  Meteor.call('plugin/details', pluginId, (err, data) => {
    instance.isLoaded.set(true);

    if (err) {
      toastr.error("Failed to load plugin data.");
      console.log(err);
      return;
    }

    Session.set('pageTitle', `Reviewing Plugin - ${ data.name }`);
    instance.plugin.set(data);

    const userId = Meteor.userId();
    const review = data.reviews?.find((review) => review.userId === userId);

    if (review) {
      instance.review.set(review);
    } else {
      instance.review.set({
        comment: '',
        rating: 0,
      });
    }
  });
};

Template.reviewPlugin.helpers({
  isLoaded() {
    return Template.instance().isLoaded.get();
  },
  plugin() {
    return getPlugin();
  },
  review() {
    return Template.instance().review.get();
  },
  starCount() {
    const instance = Template.instance();
    const hoverRating = instance.hoverRating.get();
    if (hoverRating > 0) {
      return hoverRating;
    }
    const review = instance.review.get();
    return review.rating;
  }

});

let resetStarHandler;

Template.reviewPlugin.events({
  'click .cancel'(e, instance) {
    const pluginId = FlowRouter.getParam('pluginId');
    FlowRouter.go(`/plugin/${ pluginId }`);
  },

  'mouseenter .fa-star'(e, instance) {
    instance.hoverRating.set(Number(e.target.dataset.rate));
    if (resetStarHandler) {
      clearTimeout(resetStarHandler);
      resetStarHandler = false;
    }
  },

  'mousemove .fa-star'(e, instance) {
    instance.hoverRating.set(Number(e.target.dataset.rate));
    if (resetStarHandler) {
      clearTimeout(resetStarHandler);
      resetStarHandler = false;
    }
  },

  'click .fa-star'(e, instance) {
    const rate = Number(e.target.dataset.rate);
    instance.review.get().rating = rate;
    instance.hoverRating.set(rate);
    if (resetStarHandler) {
      clearTimeout(resetStarHandler);
      resetStarHandler = false;
    }
  },

  'mouseout .star-container'(e, instance) {
    if (resetStarHandler) {
      clearTimeout(resetStarHandler);
    }

    resetStarHandler = setTimeout(() => {
      instance.hoverRating.set(0);
      resetStarHandler = false;
    }, 300);
  },

  'click .submit'(e, instance) {
    e.preventDefault();

    const plugin = getPlugin();
    const pluginId = plugin._id;
    const comment = $('#pluginReview').val().trim();
    const rating = instance.review.get().rating;

    const reviewData = {
      pluginId,
      rating,
      comment,
    };

    let valid = true;
    if (!rating || isNaN(Number(rating)) || rating > 5) {
      toastr.error("Please select a star rating.");
      valid = false;
    }

    if (!comment) {
      toastr.error("Write your review before submitting.");
      valid = false;
    }

    if (!valid) {
      return;
    }

    Meteor.call('plugin/review', reviewData, (err, result) => {
      if (err) {
        console.log(err);
        toastr.error("Failed to save the review. Try again.");
        return;
      }

      toastr.success("Review sent successfully.");
      FlowRouter.go(`/plugin/${ plugin.slug }`);
    });
  },
});

Template.reviewPlugin.onCreated(function() {
  this.plugin = new ReactiveVar(false);
  this.isLoaded = new ReactiveVar(false);
  this.review = new ReactiveVar(false);
  this.hoverRating = new ReactiveVar(0);

  if (!Meteor.userId()) {
    const pluginId = FlowRouter.getParam('pluginId');
    toastr.error("You need to be logged in to write a review.");
    FlowRouter.go(`/plugin/${ pluginId }`);
    return;
  }

  refreshData(this);
});