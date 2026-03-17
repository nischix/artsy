import { resolveAesthetic } from '../features/aesthetics/aestheticService';
import { AestheticType } from '../types/aesthetic';

export const useAesthetic = (username: string | null) => {
  if (!username) return 'noir';
  // Placeholder until user aesthetic fetching is implemented.
  return resolveAesthetic('noir') as AestheticType;
};