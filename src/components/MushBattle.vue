<template>


<div class="main">
  <a class="header" href="https://github.com/sluchaynayakotya/vuekaef">sea battle</a>
  <div class="wrapper">
    <Field class="field" :w="10" :h="10" owner="human" @push_state="push_state" :state="state" />
    <Field class="field" :w="10" :h="10" owner="computer" @push_state="push_state" :state="state" />
  </div>
  <div :class="state_cls">{{ state_str }}</div>
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
      state: 'user:placing',
      state_str: 'Game will start when all boats are placed',
      state_cls: null,
    }
  },
  methods: {

    push_state ( state_int ) {

      const set = ( state, state_str, state_cls ) => {
        this.state = state
        this.state_str = state_str
        this.state_cls = state_cls
      }

      if ( state_int ===  0 ) return set ( 'user:placing',   'Game starts when all boats are placed', null )
      if ( state_int ===  1 ) return set ( 'user:hiting',    'Game started, your turn! Blow up enemy boats to win', null )
      if ( state_int ===  2 ) return set ( 'enemy:hiting',   'You miss... Wait for enemy', null )
      if ( state_int ===  3 ) return set ( 'user:hiting',    'You hit! Try one more', null )
      if ( state_int ===  4 ) return set ( 'game:over',      'Congratulations! You win!', 'state--good' )
      if ( state_int ===  5 ) return set ( 'enemy:continue', 'Enemy hits! Wait for enemy', null )
      if ( state_int ===  6 ) return set ( 'user:hiting',    'Enemy misses... Your turn!', null )
      if ( state_int ===  7 ) return set ( 'game:over',      'Enemy wins!', 'state--bad' )
      if ( state_int ===  8 ) return set ( 'enemy:hiting',   'Enemy hits! Wait for enemy', null )

      if ( state_int === -1 ) return set ( 'user:placing',   'you cannot place boat there', 'state--err' )
      if ( state_int === -2 ) return set ( 'user:placing',   'you cannot place boat there', 'state--err' )
      if ( state_int === -3 ) return set ( 'user:placing',   'you cannot place boat there', 'state--err' )
      if ( state_int === -4 ) return set ( 'user:placing',   'you cannot place boat there', 'state--err' )
      if ( state_int === -5 ) return set ( 'user:placing',   'too many boats placed', 'state--err' )
      if ( state_int === -6 ) return set ( 'user:hiting',    'you are already hit this cell, try another', 'state--err' )
      if ( state_int === -7 ) return set ( 'game:???',       'enemy cannot find empty cell while boats are still exist', 'state--err' )
      if ( state_int === -8 ) return set ( 'game:???',       'enemy hit hitted cell', 'state--err' )

      return set ( 'game:???', '???', 'state--err' )

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
  right: 1em
  top: 0

.field
  margin: 2em

.state
  &--err
    color: red
  &--good
    color: blue
  &--bad
    color: pink

</style>
