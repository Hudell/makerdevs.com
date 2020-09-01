const fields = {
  name: 1,
  admin: 1,
  website: 1,
  donationUrl: 1,
  _createdAt: 1,
  slug: 1,
};

Meteor.publish("userData", function () {
  return Meteor.users.find({_id: this.userId}, { fields });
});

Meteor.publish("allUserData", function () {
  return Meteor.users.find({}, { fields });
});