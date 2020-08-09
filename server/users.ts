Accounts.onCreateUser((options, user) => {
  if (user.services?.github) {
    user.name = user.services.github.username;
  }

  if (!user.name) {
    user.name = 'Game Creator';
  }

  return user;
});

// Deny all client-side updates to user documents
Meteor.users.deny({
  update() { return true; }
});