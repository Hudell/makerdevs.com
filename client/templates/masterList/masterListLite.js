import { Session } from 'meteor/session';

import Plugins from '../../../models/Plugins';
import './masterListLite.html';
import '../plugin/pluginLiteCard';

const getPlatform = () => {
  return Session.get('masterListPlatform') || 'mv';
};

const getAllPlugins = (symbol = '') => {
  const platform = getPlatform();

  return Plugins.findAllByPlatformAndSymbol(platform, symbol);
};

Template.masterListLite.helpers({
  headers() {
    const platform = getPlatform();
    const possibleHeaders = ['#', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    const headers = [];
    
    for (const symbol of possibleHeaders) {
      if (Plugins.hasAnyPluginWithSymbolOnPlatform(symbol, platform)) {
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
});
