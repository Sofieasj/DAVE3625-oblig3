import { describe, expect, it } from 'vitest'

import { mapNodes } from '../src/data/nodes'
import { createInitialState, getNodeStatus, solveCurrentNode } from '../src/game/state'

describe('game progress', () => {
  it('starts with the first node current and the rest locked', () => {
    const state = createInitialState()

    expect(state.currentNodeId).toBe(mapNodes[0].id)
    expect(mapNodes.map((node) => getNodeStatus(state, node))).toEqual([
      'current',
      'locked',
    ])
  })

  it('fixes the current node and unlocks the next node', () => {
    const initialState = createInitialState()
    const solvedState = solveCurrentNode(initialState)

    expect(getNodeStatus(solvedState, mapNodes[0])).toBe('fixed')
    expect(getNodeStatus(solvedState, mapNodes[1])).toBe('current')
    expect(solvedState.currentNodeId).toBe(mapNodes[1].id)
    expect(solvedState.fixedNodeIds).toContain(mapNodes[0].id)
    expect(initialState.fixedNodeIds).toEqual([])
  })
})
