import { mapNodes, type MapNode } from '../data/nodes'

export type NodeStatus = 'locked' | 'current' | 'fixed'

export type GameState = {
  currentNodeId: string
  fixedNodeIds: string[]
  nodeStates: Record<string, NodeStatus>
}

export function createInitialState(): GameState {
  const nodeStates: Record<string, NodeStatus> = {}

  for (const node of mapNodes) {
    nodeStates[node.id] = node.id === 'seed-shed' ? 'current' : 'locked'
  }

  return {
    currentNodeId: 'seed-shed',
    fixedNodeIds: [],
    nodeStates,
  }
}

export function solveCurrentNode(state: GameState): GameState {
  const currentNode = mapNodes.find((node) => node.id === state.currentNodeId)
  if (!currentNode) {
    return state
  }

  const nextNodeId = currentNode.unlocks
  const nodeStates = { ...state.nodeStates }
  nodeStates[currentNode.id] = 'fixed'

  const nextState: GameState = {
    currentNodeId: nextNodeId ?? currentNode.id,
    fixedNodeIds: [...new Set([...state.fixedNodeIds, currentNode.id])],
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
