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
    exerciseIds: ['seed-shed-1', 'seed-shed-2'],
  },
  {
    id: 'water-pump',
    name: 'Water Pump',
    position: { x: 60, y: 470 },
    unlocks: 'windmill',
    exerciseIds: ['water-pump-1', 'water-pump-2'],
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
    unlocks: 'solar-roof',
    exerciseIds: ['greenhouse-1', 'greenhouse-2'],
  },
  {
    id: 'solar-roof',
    name: 'Solar Roof',
    position: { x: 480, y: 640 },
    unlocks: 'pet-barn',
    exerciseIds: ['solar-roof-1'],
  },
  {
    id: 'pet-barn',
    name: 'Pet Barn',
    position: { x: 480, y: 800 },
    unlocks: 'beacon',
    exerciseIds: ['pet-barn-1', 'pet-barn-2'],
  },
  {
    id: 'beacon',
    name: 'Beacon',
    position: { x: 480, y: 470 },
    unlocks: null,
    exerciseIds: ['beacon-1', 'beacon-2'],
  },
]
