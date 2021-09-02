

function StateMachine() {
  const O = {}
  const S = new StateMachine(O)

  S.addState({
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

  S.addState({
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

  S.addState({
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

  console.log('stater', O, S)
}