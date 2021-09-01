import Phaser from 'phaser';
import GameScene from "./scenes/GameScene";
import Scene1 from "./scenes/Scene1";
import Scene2 from "./scenes/Scene2";
import Scene3 from "./scenes/Scene3";


export default {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  title: 'Phaser 3 with Parcel 📦',
  url: 'https://github.com/fingerskier/phaser-boilerplate',
  banner: { text: 'white', background: ['#FD7400', '#FFE11A', '#BEDB39', '#1F8A70', '#004358'] },
  physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 300 }
		}
	},
  scene: [Scene1, Scene2, Scene3, GameScene]
};
