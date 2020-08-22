import './creatorCard.html';
import { Platforms } from '../../../data/Platforms';

Template.creatorCard.helpers({
  icons() {
    const platformIcons = [];
    for (const platformCode of this.platforms) {
      if (!platformIcons.includes(platformCode)) {
        platformIcons.push(platformCode);
      }
    }
    return platformIcons.map((code) => {
      const data = Platforms[code];
      return {
        code,
        name: data?.name || 'Unknown Platform',
        src: data?.icon || `/icons/platforms/${i}.png`,
      };
    })
  }
});
