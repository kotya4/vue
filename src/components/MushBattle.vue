<template>


<div class="main">
  <div class="header">mushroom sea battle</div>
  <div class="wrapper">
    <Field class="field" :w="10" :h="10" owner="human" @status="parse_status" />
    <Field class="field" :w="10" :h="10" owner="computer" />
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
      statuscls: null
    }
  },
  methods: {

    parse_status ( status ) {

      const set = ( v, err=true ) => {
        this.status = v
        this.statuscls = err ? 'status--err' : null
      }

      if      ( status === -1 ) set ( 'T-boat is not allowed' )
      else if ( status === -2 ) set ( 'T-boat is not allowed' )
      else if ( status === -3 ) set ( 'cornered boat is not allowed' )
      else if ( status === -4 ) set ( 'boat cannot be too big' )
      else if ( status === -5 ) set ( 'too many boats placed' )
      else set ( 'Game will start when all boats are placed', false )

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

</style>
