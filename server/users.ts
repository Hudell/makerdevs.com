Accounts.onCreateUser((options, user) => {
  console.log(user);

  if (options.profile) {
    user.profile = options.profile;
  }

  if (user.services?.github) {
    user.username = user.services.github.username;
  }

  return user;
});