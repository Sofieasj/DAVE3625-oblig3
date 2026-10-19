export type MapNode = {
  id: string
  name: string
  position: { x: number; y: number }
  unlocks: string | null
  exerciseIds: string[]
}

export const mapNodes: MapNode[] = [
  {
    id: 'seed-shed',
    name: 'Seed Shed',
    position: { x: 120, y: 220 },
    unlocks: 'water-pump',
    exerciseIds: ['seed-shed-1'],
  },
  {
    id: 'water-pump',
    name: 'Water Pump',
    position: { x: 310, y: 160 },
    unlocks: 'windmill',
    exerciseIds: ['water-pump-1'],
  },
  {
    id: 'windmill',
    name: 'Windmill',
    position: { x: 500, y: 260 },
    unlocks: null,
    exerciseIds: [],
  },
]
