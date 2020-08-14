import './editPlugin.html';
import { _ } from 'meteor/underscore';
import toastr from 'toastr';
import { Session } from 'meteor/session';
import createDOMPurify from 'dompurify';

const DOMPurify = createDOMPurify(window);
const sanitize = (text) => {
  if (text) {
    return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
  }
  return text;
}

const updateHelp = _.debounce((instance) => {
  const help = sanitize($('#pluginHelp').val());

  instance.helpPreview.set(help);
}, 300);


const getPlugin = () => {
  return Template.instance().plugin.get();
};

const refreshData = (instance) => {
  const pluginId = FlowRouter.getParam('pluginId');

  Meteor.call('plugin/details', pluginId, (err, data) => {
    instance.isLoaded.set(true);

    if (err) {
      toastr.error("Failed to load plugin data.");
      console.log(err);
      return;
    }

    if (data.userId !== Meteor.userId()) {
      toastr.error("You can't edit someone else's plugin.");
      FlowRouter.go(`/plugin/${ pluginId }`);
      return;
    }

    Session.set('pageTitle', `Edit Details - ${ data.name }`);
    instance.plugin.set(data);
    instance.helpPreview.set(sanitize(data.help));
  });
};

Template.editPlugin.helpers({
  isLoaded() {
    return Template.instance().isLoaded.get();
  },
  helpPreview() {
    return Template.instance().helpPreview.get();
  },
  plugin() {
    return getPlugin();
  },
  isDraft() {
    const plugin = getPlugin();
    return !plugin.public;
  }
});

Template.editPlugin.events({
  'input #pluginHelp'(e, instance) {
    updateHelp(instance);
  },

  'click .cancel'(e, instance) {
    const pluginId = FlowRouter.getParam('pluginId');
    FlowRouter.go(`/plugin/${ pluginId }`);
  },

  'click .submit'(e, instance) {
    e.preventDefault();

    const oldPlugin = getPlugin();
    const pluginId = oldPlugin._id;
    const name = $('#pluginName').val();
    const description = $('#pluginDescription').val();

    const public = $('#pluginPublic').is(':checked');
    const help = $('#pluginHelp').val();

    const pluginData = {
      _id: pluginId,
      name,
      description,
      public,
      help,
    };

    let valid = true;
    if (!name) {
      toastr.error("The name field is required.");
      valid = false;
    } else if (name.trim().length > 60) {
      toastr.error("The plugin name is too large.");
      valid = false;
    }

    if (description && description.trim().length > 255) {
      toastr.error("The plugin summary is too large.");
      valid = false;
    }

    if (!valid) {
      return;
    }

    Meteor.call('plugin/edit', pluginData, (err, result) => {
      if (err) {
        console.log(err);
        toastr.error("Failed to save the plugin, review the data and try again.");
        return;
      }

      toastr.success("Plugin updated successfully.");
      FlowRouter.go(`/plugin/${ oldPlugin.slug }`);
    });
  },
});

Template.editPlugin.onCreated(function() {
  this.helpPreview = new ReactiveVar('');
  this.plugin = new ReactiveVar(false);
  this.isLoaded = new ReactiveVar(false);

  if (!Meteor.userId()) {
    const pluginId = FlowRouter.getParam('pluginId');
    toastr.error("You need to be logged in to edit a plugin.");
    FlowRouter.go(`/plugin/${ pluginId }`);
    return;
  }

  refreshData(this);
});