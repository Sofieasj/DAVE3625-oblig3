import { mapNodes, type MapNode } from '../data/nodes'

export type NodeStatus = 'locked' | 'current' | 'fixed'

export type GameState = {
  currentNodeId: string
  fixedNodeIds: string[]
  completedExerciseIds: string[]
  nodeStates: Record<string, NodeStatus>
  petSound?: string
}

export function createInitialState(): GameState {
  const nodeStates: Record<string, NodeStatus> = {}

  for (const node of mapNodes) {
    nodeStates[node.id] = node.id === 'seed-shed' ? 'current' : 'locked'
  }

  return {
    currentNodeId: 'seed-shed',
    fixedNodeIds: [],
    completedExerciseIds: [],
    nodeStates,
  }
}

export function completeExercise(state: GameState, exerciseId: string): GameState {
  const currentNode = mapNodes.find((node) => node.id === state.currentNodeId)
  if (!currentNode || !currentNode.exerciseIds.includes(exerciseId)) {
    return state
  }

  const completedExerciseIds = [...new Set([...state.completedExerciseIds, exerciseId])]
  const nodeIsComplete = currentNode.exerciseIds.every((id) => completedExerciseIds.includes(id))
  const nodeStates = { ...state.nodeStates }
  const fixedNodeIds = nodeIsComplete
    ? [...new Set([...state.fixedNodeIds, currentNode.id])]
    : state.fixedNodeIds
  const nextNodeId = nodeIsComplete ? currentNode.unlocks : null

  if (nodeIsComplete) {
    nodeStates[currentNode.id] = 'fixed'
  }

  const nextState: GameState = {
    currentNodeId: nextNodeId ?? currentNode.id,
    fixedNodeIds,
    completedExerciseIds,
    nodeStates,
  }

  if (nextNodeId) {
    nextState.nodeStates[nextNodeId] = 'current'
  }

  return nextState
}

export function getNodeStatus(state: GameState, node: MapNode): NodeStatus {
  return state.nodeStates[node.id] ?? 'locked'
}
