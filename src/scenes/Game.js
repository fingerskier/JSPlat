import KEY from '../Keys'
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
  }


  preload() {
    this.load.atlas(KEY.IMG.PENGUIN, 'assets/penguin/penguin.png', 'assets/penguin/penguin.json')

    this.load.image(KEY.TILES, 'assets/sheet.png')
    this.load.tilemapTiledJSON(KEY.TILEMAP, 'assets/game_tiled.json')
  }


  create() {
    const map = this.make.tilemap({key: KEY.TILEMAP})
    const tileset = map.addTilesetImage('iceworld', KEY.TILES)

    const ground = map.createLayer(KEY.LAYER.GROUND, tileset)

    ground.setCollisionByProperty({collides: true})

    this.cameras.main.scrollY = 400


    const {height, width} = this.scale
    

    const objectsLayer = map.getObjectLayer(KEY.LAYER.OBJECTS)

    objectsLayer.objects.forEach(obj=>{
      const {name, x=0, y=0, width} = obj

      switch(name) {
        case 'penguin-spawn': {
          this.penguin = this.matter.add.sprite(x + (0.5*width), y, KEY.IMG.PENGUIN)
          .play(KEY.PLAYER.WALK)
          .setFixedRotation()

          this.playerController = new PlayerController(this.penguin, this.cursors)
          
          this.penguin.setOnCollide(data=>{
            this.isTouchingGround = true
          })      
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