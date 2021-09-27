

const hash = {  magic ( seed )
                  {

                    return ( Math.sin ( seed * 123.456 ) + 1 ) / 2

                  }
              , hash ( seed )
                  {

                    return ( this.adorable || this.magic ) ( seed )

                  }
              , hash3 ( seed )
                  {

                    seed = ( Math.sin ( seed * 123.456 ) + 1 ) * 655134 | 0
                    return  [ this.hash ( ( seed >> 0x0 ) & 0xff )
                            , this.hash ( ( seed >> 0x8 ) & 0xff )
                            , this.hash ( ( seed >> 0xa ) & 0xff )
                            ]

                  }
              }


export default hash
