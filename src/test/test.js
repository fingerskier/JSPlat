import FiniteStateMachine from "../lib/FiniteStateMachine.js"


export default function testInit() {
  const O = {}
  const Stater = new FiniteStateMachine(O)

  Stater.verbose = true
  
  Stater
  .addState('one', {
    name: 'one',
    onEnter: ()=>{
      console.log('enter state 1')
    },
    onExit: ()=>{
      console.log('exit state 1')
    },
    onUpdate: ()=>{
      console.log('update state 1')
    },
  })
  .addState('two', {
    name: 'two',
    onEnter: ()=>{
      console.log('enter state 2')
    },
    onExit: ()=>{
      console.log('exit state 2')
    },
    onUpdate: ()=>{
      console.log('update state 2')
    },
  })
  .addState('three', {
    name: 'three',
    onEnter: ()=>{
      console.log('enter state 3')
    },
    onExit: ()=>{
      console.log('exit state 3')
    },
    onUpdate: ()=>{
      console.log('update state 3')
    },
  })

  setInterval(() => {
    Stater.update(25)
  }, 250);

  return Stater
}