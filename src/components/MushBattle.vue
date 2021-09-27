<template>


<div class="main">
  <div class="header">mushroom sea battle</div>
  <div class="wrapper">
    <Field class="field" :w="10" :h="10" owner="human" @status="parse_status" :state="state" />
    <Field class="field" :w="10" :h="10" owner="computer" @status="parse_status" :state="state" />
  </div>
  <div :class="statuscls">{{ status }}</div>
</div>

</template>



<script>
import Field from './Field.vue'
export default {
  name: 'MushBattle',
  components: {
    Field
  },
  data () {
    return {
      status: 'Game will start when all boats are placed',
      statuscls: null,
      state: 'placing'
    }
  },
  methods: {

    parse_status ( status ) {

      const set = ( status, state, statuscls=null ) => {
        this.status = status
        this.state = state
        this.statuscls = statuscls
      }

      if ( status ===  0 ) return set ( 'Game will start when all boats are placed', 'placing' )
      if ( status ===  1 ) return set ( 'Game started, your turn! Blow up enemy boats to win.', 'blowing' )
      if ( status ===  2 ) return set ( 'You missed... Wait for enemy turn', 'waiting' )
      if ( status ===  3 ) return set ( 'You hit! Try one more time', 'blowing' )
      if ( status ===  4 ) return set ( 'Congratulations! You win!', 'gameover', 'status--good' )

      if ( status === -1 ) return set ( 'you cannot place boat there', 'placing', 'status--err' )
      if ( status === -2 ) return set ( 'you cannot place boat there', 'placing', 'status--err' )
      if ( status === -3 ) return set ( 'you cannot place boat there', 'placing', 'status--err' )
      if ( status === -4 ) return set ( 'you cannot place boat there', 'placing', 'status--err' )
      if ( status === -5 ) return set ( 'too many boats placed', 'placing', 'status--err' )
      if ( status === -6 ) return set ( 'you already blowed up this cell, try another', 'blowing', 'status--err' )

      return set ( '???', '???', 'status--err' )

    }

  }
}
</script>



<style scoped lang="sass">

.splitter
  width: 4em
  height: 4em

.main
  width: 100vw
  height: 100vh
  display: flex
  justify-content: center
  align-items: center
  flex-direction: column

.wrapper
  display: flex
  justify-content: center
  align-items: center


@media (max-aspect-ratio: 1/1)
  .wrapper
    flex-direction: column

.header
  position: absolute
  left: 1em
  top: 0

.field
  margin: 2em

.status
  &--err
    color: red
  &--good
    color: blue

</style>
