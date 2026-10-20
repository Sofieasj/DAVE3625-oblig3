type EndingScreenProps = {
  onPlayAgain: () => void
}

export function EndingScreen({ onPlayAgain }: EndingScreenProps) {
  return (
    <section className="ending-screen" aria-label="Farm restored" aria-live="polite">
      <p className="mission-pill">MISSION COMPLETE</p>
      <h1>Farm restored!</h1>
      <p className="mission-copy">
        The Beacon is shining across Solar Bean. Thanks for bringing the farm back to life!
      </p>
      <button type="button" className="primary-button play-again-button" onClick={onPlayAgain}>
        PLAY AGAIN
      </button>
    </section>
  )
}
