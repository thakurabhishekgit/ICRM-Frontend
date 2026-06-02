/** Curated commercial building photos (Unsplash, no upload service required). */
const BUILDING_IMAGES = [
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w={size}&q=80',
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w={size}&q=80',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w={size}&q=80',
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w={size}&q=80',
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w={size}&q=80',
  'https://images.unsplash.com/photo-1516156008625-3a9d6067fab3?auto=format&fit=crop&w={size}&q=80',
  'https://images.unsplash.com/photo-1477959858607-967e9929884b?auto=format&fit=crop&w={size}&q=80',
  'https://images.unsplash.com/photo-1565008576549-57569a49371d?auto=format&fit=crop&w={size}&q=80',
];

const PLACEHOLDER_HOSTS = ['example.com', 'placeholder.com', 'placehold.co', 'via.placeholder.com'];

const hashSeed = (seed) => {
  const str = String(seed ?? 'default');
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

/** Returns true when backend provided a usable thumbnail URL. */
export const isValidPropertyThumbnail = (url) => {
  if (url === null || url === undefined) return false;
  if (typeof url !== 'string') return false;

  const trimmed = url.trim();
  if (!trimmed || trimmed.toLowerCase() === 'null' || trimmed.toLowerCase() === 'undefined') {
    return false;
  }

  if (!/^https?:\/\//i.test(trimmed)) return false;

  try {
    const host = new URL(trimmed).hostname.toLowerCase();
    if (PLACEHOLDER_HOSTS.some((placeholder) => host === placeholder || host.endsWith(`.${placeholder}`))) {
      return false;
    }
  } catch {
    return false;
  }

  return true;
};

/**
 * Resolve a property image URL.
 * Uses backend thumbnail when valid; otherwise picks a stable building photo from seed (property id/title).
 */
export const getPropertyThumbnailUrl = (thumbnailUrl, seed = 'default', size = 800) => {
  if (isValidPropertyThumbnail(thumbnailUrl)) {
    return thumbnailUrl.trim();
  }

  const index = hashSeed(seed) % BUILDING_IMAGES.length;
  return BUILDING_IMAGES[index].replace('{size}', String(size));
};
