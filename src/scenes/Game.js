import KEY from '../Keys'
import ObstaclesController from './ObstaclesController';
import Phaser from 'phaser'
import PlayerController from "./PlayerController";


export default class Game extends Phaser.Scene {
  cursors = Phaser.Input.Keyboard.CursorKeys

  penguin = Phaser.Physics.Matter.Sprite

  isTouchingGround = false

  playerController = {}


  constructor() {
    super(KEY.SCENE.GAME)
  }


  init() {
    this.cursors = this.input.keyboard.createCursorKeys()
    this.obstacles = new ObstaclesController()
  }


  preload() {
    this.load.atlas(KEY.IMG.PENGUIN, 'assets/penguin/penguin.png', 'assets/penguin/penguin.json')

    this.load.image(KEY.TILES, 'assets/sheet.png')
    this.load.tilemapTiledJSON(KEY.TILEMAP, 'assets/game_tiled.json')

    this.load.image(KEY.IMG.STAR, 'assets/star.png')
  }


  create() {
    this.scene.launch(KEY.SCENE.UI)
    

    const map = this.make.tilemap({key: KEY.TILEMAP})
    const tileset = map.addTilesetImage('iceworld', KEY.TILES)

    const ground = map.createLayer(KEY.LAYER.GROUND, tileset)
    const obstacles = map.createLayer(KEY.LAYER.OBSTACLES, tileset)

    ground.setCollisionByProperty({collides: true})

    this.cameras.main.scrollY = 400


    const objectsLayer = map.getObjectLayer(KEY.LAYER.OBJECTS)

    objectsLayer.objects.forEach(obj=>{
      const {name, x=0, y=0, width=0, height=0} = obj

      switch(name) {
        case 'penguin-spawn': {
          this.penguin = this.matter.add.sprite(x + (0.5*width), y, KEY.IMG.PENGUIN)
          .play(KEY.PLAYER.WALK)
          .setFixedRotation()

          this.playerController = new PlayerController(this, this.penguin, this.cursors, this.obstacles)
        }
        break
        
        case KEY.OBJECT.STAR: {
          const star = this.matter.add.sprite(x, y, KEY.IMG.STAR, undefined, {
            isSensor: true,
            isStatic: true,
          })

          star.setData(KEY.OBJECT.TYPE, KEY.OBJECT.STAR)
        }
        break

        case KEY.OBJECT.SPIKES: {
          const spike = this.matter.add.rectangle(x+(0.5*width), y+(0.5*height), width, height, {
            isStatic: true,
          })

          this.obstacles.add(KEY.OBJECT.SPIKES, spike)
        }
        break
      }
    })


    this.cameras.main.startFollow(this.penguin)

    this.matter.world.convertTilemapLayer(ground)
  }


  update(t, dt) {
    if (!this.playerController) return

    this.playerController.update(dt)
  }
}