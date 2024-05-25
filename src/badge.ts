import { makeBadge } from 'badge-maker';

export const createCountBadge = (...options: Parameters<typeof makeBadge>) =>
  makeBadge(...options);
