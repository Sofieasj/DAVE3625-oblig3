import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'

import type { MapNode } from '../data/nodes'
import type { NodeStatus } from '../game/state'

type OverworldMapProps = {
  nodes: MapNode[]
  getNodeStatus: (node: MapNode) => NodeStatus
  selectedNodeId: string
  isComplete: boolean
  petVariant: 'dog' | 'raccoon'
  petSpeech: string
  onSelectNode: (node: MapNode) => void
}

export function OverworldMap({
  nodes,
  getNodeStatus,
  selectedNodeId,
  isComplete,
  petVariant,
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
  const mapScale = isComplete ? 1.18 : 1

  useEffect(() => {
    if (!isComplete || !surfaceRef.current) {
      return
    }

    const surface = surfaceRef.current
    const minX = Math.min(...nodes.map((node) => node.position.x))
    const minY = Math.min(...nodes.map((node) => node.position.y))
    const maxX = Math.max(...nodes.map((node) => node.position.x + 120))
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

    const path = createPath(fromNode, currentNode)
    token.style.offsetPath = `path("${path}")`
    token.style.offsetDistance = '0%'
    void token.getBoundingClientRect()
    requestAnimationFrame(() => {
      token.style.offsetDistance = '100%'
    })
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
            <button
              key={node.id}
              type="button"
              className={`node-card ${status} ${node.id === selectedNodeId ? 'selected' : ''}`}
              style={style}
              aria-label={`${node.name}: ${status}`}
              disabled={status === 'locked'}
              onClick={() => onSelectNode(node)}
              onPointerDown={(event) => event.stopPropagation()}
            >
              <span className="node-badge">{index + 1}</span>
              <span className="node-label">{node.name}</span>
              {node.id === 'solar-roof' && status === 'fixed' && (
                <span className="installed-panels" aria-label="Solar panels installed">
                  <span />
                  <span />
                  <span />
                </span>
              )}
              {status === 'locked' && <span className="lock-mark" aria-hidden="true">LOCKED</span>}
              {status === 'current' && <span className="alert-mark" aria-hidden="true">!</span>}
            </button>
          )
        })}

        {currentNode && (
          <div
            ref={tokenRef}
            className="player-token"
            style={{
              left: `${currentNode.position.x + 48}px`,
              top: `${currentNode.position.y + 14}px`,
            }}
            aria-label={`Player at ${currentNode.name}`}
          >
            <span className="token-head" />
            <span className="token-body" />
            <span className={`pet-companion ${petVariant}`} aria-hidden="true">
              <span className="pet-ear" />
              <span className="pet-mask" />
              <span className="pet-tail" />
            </span>
            <span className="pet-speech" aria-live="polite">{petSpeech}</span>
          </div>
        )}
        </div>
      </div>
    </section>
  )
}

function createPath(fromNode: MapNode, toNode: MapNode): string {
  const startX = fromNode.position.x + 60
  const startY = fromNode.position.y + 31
  const endX = toNode.position.x + 60
  const endY = toNode.position.y + 31
  const controlX = (startX + endX) / 2
  const controlY = (startY + endY) / 2 + (endX >= startX ? -42 : 42)

  return `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`
}
