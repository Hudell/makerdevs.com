import './editProfile.html';

import { _ } from 'meteor/underscore';
import toastr from 'toastr';
import { Session } from 'meteor/session';

const updateAbout = _.debounce((instance) => {
  const about = $('#userAbout').val();

  instance.aboutPreview.set(about);
}, 300);


const getUser = () => {
  return Template.instance().user.get();
};

const refreshData = (instance) => {
  const userId = FlowRouter.getParam('userId');

  Meteor.call('user/details', userId, (err, data) => {
    instance.isLoaded.set(true);

    if (err) {
      toastr.error("Failed to load user data.");
      console.log(err);
      return;
    }

    if (data._id !== Meteor.userId()) {
      toastr.error("You can't edit someone else's profile.");
      FlowRouter.go(`/profile/${ data.slug || data._id }`);
      return;
    }

    Session.set('pageTitle', `Edit Profile - ${ data.name }`);
    instance.user.set(data);
    instance.aboutPreview.set(data.about);
  });
};

Template.editProfile.helpers({
  isLoaded() {
    return Template.instance().isLoaded.get();
  },
  aboutPreview() {
    return Template.instance().aboutPreview.get();
  },
  user() {
    return getUser();
  }
});

Template.editProfile.events({
  'input #userAbout'(e, instance) {
    updateAbout(instance);
  },

  'click .cancel'(e, instance) {
    const userId = FlowRouter.getParam('userId');
    FlowRouter.go(`/profile/${ userId }`);
  },

  'click .submit'(e, instance) {
    e.preventDefault();

    const user = getUser();
    const userId = user._id;
    const name = $('#userName').val();
    const website = $('#userWebsite').val();

    const about = $('#userAbout').val();

    const userData = {
      _id: userId,
      name,
      website,
      about,
    };

    let valid = true;
    if (!name) {
      toastr.error("The name field is required.");
      valid = false;
    } else if (name.trim().length > 60) {
      toastr.error("The name is too large.");
      valid = false;
    }

    if (website && website.trim().length > 255) {
      toastr.error("The website address is too large.");
      valid = false;
    }

    if (!valid) {
      return;
    }

    Meteor.call('user/edit', userData, (err, result) => {
      if (err) {
        console.log(err);
        toastr.error("Failed to save the profile, review the data and try again.");
        return;
      }

      toastr.success("Profile updated successfully.");
      FlowRouter.go(`/profile/${ user.slug || user._id }`);
    });
  },
});

Template.editProfile.onCreated(function() {
  this.aboutPreview = new ReactiveVar('');
  this.user = new ReactiveVar(false);
  this.isLoaded = new ReactiveVar(false);

  if (!Meteor.userId()) {
    const userId = FlowRouter.getParam('userId');
    toastr.error("You need to be logged in to edit your profile.");
    FlowRouter.go(`/profile/${ userId }`);
    return;
  }

  refreshData(this);
});