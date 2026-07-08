// Color Vision Deficiency Simulation Matrices (sRGB space)
// Based on Viénot, Brettel and Mollon (1999) and standard color science approximations.

export const COLOR_MATRICES = {
  protanopia: [
    0.56667, 0.43333, 0.0,
    0.55833, 0.44167, 0.0,
    0.0,     0.24167, 0.75833
  ],
  deuteranopia: [
    0.625,   0.375,   0.0,
    0.7,     0.3,     0.0,
    0.0,     0.3,     0.7
  ],
  tritanopia: [
    0.95,    0.05,    0.0,
    0.0,     0.43333, 0.56667,
    0.0,     0.475,   0.525
  ],
  achromatopsia: [
    0.299,   0.587,   0.114,
    0.299,   0.587,   0.114,
    0.299,   0.587,   0.114
  ]
};
