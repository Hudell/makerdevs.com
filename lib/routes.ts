import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Session } from 'meteor/session';
import toastr from 'toastr';

let lastTemplate: String = '';
const templatesToReset = [
  'profile',
];

const useTemplate = (templateName: string, pageTitle: string, breadcrumbs: Array<String> = []) => {
  Session.set('pageTitle', pageTitle);
  Session.set('breadcrumbs', breadcrumbs);
  if (templateName === lastTemplate && templatesToReset.includes(templateName)) {
    BlazeLayout.reset();
  }

  lastTemplate = templateName;
  return BlazeLayout.render('contentWrapper', {
    main: templateName,
  });
};

FlowRouter.route('/', {
  async action() {
    await import('../client/templates/latestPlugins/latestPlugins');

    useTemplate('latestPlugins', 'Latest Plugins');
  }
});

FlowRouter.route('/login', {
  async action() {
    if (Meteor.userId()) {
      toastr.error("You are already logged in.");
      FlowRouter.go('/home');
      return;
    }

    Meteor.SubsCache.subscribe('services');

    await import('../client/templates/login/login');
    useTemplate('login', 'Login');
  }
});

FlowRouter.route('/register', {
  async action() {
    if (Meteor.userId()) {
      toastr.error("You are already logged in.");
      FlowRouter.go('/home');
      return;
    }

    Meteor.SubsCache.subscribe('services');

    await import('../client/templates/user/register');
    useTemplate('register', 'User Registration');
  }
});

FlowRouter.route('/password-reset', {
  async action() {
    if (Meteor.userId()) {
      toastr.error("You are logged in.");
      FlowRouter.go('/home');
      return;
    }
    await import('../client/templates/user/resetPassword');
    useTemplate('resetPassword', 'Reset my password');
  }
});

FlowRouter.route('/reset-password/:token', {
  async action(params : any) {
    const { token } = params;
    Session.set('resetPasswordToken', token);
    await import('../client/templates/user/resetPasswordForm');
    useTemplate('resetPasswordForm', 'Reset Account password');
  }
});

FlowRouter.route('/logout', {
  async action() {
    Meteor.logout(function() {
      FlowRouter.go('/home');
    });
  }
});

FlowRouter.route('/home', {
  async action() {
    await import('../client/templates/latestPlugins/latestPlugins');

    useTemplate('latestPlugins', 'Latest Plugins');
  }
});

FlowRouter.route('/me', {
  async action() {
    if (!Meteor.userId()) {
      toastr.error("You need to be logged in to see your profile.");
      FlowRouter.go('/login');
      return;
    }

    Session.set('profileUserId', Meteor.userId());
    await import('../client/templates/profile/profile');
    useTemplate('profile', 'My Profile');
  }
});

FlowRouter.route('/about', {
  async action() {
    await import('../client/templates/about/about');

    useTemplate('about', 'About');
  }
});

FlowRouter.route('/latest', {
  async action() {
    await import('../client/templates/latestPlugins/latestPlugins');

    useTemplate('latestPlugins', 'Latest Plugins');
  }
});

FlowRouter.route('/profile/:userId', {
  async action(params: { userId: string }) {
    await import('../client/templates/profile/profile');

    Session.set('profileUserId', params.userId);
    useTemplate('profile', 'User Profile');
  }
});

FlowRouter.route('/user/edit/:userId', {
  async action(params: { userId: string }) {
    await import('../client/templates/profile/editProfile');

    useTemplate('editProfile', 'Edit Profile');
  }
});

FlowRouter.route('/mv/master-list', {
  async action() {
    await import('../client/templates/masterList/masterListLite');

    if (lastTemplate === 'masterListLite' && Session.get('masterListPlatform') !== 'mv') {
      BlazeLayout.reset();
    }

    Session.set('masterListPlatform', 'mv');
    useTemplate('masterListLite', 'MV Plugins Master List');
  }
});

FlowRouter.route('/mz/master-list', {
  async action() {
    await import('../client/templates/masterList/masterListLite');

    if (lastTemplate === 'masterListLite' && Session.get('masterListPlatform') !== 'mz') {
      BlazeLayout.reset();
    }

    Session.set('masterListPlatform', 'mz');
    useTemplate('masterListLite', 'MZ Plugins Master List');
  }
});

FlowRouter.route('/plugin/submit', {
  async action() {
    if (!Meteor.userId()) {
      toastr.error("You need to be logged in to submit a plugin.");
      FlowRouter.go('/login');
      return;
    }

    await import('../client/templates/plugin/submitPlugin');
    useTemplate('submitPlugin', 'Submit Plugin');
  }
});

FlowRouter.route('/plugin/:pluginId', {
  async action() {
    await import('../client/templates/plugin/pluginPage');
    useTemplate('pluginPage', 'Plugin');
  }
});

FlowRouter.route('/platform/:platformCode', {
  async action(params: { platformCode: 'string'}) {
    // For now, just redirect to the plugin masterlist
    FlowRouter.go(`/${ params.platformCode }/master-list`);
  }
});

FlowRouter.route('/plugin/edit/:pluginId', {
  async action() {
    await import('../client/templates/plugin/editPlugin');
    useTemplate('editPlugin', 'Edit Plugin');
  }
});

FlowRouter.route('/plugin/newFile/:pluginId', {
  async action() {
    await import('../client/templates/plugin/sendFile');
    useTemplate('sendFile', 'Send New File');
  }
});

FlowRouter.route('/plugin/review/:pluginId', {
  async action() {
    await import('../client/templates/plugin/reviewPlugin');
    useTemplate('reviewPlugin', 'Review Plugin');
  }
});


FlowRouter.route('/search/:query', {
  async action(params: { query: string | undefined }) {
    await import('../client/templates/search/results');

    useTemplate('searchResults', `Searching for "${ params.query }"`);
  }
});

FlowRouter.route('/search', {
  async action() {
    FlowRouter.go('/home');
  }
});

FlowRouter.route('/mvplugin/:importedId', {
  async action() {
    await import('../client/templates/plugin/pluginPage');
    useTemplate('pluginPage', 'Plugin');
  }
});

FlowRouter.route('/admin/services', {
  async action() {
    const user = Meteor.user();
    if (!user || !user.admin) {
      FlowRouter.go('/home');
      return;
    }

    await import('../client/templates/admin/loginServices');
    useTemplate('loginServices', 'Login Services');
  }
});

FlowRouter.route('/admin/import', {
  async action() {
    const user = Meteor.user();
    if (!user || !user.admin) {
      FlowRouter.go('/home');
      return;
    }

    await import('../client/templates/admin/import');
    useTemplate('import', 'Import');
  }
});

FlowRouter.notFound = {
  async action() {
    await import('../client/templates/404/404');
    useTemplate('404', 'Not Found');
  }
};
