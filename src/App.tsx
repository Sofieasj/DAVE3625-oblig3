import { useEffect, useState } from 'react'

import { exercises } from './data/exercises'
import { mapNodes } from './data/nodes'
import { OverworldMap } from './components/OverworldMap'
import { EndingScreen } from './components/EndingScreen'
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

function loadGameState(): GameState {
  try {
    const savedState = window.localStorage.getItem(STORAGE_KEY)
    if (!savedState) {
      return createInitialState()
    }

    const parsedState: unknown = JSON.parse(savedState)
    const migratedState = migrateGameState(parsedState)
    if (migratedState) {
      return migratedState
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
    Object.entries(state.nodeStates).every(([nodeId, status]) =>
      knownNodeIds.has(nodeId) &&
      (status === 'locked' || status === 'current' || status === 'fixed'),
    )
  )
}

function migrateGameState(value: unknown): GameState | null {
  if (!isGameState(value)) {
    return null
  }

  const nodeStates: GameState['nodeStates'] = Object.fromEntries(
    mapNodes.map((node) => [node.id, value.nodeStates[node.id] ?? 'locked']),
  )
  const fixedNodeIds = [...value.fixedNodeIds]
  let currentNodeId = value.currentNodeId

  if (!value.nodeStates['solar-roof'] && (value.currentNodeId === 'beacon' || fixedNodeIds.includes('beacon'))) {
    nodeStates['solar-roof'] = 'current'
    nodeStates.beacon = 'locked'
    currentNodeId = 'solar-roof'
    const beaconIndex = fixedNodeIds.indexOf('beacon')
    if (beaconIndex >= 0) {
      fixedNodeIds.splice(beaconIndex, 1)
    }
  }

  return { ...value, currentNodeId, fixedNodeIds, nodeStates }
}

function App() {
  const [gameState, setGameState] = useState<GameState>(loadGameState)
  const [selectedNodeId, setSelectedNodeId] = useState(gameState.currentNodeId)
  const [answer, setAnswer] = useState('')
  const [consoleEntries, setConsoleEntries] = useState<ConsoleEntry[]>([
    { type: 'info', text: 'Farm status: waiting for test run.' },
  ])
  const [showHint, setShowHint] = useState(false)
  const [completedTaskNumber, setCompletedTaskNumber] = useState<number | null>(null)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState))
    } catch (error) {
      console.warn('Could not save Solar Bean progress.', error)
    }
  }, [gameState])

  useEffect(() => {
    if (completedTaskNumber === null) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setCompletedTaskNumber(null)
      setAnswer('')
      setShowHint(false)
      setConsoleEntries([{ type: 'info', text: 'Enter your answer and run the tests.' }])
    }, 1200)

    return () => window.clearTimeout(timeoutId)
  }, [completedTaskNumber])

  const selectedNode = mapNodes.find((node) => node.id === selectedNodeId)
  const currentExercise = exercises.find(
    (exercise) => exercise.nodeId === selectedNodeId,
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

    if (gameState.fixedNodeIds.includes(selectedNodeId)) {
      setConsoleEntries([{ type: 'info', text: 'This task is already completed.' }])
      setShowHint(false)
      return
    }

    setCompletedTaskNumber(exercises.indexOf(currentExercise) + 1)
    setSelectedNodeId(selectedNode?.unlocks ?? selectedNodeId)
    setGameState((state) => solveCurrentNode(state))
  }

  function resetGame() {
    const initialState = createInitialState()
    setGameState(initialState)
    setSelectedNodeId(initialState.currentNodeId)
    setAnswer('')
    setShowHint(false)
    setCompletedTaskNumber(null)
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

      <main
        className={`game-layout ${gameState.fixedNodeIds.includes('beacon') ? 'game-complete' : ''}`}
      >
        <OverworldMap
          nodes={mapNodes}
          getNodeStatus={(node) => getNodeStatus(gameState, node)}
          selectedNodeId={selectedNodeId}
          isComplete={gameState.fixedNodeIds.includes('beacon')}
          petVariant={gameState.fixedNodeIds.includes('pet-barn') ? 'raccoon' : 'dog'}
          petSpeech={gameState.fixedNodeIds.includes('pet-barn') ? 'Chitter!' : 'Woof!'}
          onSelectNode={(node) => {
            setSelectedNodeId(node.id)
            setAnswer('')
            setShowHint(false)
            setConsoleEntries([{ type: 'info', text: 'Enter your answer and run the tests.' }])
          }}
        />
        {gameState.fixedNodeIds.includes('beacon') && completedTaskNumber === null ? (
          <EndingScreen onPlayAgain={resetGame} />
        ) : (
          <TaskPanel
            nodeName={selectedNode?.name ?? 'Unknown node'}
            exercise={currentExercise}
            completedTaskNumber={completedTaskNumber}
            answer={answer}
            consoleEntries={consoleEntries}
            showHint={showHint}
            onAnswerChange={setAnswer}
            onRunTests={runTests}
            onShowHint={() => setShowHint(true)}
          />
        )}
      </main>
    </div>
  )
}

export default App
