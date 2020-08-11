Accounts.onCreateUser((options, user) => {
  if (user.services?.github) {
    user.name = user.services.github.username;
    user.emails = user.services.github.emails;
  }

  return user;
});

// Deny all client-side updates to user documents
Meteor.users.deny({
  update() { return true; }
});