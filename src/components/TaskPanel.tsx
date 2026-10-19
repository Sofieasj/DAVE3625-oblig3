import type { Exercise } from '../data/exercises'

export type ConsoleEntry = {
  type: 'pass' | 'fail' | 'info'
  text: string
}

type TaskPanelProps = {
  nodeName: string
  exercise: Exercise | undefined
  completedTaskNumber: number | null
  answer: string
  consoleEntries: ConsoleEntry[]
  showHint: boolean
  onAnswerChange: (answer: string) => void
  onRunTests: () => void
  onShowHint: () => void
}

export function TaskPanel({
  nodeName,
  exercise,
  completedTaskNumber,
  answer,
  consoleEntries,
  showHint,
  onAnswerChange,
  onRunTests,
  onShowHint,
}: TaskPanelProps) {
  if (completedTaskNumber !== null) {
    return (
      <aside className="terminal-panel task-complete" aria-label="Task completed" aria-live="polite">
        <h1>Task {completedTaskNumber} completed!</h1>
      </aside>
    )
  }

  if (!exercise) {
    return (
      <aside className="terminal-panel" aria-label="Exercise panel">
        <div className="mission-topline">
          <span className="mission-pill">UP NEXT</span>
          <h1>{nodeName}</h1>
        </div>
        <p className="mission-copy">This node is unlocked. Its exercise will be added later.</p>
      </aside>
    )
  }

  return (
    <aside className="terminal-panel" aria-label="Exercise panel">
      <div className="mission-topline">
        <span className="mission-pill">TASK</span>
        <h1>{exercise.title}</h1>
      </div>

      <p className="mission-copy">{exercise.prompt}</p>

      <label className="field-label" htmlFor="answer-input">
        Rewrite the broken line
      </label>
      <textarea
        id="answer-input"
        rows={3}
        value={answer}
        onChange={(event) => onAnswerChange(event.target.value)}
        aria-label="Java code answer"
      />

      <div className="button-row">
        <button type="button" className="primary-button" onClick={onRunTests}>
          RUN TESTS
        </button>
        <button type="button" className="secondary-button" onClick={onShowHint}>
          HINT
        </button>
      </div>

      <div className="console" aria-live="polite">
        {consoleEntries.map((entry, index) => (
          <div key={`${entry.type}-${index}`} className={`console-line ${entry.type}`}>
            [{entry.type.toUpperCase()}] {entry.text}
          </div>
        ))}
        {showHint && <div className="console-line hint-line">[HINT] {exercise.hint}</div>}
      </div>
    </aside>
  )
}
