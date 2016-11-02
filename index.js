const el = (type, attrs, ...children) => {
  let element = document.createElement(type)
  for (let attrKey in attrs) {
    if (attrKey.indexOf('on') === 0) {
      element[attrKey] = attrs[attrKey]
    } else {
      element.setAttribute(attrKey, attrs[attrKey])
    }
  }
  for (let i = 0; i < children.length; i++) {
    let child = children[i]
    if (['string', 'number'].indexOf(typeof child) >= 0) {
      const text = child
      child = document.createElement('span')
      child.textContent = text
    }
    element.appendChild(child)
  }
  return element
}

const isWinner = ({tiles, player}) =>
  // Check rows
  range(3).some(row =>
    tiles
      .slice(row * 3, row * 3 + 3)
      .every(tile => tile === player)
  ) ||
  // Check columns
  range(3).some(col => [
      tiles[col], tiles[col + 3], tiles[col + 6]
    ].every(tile => tile === player)
  ) ||
  // Check diagonals
  [tiles[0], tiles[4], tiles[8]].every(
    tile => tile === player
  ) ||
  [tiles[2], tiles[4], tiles[6]].every(
    tile => tile === player
  )

const range = (n) =>
  '.'.repeat(n).split('').map((_, i) => i)

const mark = (state, x, y) => {
  const tiles = [
    ...state.tiles.slice(0, y * 3 + x),
    state.player,
    ...state.tiles.slice(y * 3 + x + 1)
  ]
  return {
    tiles,
    player: state.player === 1 ? 2 : 1,
    winner: state.winner === null ?
      (isWinner(Object.assign({}, state, {tiles})) ? state.player : null) :
      state.winner
  }
}

const reset = () => ({
  tiles: range(9).map(() => 0),
  player: 1,
  winner: null
})

const status = (state) =>
  el('h1', {class: 'text-center'},
    state.winner === null ? '' :
    state.winner === 1 ? 'Player 1 wins' :
    state.winner === 2 ? 'Player 2 wins' : ''
  )

const resetButton = (state) =>
  el('div', {class: 'text-center'},
    el('button', {class: 'btn btn-default', onclick: () => render(reset())},
      'Reset'
    )
  )

const board = (state) =>
  el('div', {},
    ...range(3).map(y =>
      el('div', {class: 'row'},
        el('div', {class: 'col-sm-offset-4'},
          ...range(3).map(x =>
            el('h1', {
              class: 'col-xs-4 col-sm-2 jumbotron text-center',
              onclick: () => render(mark(state, x, y)),
              style: 'margin-top: 0; margin-bottom: 0;'
            },
              state.tiles[y * 3 + x] === 0 ? '_' : // Empty space
              state.tiles[y * 3 + x] === 1 ? 'X' : // Player 1
              state.tiles[y * 3 + x] === 2 ? 'O' : // Player 2
              ''
            )
          )
        )
      )
    )
  )

const app = (state) =>
  el('div', {},
    ...[status, resetButton, board].map(element => element(state))
  )

const rootEl = document.querySelector('#root')

const render = (state) => {
  rootEl.innerHTML = ''
  rootEl.appendChild(app(state))
}

render(reset())
