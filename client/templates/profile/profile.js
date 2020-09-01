import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

import toastr from 'toastr';

import Plugins from '../../../models/Plugins';
import { Modal } from '../../utils/modal';

import './profile.html';

const getUser = () => {
  return Template.instance().user.get();
};

const getUserId = () => {
  const sessionId = Session.get('profileUserId');
  if (sessionId) {
    return sessionId;
  }

  const userId = FlowRouter.getParam('userId');
  if (!userId || userId.toLowerCase() === 'me') {
    return Meteor.userId();
  }

  return userId;
};

const refreshData = (instance) => {
  const userId = getUserId();

  if (!userId) {
    FlowRouter.go('/home');
    toastr.error("Invalid User");
    return;
  }

  Meteor.call('user/details', userId, (err, data) => {
    instance.isLoaded.set(true);

    if (err) {
      toastr.error("Failed to load profile data.");
      console.log(err);
      return;
    }

    if (!data) {
      instance.isInvalid.set(true);
      Session.set('pageTitle', 'Invalid User Id');
      return;
    }

    Session.set('pageTitle', `Profile - ${ data.name }`);
    instance.user.set(data);
  });
};

const checkReaction = (reactionId) => {
  const user = getUser();

  return user?.reactions && user.reactions[reactionId]?.includes(Meteor.userId());
};

Template.profile.helpers({
  user() {
    return getUser();
  },
  isLoaded() {
    return Template.instance().isLoaded.get();
  },
  isValid() {
    return !Template.instance().isInvalid.get();
  },
  liked() {
    return checkReaction('like');
  },
  canEdit() {
    const userId = Meteor.userId();
    if (!userId) {
      return false;
    }

    const user = getUser();
    if (userId == user._id) {
      return true;
    }

    return false;
  },
  likeCount() {
    const user = getUser();
    return user.reactions?.like?.length;
  },
  singleLike() {
    const user = getUser();
    return user.reactions?.like?.length === 1;
  },
});

Template.profile.events({
  'click .like-btn'(e, instance) {
    const userId = getUserId();
    Meteor.call('user/like', userId, () => {
      refreshData(instance);
    });
  },
  'click .donate-btn'(e, instance) {
    const user = getUser();
    if (!user.donationUrl) {
      toastr.info('This user has no donation info.');
      return;
    }

    window.open(user.donationUrl);
  },
  'click .edit-btn'(e, instance) {
    const userId = getUserId();
    FlowRouter.go(`/user/edit/${ userId }`);
  },
  'click .change-password-btn'(e, instance) {
    const userId = getUserId();
    FlowRouter.go(`/user/password/${ userId }`);
  },
});

Template.profile.onCreated(function() {
  this.user = new ReactiveVar(false);
  this.isLoaded = new ReactiveVar(false);
  this.isInvalid = new ReactiveVar(false);

  refreshData(this);
});
