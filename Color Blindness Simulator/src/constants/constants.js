export const SIMULATION_MODES = [
  {
    id: 'original',
    name: 'Normal Vision',
    type: 'Trichromacy',
    description: 'Standard color perception showing the full visible light spectrum.',
    affected: 'None',
  },
  {
    id: 'protanopia',
    name: 'Protanopia',
    type: 'Dichromacy',
    description: 'Red-blindness: complete lack of red photoreceptors. Reds appear green/brown.',
    affected: 'Red cones (L-cone)',
  },
  {
    id: 'deuteranopia',
    name: 'Deuteranopia',
    type: 'Dichromacy',
    description: 'Green-blindness: complete lack of green photoreceptors. Greens appear reddish.',
    affected: 'Green cones (M-cone)',
  },
  {
    id: 'tritanopia',
    name: 'Tritanopia',
    type: 'Dichromacy',
    description: 'Blue-blindness: complete lack of blue photoreceptors. Blues appear green.',
    affected: 'Blue cones (S-cone)',
  },
  {
    id: 'achromatopsia',
    name: 'Achromatopsia',
    type: 'Monochromacy',
    description: 'Total color blindness: complete lack of color perception. Entirely grayscale.',
    affected: 'All color cones (Rod vision only)',
  }
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const SUPPORTED_FORMATS = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
