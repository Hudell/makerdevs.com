import toastr from 'toastr';
import { Session } from 'meteor/session';

import MvMasterList from '../../../models/client/MvMasterList';
import MzMasterList from '../../../models/client/MzMasterList';

import './masterListLite.html';
import '../plugin/pluginLiteCard';

const getPlatform = () => {
  return Session.get('masterListPlatform') || 'mz';
};

Template.masterListLite.helpers({
  headers() {
    return Template.instance().headers.get();
  },

  symbolPlugins(symbol) {
    const plugins = Template.instance().plugins.get();
    const rgx = new RegExp(symbol === '#' ? '^[^a-zA-Z]' : `^${ symbol }`, 'i');

    return plugins.filter(plugin => plugin.name.match(rgx));
  },

  plugins() {
    return Template.instance().plugins.get();
  },

  isReady() {
    return Template.instance().isLoaded.get();
  },
});

Template.masterListLite.onCreated(function() {
  this.isLoaded = new ReactiveVar(false);
  this.plugins = new ReactiveVar([]);
  this.headers = new ReactiveVar([]);

  const platformCode = getPlatform();

  Meteor.call('plugin/list', platformCode, (err, result) => {
    if (err) {
      console.log(err);
      toastr.error("Failed to load plugin list.");
      return;
    }

    const headers = [];

    if (result) {
      const rgx = /^[^a-zA-Z]/i;

      const headerCounts = {};
      for (const plugin of result) {
        let symbol;
        if (plugin.name.match(rgx)) {
          symbol = '#';
        } else {
          symbol = plugin.name[0].toUpperCase();
        }

        if (!headerCounts[symbol]) {
          headerCounts[symbol] = 0;
        }
        headerCounts[symbol]++;
      }

      for (const symbol in headerCounts) {
        headers.push({
          symbol,
          count: headerCounts[symbol],
        });
      }
    }

    this.headers.set(headers);
    this.plugins.set(result);
    this.isLoaded.set(true);
  });
});