import { describe, expect, it } from 'vitest'

import { exercises } from '../src/data/exercises'
import { mapNodes } from '../src/data/nodes'
import { completeExercise, createInitialState, getNodeStatus } from '../src/game/state'

describe('game progress', () => {
  it('places farm tasks along the requested winding route', () => {
    const [seedShed, waterPump, windmill, greenhouse, solarRoof, petBarn] = mapNodes

    expect(mapNodes.map((node) => node.id)).toEqual([
      'seed-shed',
      'water-pump',
      'windmill',
      'greenhouse',
      'solar-roof',
      'pet-barn',
      'beacon',
    ])
    expect(seedShed.position.x).toBe(waterPump.position.x)
    expect(seedShed.position.y).toBeGreaterThan(waterPump.position.y)
    expect(seedShed.position.y - waterPump.position.y).toBeGreaterThanOrEqual(300)
    expect(waterPump.position.y).toBe(windmill.position.y)
    expect(windmill.position.x).toBe(greenhouse.position.x)
    expect(windmill.position.y).toBeLessThan(greenhouse.position.y)
    expect(greenhouse.position.y - windmill.position.y).toBeGreaterThanOrEqual(300)
    expect(greenhouse.position.x).toBeLessThan(solarRoof.position.x)
    expect(solarRoof.position.y).toBeLessThan(petBarn.position.y)
    expect(solarRoof.position.y).toBeGreaterThan(mapNodes[6].position.y)
  })

  it('maps every exercise to exactly one farm node', () => {
    const nodeExerciseIds = mapNodes.flatMap((node) => node.exerciseIds)
    expect(new Set(nodeExerciseIds)).toEqual(new Set(exercises.map((exercise) => exercise.id)))

    for (const node of mapNodes) {
      for (const exerciseId of node.exerciseIds) {
        expect(exercises.find((exercise) => exercise.id === exerciseId)?.nodeId).toBe(node.id)
      }
    }
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

  it('keeps Seed Shed current until both tasks are complete', () => {
    const initialState = createInitialState()
    const firstTaskState = completeExercise(initialState, 'seed-shed-1')

    expect(getNodeStatus(firstTaskState, mapNodes[0])).toBe('current')
    expect(getNodeStatus(firstTaskState, mapNodes[1])).toBe('locked')
    expect(firstTaskState.currentNodeId).toBe(mapNodes[0].id)
    expect(firstTaskState.completedExerciseIds).toContain('seed-shed-1')
    expect(initialState.fixedNodeIds).toEqual([])

    const seedShedSolvedState = completeExercise(firstTaskState, 'seed-shed-2')
    expect(getNodeStatus(seedShedSolvedState, mapNodes[0])).toBe('fixed')
    expect(getNodeStatus(seedShedSolvedState, mapNodes[1])).toBe('current')
    expect(seedShedSolvedState.currentNodeId).toBe(mapNodes[1].id)
    expect(seedShedSolvedState.fixedNodeIds).toContain(mapNodes[0].id)

    const invalidExerciseState = completeExercise(seedShedSolvedState, 'windmill-1')
    expect(invalidExerciseState).toBe(seedShedSolvedState)

    const firstWaterPumpTaskState = completeExercise(seedShedSolvedState, 'water-pump-1')
    expect(getNodeStatus(firstWaterPumpTaskState, mapNodes[1])).toBe('current')
    expect(firstWaterPumpTaskState.currentNodeId).toBe(mapNodes[1].id)
    const waterPumpSolvedState = completeExercise(firstWaterPumpTaskState, 'water-pump-2')
    expect(getNodeStatus(waterPumpSolvedState, mapNodes[1])).toBe('fixed')
    expect(getNodeStatus(waterPumpSolvedState, mapNodes[2])).toBe('current')
    expect(waterPumpSolvedState.currentNodeId).toBe(mapNodes[2].id)
  })

  it('can complete every node in order', () => {
    let state = createInitialState()

    for (const node of mapNodes) {
      expect(state.currentNodeId).toBe(node.id)

      for (const exerciseId of node.exerciseIds) {
        state = completeExercise(state, exerciseId)
      }

      expect(state.fixedNodeIds).toContain(node.id)
      if (node.unlocks) {
        expect(state.currentNodeId).toBe(node.unlocks)
      }
    }

    expect(state.fixedNodeIds).toEqual(mapNodes.map((node) => node.id))
  })
})
