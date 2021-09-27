<template>

<div class="cell" :style="style"></div>

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

      return this.boat ? { background: 'rgb(' + hash.hash3 ( this.boat / 13 ) .map ( e => Math.max ( 100, e * 256 | 0 ) ) + ')' } : {}

    }

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

.cell:hover
  border: 1px solid blue

</style>
