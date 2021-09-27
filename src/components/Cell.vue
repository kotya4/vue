<template>

<div class="cell" :style="style" :class="{ 'cell--crossed': boat < 0 }"></div>

</template>




<script>
import hash from '../common/hash.js'
export default {
  name: 'Cell',
  props: {
    boat: Number
  },
  computed: {

    style () {

      return this.boat > 0 ? { background: 'rgb(' + hash.hash3 ( this.boat / 13 ) .map ( e => Math.max ( 100, e * 256 | 0 ) ) + ')' } : {}

    },

  }
}
</script>




<style scoped lang="sass">

.cell
  width: 1em
  height: 1em
  border: 1px dotted black
  border-radius: 2px
  margin: 1px
  position: relative

  &:hover
    border: 1px solid blue

  &--crossed

    &:before, &:after
      position: absolute
      left: 0.5em
      content: ' '
      height: 1em
      width: 1px
      background: black

    &:before
      transform: rotate( 45deg )

    &:after
      transform: rotate( -45deg )


</style>
