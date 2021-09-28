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
  emits: [ 'push_state' ],
  data () {

    const boats = [ 0, 4, 2, 2, 1 ] // first value must be 0, other values are number of available boats for each boat-length a.k.a index
    // const boats = [ 0, 1 ]

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

      // enemy hit state indicates whether enemy need to
      // hit neighbour cell or random one according to last hit state
      // null -- random cell
      // array -- neighbour cell ( array contains position of last hit )
      // used only by human field in watch->state
      enemy_neighbour_guess: null,

    }
  },
  computed: {

    is_human () {

      return this.owner === 'human'

    },

    field_wrapper_class () {

      const a = this.is_human && this.state === 'user:hiting'
      const b = ! this.is_human && this.state === 'user:placing'
      const c = ! this.is_human && this.state === 'enemy:hiting'

      console.log ( a, b, c )

      return { 'field-wrapper--disabled': a || b || c }

    },

    boats_left () {

      return this.cells.slice ( 1 ) .map ( ( e, i ) => e / ( i + 1 ) | 0 )

    },

  },
  watch: {

    state ( state ) {

      if ( this.is_human && state === 'enemy:continue' ) {
        // on each enemy hit, state must be changed from 'hiting' to 'continue' and 'hiting'
        // again because vue runs current method only if property's new value isn't equal to old value.
        return this.$emit ( 'push_state', 8 )
      }

      if ( this.is_human && state === 'enemy:hiting' ) setTimeout ( () => {

        let x = null
        let y = null
        let unhit_cell_found = false

        if ( null !== this.enemy_neighbour_guess ) {
          // dumpy neighbour guess

          [ x, y ] = this.enemy_neighbour_guess

          const neighbours = [
            [ x    , y + 1 ],
            [ x    , y - 1 ],
            [ x + 1, y     ],
            [ x - 1, y     ],
          ]

          const i = Math.random () * neighbours.length | 0

          for ( let k = 0; k < neighbours.length; ++k ) {
            const t = ( k + i ) % neighbours.length
            ;
            [ x, y ] = neighbours[ t ]
            if ( x < 0 || x >= this.map[ 0 ].length || y < 0 || y >= this.map.length )
              continue
            if ( this.map[ y ][ x ] >= 0 ) {
              unhit_cell_found = true
              break
            }
          }

        }

        if ( ! unhit_cell_found ) {
          // random guess

          const size = this.map.length * this.map[ 0 ].length
          const i = size * Math.random () | 0

          for ( let k = 0; k < size; ++k ) {
            const t = ( k + i ) % size
            x = t % this.map[ 0 ].length
            y = t / this.map[ 0 ].length | 0
            if ( this.map[ y ][ x ] >= 0 ) {
              unhit_cell_found = true
              break
            }
          }

        }

        if ( unhit_cell_found ) {

          const metadata = { boat_is_dead: false }
          const status = [ -8, 6, 7, 5 ][ this.blow_boat ( x, y, metadata ) ]
          this.enemy_neighbour_guess = ( status === 5 && ! metadata.boat_is_dead ) ? [ x, y ] : null
          return setTimeout ( () => this.$emit ( 'push_state', status ), 1000 )

        }

        // unhit cell not found
        return this.$emit ( 'push_state', -7 )
      }, 1000 )

    }

  },
  methods: {

    click ( x, y ) {
      // Emits action status to the parent

      if ( this.state === 'user:placing' ) {
        if ( this.is_human ) {
          const status = this.place_boat ( x, y )
          return this.$emit ( 'push_state', status )
        }
      }

      else if ( this.state === 'user:hiting' ) {
        if ( ! this.is_human ) {
          const status = [ -6, 2, 4, 3 ][ this.blow_boat ( x, y ) ]
          return this.$emit ( 'push_state', status )
        }
      }

    },

    blow_boat ( x, y, o={} ) {

      if ( this.map[ y ][ x ] < 0 ) {
        // try again
        return 0
      }

      if ( this.map[ y ][ x ] === 0 ) {
        // miss
        this.map[ y ][ x ] = -1
        return 1
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

          // metadata for computer, see watch->state
          o.boat_is_dead = true
        }

        // decrese boats number
        this.cells[ v ] -= this.linked_map[ y ][ x ].length

        if ( this.cells.every ( e => e === 0 ) ) {
          // all boats are blowed up, game over
          return 2
        }

      }

      // hit! try again
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

      // return boat < 0 ? boat : 0
      return boat

      // you can return 'boat' to make enemy boats visible
    },

    build_linked_map ( map ) {
      // Builds array of array of array of positions of neighbours of each boat
      // map -- array of array of cells ( integers )

      const at = ( x, y ) =>
        ( x < 0 || x >= map[ 0 ].length || y < 0 || y >= map.length ) ? 0 : map[ y ][ x ]

      const linked_map = map.map ( e => e.map ( () => null ) )

      const link = ( a, x, y ) => {
        if ( linked_map[ y ][ x ] !== null ) return // skip already linked cells
        linked_map[ y ][ x ] = a // set link to the map
        a.push ( [ x, y ] ) // append position
        ;
        [ [ x + 1, y     ]
        , [ x - 1, y     ]
        , [ x    , y + 1 ]
        , [ x    , y - 1 ]
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

      const at = ( x, y ) =>
        ( x < 0 || x >= map[ 0 ].length || y < 0 || y >= map.length ) ? 0 : map[ y ][ x ]

      boats.forEach ( ( num, i ) => {

        const size = i

        let inf = 0 // free space can be not found, to avoid infinite cycle additional counter used.
        const maxinf = 0xfff
        for ( let k = 0; k < num && inf < maxinf; ++k, ++inf ) {

          const dx = Math.random () * 2 | 0
          const dy = dx ? 0 : 1
          const y = Math.random () * ( map.length - size * dy ) | 0
          const x = Math.random () * ( map[ 0 ].length - size * dx ) | 0

          let space_is_free = true
          for ( let t = 0; t < size; ++t )
            if ( at ( x + t * dx    , y + t * dy     )
            ||   at ( x + t * dx + 1, y + t * dy     )
            ||   at ( x + t * dx    , y + t * dy + 1 )
            ||   at ( x + t * dx + 1, y + t * dy + 1 )
            ||   at ( x + t * dx - 1, y + t * dy     )
            ||   at ( x + t * dx    , y + t * dy - 1 )
            ||   at ( x + t * dx + 1, y + t * dy - 1 )
            ||   at ( x + t * dx - 1, y + t * dy + 1 )
            ||   at ( x + t * dx - 1, y + t * dy - 1 ) )
          {
            space_is_free = false
            break
          }

          if ( space_is_free )
            for ( let t = 0; t < size; ++t )
              map[ y + t * dy ][ x + t * dx ] = size

          else
            -- k

        }

        if ( inf >= maxinf ) console.log ( 'inf' )

      } )

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
