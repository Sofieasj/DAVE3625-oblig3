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
    position: { x: 60, y: 800 },
    unlocks: 'water-pump',
    exerciseIds: ['seed-shed-1'],
  },
  {
    id: 'water-pump',
    name: 'Water Pump',
    position: { x: 60, y: 470 },
    unlocks: 'windmill',
    exerciseIds: ['water-pump-1'],
  },
  {
    id: 'windmill',
    name: 'Windmill',
    position: { x: 270, y: 470 },
    unlocks: 'greenhouse',
    exerciseIds: ['windmill-1'],
  },
  {
    id: 'greenhouse',
    name: 'Greenhouse',
    position: { x: 270, y: 800 },
    unlocks: 'pet-barn',
    exerciseIds: ['greenhouse-1'],
  },
  {
    id: 'pet-barn',
    name: 'Pet Barn',
    position: { x: 480, y: 800 },
    unlocks: 'beacon',
    exerciseIds: ['pet-barn-1'],
  },
  {
    id: 'beacon',
    name: 'Beacon',
    position: { x: 480, y: 470 },
    unlocks: null,
    exerciseIds: [],
  },
]
