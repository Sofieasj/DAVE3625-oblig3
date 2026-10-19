import { useEffect, useState } from 'react'

import { exercises } from './data/exercises'
import { mapNodes } from './data/nodes'
import { OverworldMap } from './components/OverworldMap'
import { TaskPanel, type ConsoleEntry } from './components/TaskPanel'
import {
  createInitialState,
  getNodeStatus,
  solveCurrentNode,
  type GameState,
} from './game/state'
import { validateExerciseAnswer } from './game/validate'
import './App.css'

const STORAGE_KEY = 'solar-bean-progress'
const initialExercise = exercises[0]

function loadGameState(): GameState {
  try {
    const savedState = window.localStorage.getItem(STORAGE_KEY)
    if (!savedState) {
      return createInitialState()
    }

    const parsedState: unknown = JSON.parse(savedState)
    if (isGameState(parsedState)) {
      return parsedState
    }

    console.warn('Saved Solar Bean progress is invalid. Starting a new game.')
  } catch (error) {
    console.warn('Could not load Solar Bean progress. Starting a new game.', error)
  }

  return createInitialState()
}

function isGameState(value: unknown): value is GameState {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const state = value as Partial<GameState>
  const knownNodeIds = new Set(mapNodes.map((node) => node.id))

  return (
    typeof state.currentNodeId === 'string' &&
    knownNodeIds.has(state.currentNodeId) &&
    Array.isArray(state.fixedNodeIds) &&
    state.fixedNodeIds.every((nodeId) => knownNodeIds.has(nodeId)) &&
    typeof state.nodeStates === 'object' &&
    state.nodeStates !== null &&
    mapNodes.every((node) => {
      const status = state.nodeStates?.[node.id]
      return status === 'locked' || status === 'current' || status === 'fixed'
    })
  )
}

function App() {
  const [gameState, setGameState] = useState<GameState>(loadGameState)
  const [answer, setAnswer] = useState(initialExercise.starterCode)
  const [consoleEntries, setConsoleEntries] = useState<ConsoleEntry[]>([
    { type: 'info', text: 'Farm status: waiting for test run.' },
  ])
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState))
    } catch (error) {
      console.warn('Could not save Solar Bean progress.', error)
    }
  }, [gameState])

  const currentNode = mapNodes.find((node) => node.id === gameState.currentNodeId)
  const currentExercise = exercises.find(
    (exercise) => exercise.nodeId === gameState.currentNodeId,
  )

  function runTests() {
    if (!currentExercise) {
      return
    }

    const result = validateExerciseAnswer(currentExercise, answer)

    if (!result.isCorrect) {
      setConsoleEntries([
        { type: 'fail', text: result.message },
        { type: 'info', text: `Hint: ${currentExercise.hint}` },
      ])
      setShowHint(true)
      return
    }

    setGameState((state) => solveCurrentNode(state))
    setConsoleEntries([
      { type: 'pass', text: result.message },
      { type: 'info', text: 'The task is fixed and the next node is unlocked.' },
    ])
    setShowHint(false)
  }

  function resetGame() {
    setGameState(createInitialState())
    setAnswer(initialExercise.starterCode)
    setShowHint(false)
    setConsoleEntries([{ type: 'info', text: 'Progress reset. The farm is waiting again.' }])
  }

  return (
    <div className="app-shell">
      <header className="hud">
        <div className="brand">SOLAR BEAN</div>
        <button type="button" className="reset-button" onClick={resetGame}>
          RESET
        </button>
      </header>

      <main className="game-layout">
        <OverworldMap nodes={mapNodes} getNodeStatus={(node) => getNodeStatus(gameState, node)} />
        <TaskPanel
          nodeName={currentNode?.name ?? 'Unknown node'}
          exercise={currentExercise}
          answer={answer}
          consoleEntries={consoleEntries}
          showHint={showHint}
          onAnswerChange={setAnswer}
          onRunTests={runTests}
          onShowHint={() => setShowHint(true)}
        />
      </main>
    </div>
  )
}

export default App
