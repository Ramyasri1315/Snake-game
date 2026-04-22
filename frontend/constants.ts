import { Track } from './types';

export const GRID_SIZE = 20;
export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
export const GAME_SPEED_MS = 100; // Slightly faster for a more frantic feel

export const PLAYLIST: Track[] = [
  {
    id: '1',
    title: 'DATA_CORRUPTION.WAV',
    artist: 'SYS_ADMIN_OVERRIDE',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '6:12'
  },
  {
    id: '2',
    title: 'MEMORY_LEAK_DETECTED.MP3',
    artist: 'NULL_POINTER_EXCEPTION',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '7:05'
  },
  {
    id: '3',
    title: 'NEURAL_LINK_SEVERED.FLAC',
    artist: 'GHOST_IN_THE_MACHINE',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: '5:44'
  }
];
