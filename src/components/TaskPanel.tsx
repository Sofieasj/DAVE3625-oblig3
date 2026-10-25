import type { Exercise } from '../data/exercises'

export type ConsoleEntry = {
  type: 'pass' | 'fail' | 'info'
  text: string
}

type TaskPanelProps = {
  nodeName: string
  exercise: Exercise | undefined
  completedTaskNumber: number | null
  completedTaskMessage: string
  onNext: () => void
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
  completedTaskMessage,
  onNext,
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
        {completedTaskMessage && <p className="mission-copy">{completedTaskMessage}</p>}
        <button type="button" className="next-button" onClick={onNext}>
          NEXT
        </button>
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

      {(exercise.story || exercise.lesson) && (
        <div className="task-context">
          {exercise.story && <p className="bean-story">Bean: {exercise.story}</p>}
          {exercise.lesson && <p className="java-lesson">JAVA TIP: {exercise.lesson}</p>}
        </div>
      )}
      <p className="mission-copy">
        <span className="prompt-help-icon" aria-hidden="true">?</span>
        <span>{exercise.prompt}</span>
      </p>

      {exercise.type === 'quiz' ? (
        <fieldset className="quiz-options">
          <legend className="field-label">Choose an answer</legend>
          {exercise.options.map((option, index) => (
            <label className="quiz-option" key={option}>
              <input
                type="radio"
                name={exercise.id}
                value={index}
                checked={answer === String(index)}
                onChange={() => onAnswerChange(String(index))}
              />
              <code>{option}</code>
            </label>
          ))}
        </fieldset>
      ) : exercise.type === 'fill-blank' ? (
        <div className="fill-blank-preview">
          <pre className="starter-code">
            {exercise.starterCode.split('\n').map((line, index) => (
              <span className="starter-line" key={`${index}-${line}`}>
                <span className="line-number">{index + 1}</span>
                {line.includes('___') ? (
                  <>
                    {line.split('___')[0]}
                    <label className="visually-hidden" htmlFor="fill-blank-answer">
                      Choose a value for the blank
                    </label>
                    <select
                      id="fill-blank-answer"
                      value={answer}
                      onChange={(event) => onAnswerChange(event.target.value)}
                    >
                      <option value="">Choose...</option>
                      {exercise.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {line.split('___')[1]}
                  </>
                ) : (
                  line
                )}
              </span>
            ))}
          </pre>
        </div>
      ) : (
        <>
          {exercise.starterCode && (
            <pre className="starter-code">
              {exercise.starterCode.split('\n').map((line, index) => (
                <span
                  className={`starter-line ${exercise.type === 'fix-code' && exercise.editableLine === index + 1 ? 'editable-line' : ''}`}
                  key={`${index}-${line}`}
                >
                  <span className="line-number">{index + 1}</span>
                  {line}
                </span>
              ))}
            </pre>
          )}
          <label className="field-label" htmlFor="answer-input">
            {exercise.type === 'fix-code' ? 'Rewrite the broken line:' : 'Write your Java line:'}
          </label>
          <textarea
            id="answer-input"
            rows={1}
            value={answer}
            onChange={(event) => onAnswerChange(event.target.value)}
            aria-label="Java code answer"
          />
        </>
      )}

      <div className="button-row">
        <button type="button" className="primary-button" onClick={onRunTests}>
          <span className="play-icon" aria-hidden="true">▶</span>
          <span className="button-label">RUN TESTS</span>
        </button>
        <button type="button" className="secondary-button" onClick={onShowHint}>
          <span className="button-label">HINT</span>
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
