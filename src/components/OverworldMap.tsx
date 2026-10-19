import type { CSSProperties } from 'react'

import type { MapNode } from '../data/nodes'
import type { NodeStatus } from '../game/state'

type OverworldMapProps = {
  nodes: MapNode[]
  getNodeStatus: (node: MapNode) => NodeStatus
}

export function OverworldMap({ nodes, getNodeStatus }: OverworldMapProps) {
  const currentNode = nodes.find((node) => getNodeStatus(node) === 'current') ?? nodes[0]

  return (
    <section className="map-panel" aria-label="Farm map">
      <div className="map-surface">
        {nodes.map((node, index) => {
          const status = getNodeStatus(node)
          const style: CSSProperties = {
            left: `${node.position.x}px`,
            top: `${node.position.y}px`,
          }

          return (
            <button
              key={node.id}
              type="button"
              className={`node-card ${status}`}
              style={style}
              aria-label={`${node.name}: ${status}`}
              disabled
            >
              <span className="node-badge">{index + 1}</span>
              <span className="node-label">{node.name}</span>
              {status === 'locked' && <span className="lock-mark" aria-hidden="true">LOCKED</span>}
              {status === 'current' && <span className="alert-mark" aria-hidden="true">!</span>}
            </button>
          )
        })}

        {currentNode && (
          <div
            className="player-token"
            style={{
              left: `${currentNode.position.x + 74}px`,
              top: `${currentNode.position.y + 70}px`,
            }}
            aria-label={`Player at ${currentNode.name}`}
          >
            <span className="token-head" />
            <span className="token-body" />
          </div>
        )}
      </div>
    </section>
  )
}
