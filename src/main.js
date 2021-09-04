import './lib/mqttws31.min.js'
import Phaser from 'phaser';
import gameConfig from './gameConfig.js';


import testInit from './test/test'
window.testInit = testInit


let game;


function destroyGame () {
  if (!game) return;
  game.destroy(true);
  game.runDestroy();
  game = null;
}


function newGame () {
  if (game) return;
  game = new Phaser.Game(gameConfig);
}



if ('serviceWorker' in navigator) {
  const serviceWorker = './service-worker.js'

  window.addEventListener('load', function() {
    /*
      To enable caching for offline mode uncomment the following line
    */
    // navigator.serviceWorker.register(serviceWorker);
  });
}


if (module.hot) {
  module.hot.dispose(destroyGame);
  module.hot.accept(newGame);
}


if (!game) newGame();