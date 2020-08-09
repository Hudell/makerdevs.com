const fields = {
  name: 1,
  emails: 1,
};

Meteor.publish("userData", function () {
  return Meteor.users.find({_id: this.userId}, { fields });
});

Meteor.publish("allUserData", function () {
  return Meteor.users.find({}, { fields });
});