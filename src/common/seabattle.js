function place_boat ( x, y, at, put, maxlen ) {
  // Places or removes figures
  // x, y   -- cell position
  // at     -- function returning cell at position
  // put    -- function putting cell at position
  // maxlen -- max boat-length

  const ml = at ( x - 1, y     ) // middle-left
  const mr = at ( x + 1, y     ) // middle-right
  const tm = at ( x    , y - 1 ) // top-middle
  const bm = at ( x    , y + 1 ) // bottom-middle
  const mm = at ( x    , y     ) // middle-middle
  const tl = at ( x - 1, y - 1 ) // top-left
  const tr = at ( x + 1, y - 1 ) // top-right
  const bl = at ( x - 1, y + 1 ) // bottom-left
  const br = at ( x + 1, y + 1 ) // bottom-right

  if ( ! mm ) {
    // user adds new boat

    if ( ( tl && tm ) || ( tm && tr ) || ( bl && bm ) || ( bm && br ) ) {
      // horisontal T-figure is not allowed
      return -1
    }

    if ( ( tl && ml ) || ( ml && bl ) || ( tr && mr ) || ( mr && br ) ) {
      // vertical T-figure is not allowed
      return -2
    }

    if ( tl || tr || bl || br ) {
      // cornered figure is not allowed
      return -3
    }

    // calc len

    const dy = tm || bm ? 1 : 0
    const dx = ml || mr ? 1 : 0

    let len = 0

    for ( let i = 1; i < maxlen + 1; ++i ) {
      if ( ! at ( x - dx * i, y - dy * i ) ) break
      len += 1
    }

    for ( let i = 1; i < maxlen + 1; ++i ) {
      if ( ! at ( x + dx * i, y + dy * i ) ) break
      len += 1
    }

    if ( len >= maxlen ) {
      // figure cannot be bigger than maxlen
      return -4
    }

    // apply len

    for ( let i = 1; i < maxlen; ++i ) {
      if ( ! at ( x - dx * i, y - dy * i ) ) break
      put ( x - dx * i, y - dy * i, len + 1 )
    }

    for ( let i = 1; i < maxlen; ++i ) {
      if ( ! at ( x + dx * i, y + dy * i ) ) break
      put ( x + dx * i, y + dy * i, len + 1 )
    }

    put ( x, y, len + 1 )

  }

  else {
    // user removes existing boat

    // calc len

    const dy = tm || bm ? 1 : 0
    const dx = ml || mr ? 1 : 0

    let len1 = 0
    for ( let i = 1; i < maxlen + 1; ++i ) {
      if ( ! at ( x - dx * i, y - dy * i ) ) break
      len1 += 1
    }

    let len2 = 0
    for ( let i = 1; i < maxlen + 1; ++i ) {
      if ( ! at ( x + dx * i, y + dy * i ) ) break
      len2 += 1
    }

    // apply len

    for ( let i = 1; i < maxlen; ++i ) {
      if ( ! at ( x - dx * i, y - dy * i ) ) break
      put ( x - dx * i, y - dy * i, len1 )
    }

    for ( let i = 1; i < maxlen; ++i ) {
      if ( ! at ( x + dx * i, y + dy * i ) ) break
      put ( x + dx * i, y + dy * i, len2 )
    }

    put ( x, y, 0 )

  }

  return 0

}


export { place_boat }
