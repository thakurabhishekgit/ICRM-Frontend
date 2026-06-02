import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { getPropertyThumbnailUrl } from '../../utils/propertyImages';

const PropertyThumbnail = ({
  thumbnailUrl,
  seed,
  alt = 'Property',
  height = 200,
  maxHeight,
  sx = {},
  imgSx = {},
}) => {
  const resolved = getPropertyThumbnailUrl(thumbnailUrl, seed, maxHeight || height || 800);
  const fallback = getPropertyThumbnailUrl(null, seed, maxHeight || height || 800);
  const [src, setSrc] = useState(resolved);

  useEffect(() => {
    setSrc(resolved);
  }, [resolved]);

  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      onError={() => {
        if (src !== fallback) setSrc(fallback);
      }}
      sx={{
        width: '100%',
        height: maxHeight ? undefined : height,
        maxHeight: maxHeight || undefined,
        objectFit: 'cover',
        display: 'block',
        ...sx,
        ...imgSx,
      }}
    />
  );
};

export default PropertyThumbnail;
