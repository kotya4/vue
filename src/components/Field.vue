<template>

<div class="field-wrapper" :class="[ field_wrapper_class ]">

  <div>
    <div class="row" v-for="( row, y ) in map" :key="y">
      <Cell v-for="( boat, x ) in row" :key="x" :boat="is_human ? boat : blowed ( boat )" @click="() => click( x, y )" />
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
    state: String,
  },
  emits: [ 'status' ],
  data () {

    // const boats = [ 0, 4, 2, 2, 1 ] // first value must be 0, other values are number of available boats for each boat-length a.k.a index
    const boats = [ 0, 1 ]

    let map = Array ( this.h ) .fill () .map ( () => Array ( this.w ) .fill ( 0 ) )

    let linked_map = null

    if ( this.owner !== 'human' ) {
      // initialize map for computer
      map = this.build_map_for_comuter ( map, boats )
      linked_map = this.build_linked_map ( map )
    }

    return {

      map,

      cells: boats.map ( ( e, i ) => e * i ),

      boats,

      linked_map,

    }
  },
  computed: {

    is_human () {

      return this.owner === 'human'

    },

    field_wrapper_class () {

      return { 'field-wrapper--disabled': ! this.is_human && this.state === 'placing' || this.is_human && this.state === 'blowing' }

    },

    boats_left () {

      return this.cells.slice ( 1 ) .map ( ( e, i ) => e / ( i + 1 ) | 0 )

    },

  },
  methods: {

    click ( x, y ) {
      // Emits action status to the parent

      if ( this.state === 'placing' ) {
        if ( this.is_human ) {
          const status = this.place_boat ( x, y )
          return this.$emit ( 'status', status )
        }
      }

      else if ( this.state === 'blowing' ) {
        if ( ! this.is_human ) {
          const status = this.blow_boat ( x, y )
          return this.$emit ( 'status', status )
        }
      }

    },

    blow_boat ( x, y ) {

      if ( this.map[ y ][ x ] < 0 ) {
        // try again
        return -6
      }

      if ( this.map[ y ][ x ] === 0 ) {
        // miss
        this.map[ y ][ x ] = -1
        return 2
      }

      // hit
      const v = this.map[ y ][ x ]

      this.map[ y ][ x ] = -1

      if ( this.linked_map[ y ][ x ].every ( ( [ x, y ] ) => this.map[ y ][ x ] === -1 ) ) {
        // if every neighbour of boat is dead then empty neighbour cells also must be dead

        const out_of_range = ( x, y ) => x < 0 || x >= this.w || y < 0 || y >= this.h

        for ( let [ x, y ] of this.linked_map[ y ][ x ] ) {

          for ( let i = -1; i <= +1; ++i )
            for ( let k = -1; k <= +1; ++k )
              if ( ! out_of_range ( x + i, y + k ) )
                this.map[ y + k ][ x + i ] = -1

        }

        // decrese boats number
        this.cells[ v ] -= this.linked_map[ y ][ x ].length

        if ( this.cells.every ( e => e === 0 ) ) {
          // all boats are blowed up, game over
          return 4
        }

      }

      return 3

    },

    place_boat ( x, y ) {
      // Returns < 0 on incorrect placement,
      // returns 1 when all boats are placed,
      // otherwise returns 0.

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

        if ( this.cells.every ( e => e === 0 ) ) {
          // all boats are placed

          this.linked_map = this.build_linked_map ( this.map )

          this.cells = this.boats.map ( ( e, i ) => e * i )

          return 1
        }

      }

      return this.cells.some ( e => e < 0 ) ? -5 : status

    },

    blowed ( boat ) {
      // Used to show only blowed up boats ( blowed up boat is negative )

      return boat < 0 ? boat : 0

    },

    build_linked_map ( map ) {
      // Builds array of array of array of positions of neighbours of each boat
      // map -- array of array of cells ( integers )

      const at = ( x, y ) =>
        ( x < 0 || x >= this.w || y < 0 || y >= this.h ) ? 0 : map[ y ][ x ]

      const linked_map = map.map ( e => e.map ( () => null ) )

      const link = ( a, x, y ) => {
        if ( linked_map[ y ][ x ] !== null ) return // skip already linked cells
        linked_map[ y ][ x ] = a // set link to the map
        a.push ( [ x, y ] ) // append position
        ;
        [ [ x + 1, y + 0 ]
        , [ x - 1, y + 0 ]
        , [ x + 0, y + 1 ]
        , [ x + 0, y - 1 ]
        ].forEach ( ( [ x, y ] ) => at ( x, y ) && link ( a, x, y ) ) // do same thing to all neighbours
      }

      for ( let y = 0; y < map.length; ++y )
        for ( let x = 0; x < map[ y ].length; ++x )
          if ( at ( x, y ) )
            link ( [], x, y ) // recoursively links the boat

      return linked_map
    },

    build_map_for_comuter ( map, boats ) {
      // Builds map for computer.
      // map   -- array of array of initial cell values ( zeros )
      // boats -- array of available boats

      boats;

      map[ 3 ][ 3 ] = 1

      return map
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
    pointer-events: none

.legend
  margin: 1em
  width: 3em

.row
  display: flex

</style>
