import Users from '../models/Users';

Accounts.onCreateUser((options, user) => {
  if (user.services?.github) {
    user.name = user.services.github.username;
    user.emails = user.services.github.emails;
  }

  // If there's no admin in the collection yet, set this user as admin
  if (Users.countAdmins() === 0) {
    user.admin = true;
  }

  return user;
});

// Deny all client-side updates to user documents
Meteor.users.deny({
  update() { return true; }
});