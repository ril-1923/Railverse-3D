import type { StationInfo, TrackInfo, InfrastructureInfo, CameraView } from '@/types';

export const STATIONS: StationInfo[] = [
  {
    id: 'central',
    name: 'Central Station',
    type: 'central',
    platformCount: 4,
    description:
      'A large modern railway hub with four platforms, passenger concourse, footbridge and waiting areas. Serves as the primary interchange of the network.',
    position: [0, 0, 0],
    connectedTrackIds: ['t-central-main', 't-central-mountain', 't-central-industrial', 't-central-yard-1', 't-central-yard-2'],
  },
  {
    id: 'mountain',
    name: 'Mountain Station',
    type: 'mountain',
    platformCount: 2,
    description:
      'A scenic alpine station nestled in the mountains. Two platforms with a shelter and panoramic views of the surrounding peaks.',
    position: [-120, 0, -90],
    connectedTrackIds: ['t-central-mountain', 't-mountain-curve'],
  },
  {
    id: 'industrial',
    name: 'Industrial Station',
    type: 'industrial',
    platformCount: 3,
    description:
      'A freight and cargo terminal with loading platforms, warehouses and a container storage yard. Handles goods movement across the region.',
    position: [110, 0, 60],
    connectedTrackIds: ['t-central-industrial', 't-industrial-yard-1', 't-industrial-yard-2'],
  },
];

export const TRACKS: TrackInfo[] = [
  {
    id: 't-central-main',
    type: 'straight',
    length: 320,
    startStationId: 'central',
    endStationId: null,
    description: 'Main straight track running east from Central Station through the valley.',
  },
  {
    id: 't-central-mountain',
    type: 'curved',
    length: 260,
    startStationId: 'central',
    endStationId: 'mountain',
    description: 'Curved mountain branch climbing from Central to Mountain Station.',
  },
  {
    id: 't-central-industrial',
    type: 'curved',
    length: 240,
    startStationId: 'central',
    endStationId: 'industrial',
    description: 'Curved freight branch connecting Central to the Industrial terminal.',
  },
  {
    id: 't-central-yard-1',
    type: 'yard',
    length: 90,
    startStationId: 'central',
    endStationId: null,
    description: 'Yard siding track at Central Station for rolling stock storage.',
  },
  {
    id: 't-central-yard-2',
    type: 'parallel',
    length: 90,
    startStationId: 'central',
    endStationId: null,
    description: 'Parallel yard track alongside the main platform tracks.',
  },
  {
    id: 't-mountain-curve',
    type: 'curved',
    length: 180,
    startStationId: 'mountain',
    endStationId: null,
    description: 'Scenic curve continuing past Mountain Station into the range.',
  },
  {
    id: 't-industrial-yard-1',
    type: 'yard',
    length: 70,
    startStationId: 'industrial',
    endStationId: null,
    description: 'Industrial loading siding beside the cargo warehouse.',
  },
  {
    id: 't-industrial-yard-2',
    type: 'bridge',
    length: 120,
    startStationId: 'industrial',
    endStationId: null,
    description: 'Bridge track crossing the river from the industrial yard.',
  },
];

export const INFRASTRUCTURE: InfrastructureInfo[] = [
  { id: 'inf-signal-1', type: 'signal', name: 'Main Signal A', description: 'Approach signal protecting Central Station eastbound.', stationId: 'central' },
  { id: 'inf-signal-2', type: 'signal', name: 'Mountain Signal', description: 'Signal at Mountain Station entry.', stationId: 'mountain' },
  { id: 'inf-crossing-1', type: 'crossing', name: 'Level Crossing 01', description: 'Road crossing on the main line near Central.', stationId: 'central' },
  { id: 'inf-pole-1', type: 'pole', name: 'Catenary Poles', description: 'Trackside electrification poles along the main line.', stationId: null },
  { id: 'inf-bridge-1', type: 'bridge', name: 'River Bridge', description: 'Steel truss bridge carrying track over the river.', stationId: 'industrial' },
  { id: 'inf-water-1', type: 'water-tower', name: 'Water Tower', description: 'Historic water tower near the industrial yard.', stationId: 'industrial' },
  { id: 'inf-bench-1', type: 'bench', name: 'Platform Benches', description: 'Passenger benches on Central Station platforms.', stationId: 'central' },
  { id: 'inf-display-1', type: 'display', name: 'Platform Displays', description: 'Departure displays above Central platforms.', stationId: 'central' },
  { id: 'inf-light-1', type: 'platform-light', name: 'Platform Lighting', description: 'Lighting masts illuminating the platforms.', stationId: 'central' },
  { id: 'inf-shed-1', type: 'shed', name: 'Maintenance Shed', description: 'Small maintenance shed near the yard.', stationId: 'central' },
];

export const CAMERA_VIEWS: CameraView[] = [
  { id: 'overview', name: 'Railway Overview', position: [80, 90, 120], target: [0, 0, 0] },
  { id: 'central-station', name: 'Central Station', position: [35, 25, 50], target: [0, 2, 0] },
  { id: 'mountain-station', name: 'Mountain Station', position: [-95, 30, -60], target: [-120, 2, -90] },
  { id: 'industrial-station', name: 'Industrial Station', position: [80, 25, 90], target: [110, 2, 60] },
  { id: 'railway-yard', name: 'Railway Yard', position: [20, 35, 25], target: [0, 0, 0] },
  { id: 'mountain-landscape', name: 'Mountain Landscape', position: [-150, 80, -140], target: [-120, 0, -90] },
];
