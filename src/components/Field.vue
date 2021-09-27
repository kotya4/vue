<template>

<div class="field-wrapper" :class="{ 'field-wrapper--disabled': ! is_human }">

  <div>
    <div class="row" v-for="( row, y ) in map" :key="y">
      <Cell v-for="( boat, x ) in row" :key="x" :boat="boat" @click="() => click( x, y )" />
    </div>
  </div>

  <div class="legend">
    <div class="row" v-for="( num, i ) in boats_left" :key="i">
      <Cell :boat="( i + 1 )" />
      {{ num }}
    </div>
  </div>

</div>


</template>




<script>
import { place_boat } from '../common/seabattle.js'
import Cell from './Cell.vue'
export default {
  name: 'Field',
  components: {
    Cell
  },
  props: {
    w: Number,
    h: Number,
    owner: String,
  },
  emits: [ 'status' ],
  data () {

    // const boats = [ 0, 4, 2, 2, 1 ] // first value must be 0, other values are number of available boats for each boat-length a.k.a index
    const boats = [ 0, 1 ]

    return {

      map: Array ( this.h ) .fill () .map ( () => Array ( this.w ) .fill ( 0 ) ),

      cells: boats.map ( ( e, i ) => e * i ),

      boats,

    }
  },
  computed: {

    is_human () {

      return this.owner === 'human'

    },

    boats_left () {

      return this.cells.slice ( 1 ) .map ( ( e, i ) => e / ( i + 1 ) | 0 )

    }

  },
  methods: {

    click ( x, y ) {

      if ( this.is_human ) {
        // field owner is human

        this.place_boat ( x, y )

      }
      else {
        // field owner is computer

      }

    },

    place_boat ( x, y ) {

      const at = ( x, y ) =>
        ( x < 0 || x >= this.w || y < 0 || y >= this.h ) ? 0 : this.map[ y ][ x ]

      const put = ( x, y, value ) =>
        this.map[ y ][ x ] = value

      const maxlen = this.cells.length - 1

      const status = place_boat ( x, y, at, put, maxlen )

      if ( ! status ) {
        // recalculate used cells number ( must be all zero to start game )

        this.cells = this.boats.map ( ( e, i ) => e * i )

        for ( let row of this.map )
          for ( let cell of row )
            if ( cell )
              -- this.cells[ cell ]

      }

      this.$emit ( 'status', this.boats_left.some ( e => e < 0 ) ? -5 : status )

    }

  }
}
</script>




<style scoped lang="sass">

.field-wrapper
  display: flex
  transition: opacity 1s

  &--disabled
    opacity: 0.1

.legend
  margin: 1em
  width: 3em

.row
  display: flex

</style>
