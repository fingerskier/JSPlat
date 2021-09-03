const manual_keys = {
  EVENT: {
    STAR_COLLECTED: 'STAR_COLLECTED',
  },
  
  IMG: {
    PENGUIN: 'IMG-PENGUIN',
    TILES: 'IMG-TILES',
    STAR: 'IMG-STAR',
  },
  
  LAYER: {
    GROUND: 'ground',
    OBJECTS: 'objects',
    OBSTACLES: 'obstacles',
  },
  
  OBJECT: {
    BOMB: 'BOMB',
    SPIKES: 'spikes',
    STAR: 'star',
    TYPE: 'TYPE',
  },

  PLAYER: {
    IDLE: 'PLAYER-IDLE',
    JUMP: 'PLAYER-JUMP',
    WALK: 'PLAYER-WALK',
    STATE: {
      IDLE: 'PLAYER-STATE-IDLE',
      JUMP: 'PLAYER-STATE-JUMP',
      SPIKE_HIT: 'PLAYER-STATE-SPIKE_HIT',
      WALK: 'PLAYER-STATE-WALK',
    }
  },

  SCENE: {
    GAME: 'GAME_SCENE',
    ONE: 'SCENE1',
    TWO: 'SCENE2', 
    THREE: 'SCENE3',
    UI: 'SCENE-UI',
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