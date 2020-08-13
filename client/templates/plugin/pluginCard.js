import './pluginCard.html';
import { Platforms } from '../../../data/Platforms';

Template.pluginCard.helpers({
  displayName() {
    const name = this.name;
    return name;
  },
  icons() {
    const platforms = [];

    for (const version of this.versions) {
      for (const platformCode of version.platforms) {
        if (!platforms.includes(platformCode)) {
          platforms.push(platformCode);
        }
      }
    }
    return platforms.map((code) => {
      const data = Platforms[code];
      return {
        code,
        name: data?.name || 'Unknown Platform',
        src: data?.icon || `/icons/platforms/${i}.png`,
      };
    })
  }
});
