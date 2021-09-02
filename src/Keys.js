const manual_keys = {
  BOMB: 'BOMB',

  IMG: {
    PENGUIN: 'IMG-PENGUIN',
    TILES: 'IMG-TILES',
  },

  LAYER: {
    GROUND: 'ground',
    OBJECTS: 'objects',
  },

  PLAYER: {
    IDLE: 'PLAYER-IDLE',
    JUMP: 'PLAYER-JUMP',
    WALK: 'PLAYER-WALK',
    STATE: {
      IDLE: 'PLAYER-STATE-IDLE',
      JUMP: 'PLAYER-STATE-JUMP',
      WALK: 'PLAYER-STATE-WALK',
    }
  },

  SCENE: {
    ONE: 'SCENE1',
    TWO: 'SCENE2', 
    THREE: 'SCENE3',
    GAME: 'GAME_SCENE',
  },

  SWEEP_SOUND: 'SWEEP_SOUND',

  TILEMAP: 'TILEMAP',
  TILES: 'TILES',
  TILESET: 'iceworld',
}


// const KeyProxy = {
//   get: (target, property, receiver)=>{
//     if (!target[property]) {
//       // if the property doesn't exist then we create it as a new object proxy
//       target[property] = new Proxy({}, KeyProxy)
//     }

//     console.log(target, property, receiver)


//     // the result is a string of the property and all parent keys concatenated
//     const result = property

//     return result
//   }
// }


// const P = new Proxy({}, KeyProxy)


export default manual_keys