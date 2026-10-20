import { describe, expect, it } from 'vitest'

import { mapNodes } from '../src/data/nodes'
import { createInitialState, getNodeStatus, solveCurrentNode } from '../src/game/state'

describe('game progress', () => {
  it('places farm tasks along the requested winding route', () => {
    const [seedShed, waterPump, windmill, greenhouse, petBarn, solarRoof] = mapNodes

    expect(seedShed.position.x).toBe(waterPump.position.x)
    expect(seedShed.position.y).toBeGreaterThan(waterPump.position.y)
    expect(seedShed.position.y - waterPump.position.y).toBeGreaterThanOrEqual(300)
    expect(waterPump.position.y).toBe(windmill.position.y)
    expect(windmill.position.x).toBe(greenhouse.position.x)
    expect(windmill.position.y).toBeLessThan(greenhouse.position.y)
    expect(greenhouse.position.y - windmill.position.y).toBeGreaterThanOrEqual(300)
    expect(greenhouse.position.y).toBe(petBarn.position.y)
    expect(greenhouse.position.x).toBeLessThan(petBarn.position.x)
    expect(solarRoof.position.x).toBe(petBarn.position.x)
    expect(solarRoof.position.y).toBeLessThan(petBarn.position.y)
    expect(solarRoof.position.y).toBeGreaterThan(mapNodes[6].position.y)
  })

  it('starts with the first node current and the rest locked', () => {
    const state = createInitialState()

    expect(state.currentNodeId).toBe(mapNodes[0].id)
    expect(mapNodes.map((node) => getNodeStatus(state, node))).toEqual([
      'current',
      'locked',
      'locked',
      'locked',
      'locked',
      'locked',
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

    const waterPumpSolvedState = solveCurrentNode(solvedState)
    expect(getNodeStatus(waterPumpSolvedState, mapNodes[1])).toBe('fixed')
    expect(getNodeStatus(waterPumpSolvedState, mapNodes[2])).toBe('current')
    expect(waterPumpSolvedState.currentNodeId).toBe(mapNodes[2].id)

    const windmillSolvedState = solveCurrentNode(waterPumpSolvedState)
    expect(getNodeStatus(windmillSolvedState, mapNodes[2])).toBe('fixed')
    expect(getNodeStatus(windmillSolvedState, mapNodes[3])).toBe('current')
    expect(windmillSolvedState.currentNodeId).toBe(mapNodes[3].id)

    const greenhouseSolvedState = solveCurrentNode(windmillSolvedState)
    expect(getNodeStatus(greenhouseSolvedState, mapNodes[3])).toBe('fixed')
    expect(getNodeStatus(greenhouseSolvedState, mapNodes[4])).toBe('current')
    expect(greenhouseSolvedState.currentNodeId).toBe(mapNodes[4].id)

    const petBarnSolvedState = solveCurrentNode(greenhouseSolvedState)
    expect(getNodeStatus(petBarnSolvedState, mapNodes[4])).toBe('fixed')
    expect(getNodeStatus(petBarnSolvedState, mapNodes[5])).toBe('current')
    expect(petBarnSolvedState.currentNodeId).toBe(mapNodes[5].id)

    const solarRoofSolvedState = solveCurrentNode(petBarnSolvedState)
    expect(getNodeStatus(solarRoofSolvedState, mapNodes[5])).toBe('fixed')
    expect(getNodeStatus(solarRoofSolvedState, mapNodes[6])).toBe('current')
    expect(solarRoofSolvedState.currentNodeId).toBe(mapNodes[6].id)

    const beaconSolvedState = solveCurrentNode(solarRoofSolvedState)
    expect(getNodeStatus(beaconSolvedState, mapNodes[6])).toBe('fixed')
    expect(beaconSolvedState.fixedNodeIds).toContain('beacon')
  })
})
