import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'

import type { MapNode } from '../data/nodes'
import type { NodeStatus } from '../game/state'

type OverworldMapProps = {
  nodes: MapNode[]
  getNodeStatus: (node: MapNode) => NodeStatus
  selectedNodeId: string
  isComplete: boolean
  petAdopted: boolean
  petSpeech: string
  onSelectNode: (node: MapNode) => void
}

export function OverworldMap({
  nodes,
  getNodeStatus,
  selectedNodeId,
  isComplete,
  petAdopted,
  petSpeech,
  onSelectNode,
}: OverworldMapProps) {
  const currentNode =
    nodes.find((node) => getNodeStatus(node) === 'current') ??
    [...nodes].reverse().find((node) => getNodeStatus(node) === 'fixed') ??
    nodes[0]
  const tokenRef = useRef<HTMLDivElement>(null)
  const surfaceRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const previousNodeId = useRef(currentNode?.id)
  const dragStart = useRef<{ pointerId: number; x: number; y: number; offsetX: number; offsetY: number } | null>(null)
  const [mapOffset, setMapOffset] = useState({ x: 0, y: -250 })
  const [tokenNodeId, setTokenNodeId] = useState(currentNode?.id)
  const mapScale = isComplete ? 1.18 : 1

  useEffect(() => {
    if (!isComplete || !surfaceRef.current) {
      return
    }

    const surface = surfaceRef.current
    const minX = Math.min(...nodes.map((node) => node.position.x))
    const minY = Math.min(...nodes.map((node) => node.position.y))
    const maxX = Math.max(...nodes.map((node) => node.position.x + 202))
    const maxY = Math.max(...nodes.map((node) => node.position.y + 62))
    const nodesCenterX = (minX + maxX) / 2
    const nodesCenterY = (minY + maxY) / 2

    setMapOffset({
      x: surface.clientWidth / 2 - nodesCenterX * mapScale,
      y: surface.clientHeight / 2 - nodesCenterY * mapScale,
    })
  }, [isComplete, mapScale, nodes])

  useEffect(() => {
    if (!currentNode || previousNodeId.current === currentNode.id) {
      return
    }

    const fromNode = nodes.find((node) => node.id === previousNodeId.current)
    const token = tokenRef.current
    previousNodeId.current = currentNode.id

    if (!fromNode || !token) {
      return
    }

    token.dataset.walking = 'true'
    const path = createPath(fromNode, currentNode)
    token.style.offsetPath = `path("${path}")`
    token.style.offsetDistance = '0%'
    void token.getBoundingClientRect()
    const frameId = requestAnimationFrame(() => {
      token.style.offsetDistance = '100%'
    })

    const timeoutId = window.setTimeout(() => {
      token.dataset.walking = 'false'
      setTokenNodeId(currentNode.id)
    }, 1800)

    return () => {
      cancelAnimationFrame(frameId)
      window.clearTimeout(timeoutId)
      token.dataset.walking = 'false'
    }
  }, [currentNode, nodes])

  function startPan(event: PointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest('button')) {
      return
    }

    event.currentTarget.setPointerCapture(event.pointerId)
    dragStart.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      offsetX: mapOffset.x,
      offsetY: mapOffset.y,
    }
  }

  function pan(event: PointerEvent<HTMLDivElement>) {
    const start = dragStart.current
    const surface = surfaceRef.current
    const content = contentRef.current
    if (!start || start.pointerId !== event.pointerId || !surface || !content) {
      return
    }

    const mapWidth = content.offsetWidth * mapScale
    const mapHeight = content.offsetHeight * mapScale
    const minX = Math.min(0, surface.clientWidth - mapWidth)
    const maxX = Math.max(0, surface.clientWidth - mapWidth)
    const minY = Math.min(0, surface.clientHeight - mapHeight)
    const maxY = Math.max(0, surface.clientHeight - mapHeight)
    setMapOffset({
      x: Math.max(minX, Math.min(maxX, start.offsetX + event.clientX - start.x)),
      y: Math.max(minY, Math.min(maxY, start.offsetY + event.clientY - start.y)),
    })
  }

  function stopPan(event: PointerEvent<HTMLDivElement>) {
    if (dragStart.current?.pointerId === event.pointerId) {
      dragStart.current = null
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  return (
    <section className="map-panel" aria-label="Farm map">
      <div
        ref={surfaceRef}
        className="map-surface"
        onPointerDown={startPan}
        onPointerMove={pan}
        onPointerUp={stopPan}
        onPointerCancel={stopPan}
        aria-label="Farm map. Drag to move the map."
      >
        <div
          ref={contentRef}
          className="map-content"
          style={{
            transform: `translate(${mapOffset.x}px, ${mapOffset.y}px) scale(${mapScale})`,
          }}
        >
        <svg className="map-paths" viewBox="0 0 720 940" aria-hidden="true">
          {nodes.slice(0, -1).map((node, index) => {
            const nextNode = nodes[index + 1]
            const path = createPath(node, nextNode)
            const status = getNodeStatus(node) === 'fixed' ? 'completed' : 'locked'

            return <path key={`${node.id}-${nextNode.id}`} className={`map-path ${status}`} d={path} />
          })}
        </svg>

        {nodes.map((node, index) => {
          const status = getNodeStatus(node)
          const style: CSSProperties = {
            left: `${node.position.x}px`,
            top: `${node.position.y}px`,
          }

          return (
            <div className={`node-anchor ${node.id}`} key={node.id} style={style}>
              <button
                type="button"
                className={`node-card ${status} ${node.id === selectedNodeId ? 'selected' : ''}`}
                aria-label={`${node.name}: ${status}`}
                disabled={status === 'locked'}
                onClick={() => onSelectNode(node)}
                onPointerDown={(event) => event.stopPropagation()}
              >
                <span className="node-meta">
                  <span className="node-badge">{index + 1}</span>
                  {status === 'locked' && (
                    <svg
                      className="lock-mark"
                      viewBox="0 0 16 16"
                      role="img"
                      aria-label="Locked"
                      shapeRendering="crispEdges"
                    >
                      <path d="M4 7V5a4 4 0 0 1 8 0v2h1v8H3V7h1Zm2 0h4V5a2 2 0 1 0-4 0v2Zm2 2a1 1 0 0 0-1 1c0 .4.2.7.5.9V13h1v-2.1c.3-.2.5-.5.5-.9a1 1 0 0 0-1-1Z" />
                    </svg>
                  )}
                  <span className="node-label">{node.name}</span>
                </span>
              </button>
              <span className={`building-sprite ${node.id} ${status}`} aria-hidden="true">
                <span className="building-roof" />
                <span className="building-body" />
                <span className="building-feature" />
                <span className="building-detail" />
              </span>
            </div>
          )
        })}

        {currentNode && (
          <div
            ref={tokenRef}
            className="player-token"
            data-walking="false"
            style={{
              left: '0px',
              top: '0px',
              offsetPath: `path("M ${currentNode.position.x + 60} ${currentNode.position.y + 84}")`,
              offsetDistance: '0%',
            }}
            aria-label={`Player at ${currentNode.name}`}
          >
            <span className="token-head" />
            <span className="token-body" />
            <span className="token-leg token-leg-left" />
            <span className="token-leg token-leg-right" />
            {(petAdopted ||
              (tokenNodeId === 'pet-barn' && currentNode.id !== 'seed-shed')) && (
              <>
                <span className="pet-companion raccoon" aria-hidden="true">
                  <span className="pet-ear" />
                  <span className="pet-mask" />
                  <span className="pet-tail" />
                </span>
                <span className="pet-speech" aria-live="polite">{petSpeech}</span>
              </>
            )}
          </div>
        )}
        </div>
      </div>
    </section>
  )
}

function createPath(fromNode: MapNode, toNode: MapNode): string {
  const startX = fromNode.position.x + 60
  const startY = fromNode.position.y + 84
  const endX = toNode.position.x + 60
  const endY = toNode.position.y + 84
  const controlX = (startX + endX) / 2
  const controlY = (startY + endY) / 2 + (endX >= startX ? -42 : 42)

  return `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`
}
