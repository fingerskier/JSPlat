import Phaser from 'phaser';
import Game from "./scenes/Game";
import UI from "./scenes/UI";


export default {
  type: Phaser.AUTO,

  height: 600,
  width: 800,

  title: 'Phaser 3 with Parcel 📦',

  url: 'https://github.com/fingerskier/phaser-boilerplate',

  banner: { text: 'white', background: ['#FD7400', '#FFE11A', '#BEDB39', '#1F8A70', '#004358'] },

  physics: {
		default: 'matter',

    matter: {
      debug: true,
    },
	},

  scene: [Game, UI]
}