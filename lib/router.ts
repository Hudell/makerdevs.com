import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Session } from 'meteor/session';

const useTemplate = (templateName, pageTitle, breadcrumbs = []) => {
  console.log('use Template');
  Session.set('pageTitle', pageTitle);
  Session.set('breadcrumbs', breadcrumbs);
  return BlazeLayout.render('contentWrapper', {
    main: templateName,
  });
};

FlowRouter.route('/', {
  async action(params, queryParams) {
    await import('../client/templates/latestPlugins/latestPlugins');
    Meteor.SubsCache.subscribe('latestPlugins');

    useTemplate('latestPlugins', 'Latest Plugins');
  }
});

FlowRouter.route('/home', {
  async action(params, queryParams) {
    await import('../client/templates/latestPlugins/latestPlugins');
    Meteor.SubsCache.subscribe('latestPlugins');

    useTemplate('latestPlugins', 'Latest Plugins');
  }
});

FlowRouter.route('/about', {
  async action(params, queryParams) {
    await import('../client/templates/about/about');

    useTemplate('about', 'About');
  }
});

FlowRouter.route('/latest', {
  async action(params, queryParams) {
    await import('../client/templates/latestPlugins/latestPlugins');
    Meteor.SubsCache.subscribe('latestPlugins');

    useTemplate('latestPlugins', 'Latest Plugins');
  }
});

FlowRouter.route('/mv/master-list', {
  async action(params, queryParams) {
    await import('../client/templates/masterList/masterListLite');
    Meteor.SubsCache.subscribe('plugins');
    // Meteor.subscribe('plugins');

    Session.set('masterListPlatform', 'mv');
    useTemplate('masterListLite', 'MV Plugins Master List');
  }
});

FlowRouter.route('/mz/master-list', {
  async action(params, queryParams) {
    await import('../client/templates/masterList/masterListLite');
    Meteor.SubsCache.subscribe('plugins');

    Session.set('masterListPlatform', 'mz');
    useTemplate('masterListLite', 'MZ Plugins Master List');
  }
});

FlowRouter.route('/plugin/:pluginId', {
  async action(params, queryParams) {
    await import('../client/templates/plugin/pluginPage');
    useTemplate('pluginPage', 'Plugin');
  }
});

FlowRouter.route('/mvplugin/:importedId', {
  async action(params, queryParams) {
    await import('../client/templates/plugin/pluginPage');
    useTemplate('pluginPage', 'Plugin');
  }
});