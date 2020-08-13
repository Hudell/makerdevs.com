import { Session } from 'meteor/session';

import MvMasterList from '../../../models/client/MvMasterList';
import MzMasterList from '../../../models/client/MzMasterList';

import './masterListLite.html';
import '../plugin/pluginLiteCard';

const getPlatform = () => {
  return Session.get('masterListPlatform') || 'mv';
};

const getModel = () => {
  const platform = getPlatform();

  if (platform === 'mv') {
    return MvMasterList;
  }

  return MzMasterList;
}

const getAllPlugins = (symbol = '') => {
  const model = getModel();

  return model.findAllBySymbol(symbol);
};

const possibleHeaders = ['#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
Template.masterListLite.helpers({
  headers() {
    const model = getModel();
    const headers = [];

    for (const symbol of possibleHeaders) {
      if (model.hasAnyPluginWithSymbol(symbol)) {
        headers.push(symbol);
      }
    }

    return headers;
  },

  symbolPlugins(symbol) {
    return getAllPlugins(symbol);
  },

  plugins() {
    return getAllPlugins();
  },

  isReady() {
    return Meteor.SubsCache.ready();
  },
});
