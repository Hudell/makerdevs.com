import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Session } from 'meteor/session';

const useTemplate = (templateName, pageTitle, breadcrumbs = []) => {
  Session.set('pageTitle', pageTitle);
  Session.set('breadcrumbs', breadcrumbs);
  return BlazeLayout.render('contentWrapper', {
    main: templateName,
  });
};

FlowRouter.route('/', {
  async action() {
    await import('../client/templates/latestPlugins/latestPlugins');
    Meteor.SubsCache.subscribe('latestPlugins');

    useTemplate('latestPlugins', 'Latest Plugins');
  }
});

FlowRouter.route('/login', {
  async action() {
    if (Meteor.userId()) {
      FlowRouter.go('/home');
      return;
    }

    await import('../client/templates/login/login');
    useTemplate('login', 'Login');
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
    Meteor.SubsCache.subscribe('latestPlugins');

    useTemplate('latestPlugins', 'Latest Plugins');
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
    Meteor.SubsCache.subscribe('latestPlugins');

    useTemplate('latestPlugins', 'Latest Plugins');
  }
});

FlowRouter.route('/profile/:username', {
  async action(params) {
    await import('../client/templates/profile/profile');

    useTemplate('profile', 'User Profile');
  }
});

FlowRouter.route('/mv/master-list', {
  async action() {
    await import('../client/templates/masterList/masterListLite');
    Meteor.SubsCache.subscribe('plugins');
    // Meteor.subscribe('plugins');

    Session.set('masterListPlatform', 'mv');
    useTemplate('masterListLite', 'MV Plugins Master List');
  }
});

FlowRouter.route('/mz/master-list', {
  async action() {
    await import('../client/templates/masterList/masterListLite');
    Meteor.SubsCache.subscribe('plugins');

    Session.set('masterListPlatform', 'mz');
    useTemplate('masterListLite', 'MZ Plugins Master List');
  }
});

FlowRouter.route('/plugin/:pluginId', {
  async action() {
    await import('../client/templates/plugin/pluginPage');
    useTemplate('pluginPage', 'Plugin');
  }
});

FlowRouter.route('/mvplugin/:importedId', {
  async action() {
    await import('../client/templates/plugin/pluginPage');
    useTemplate('pluginPage', 'Plugin');
  }
});

FlowRouter.notFound = {
  async action() {
    await import('../client/templates/404/404');
    useTemplate('404', 'Not Found');
  }
};
