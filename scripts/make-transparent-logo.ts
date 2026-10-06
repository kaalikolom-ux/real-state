import sharp from 'sharp';

const inputPath = 'C:/Users/Alam M/.gemini/antigravity/brain/d676647f-8732-4425-9d77-6be58ca23243/.user_uploaded/media_1791269585069.jpg';

async function generateLogos() {
  const image = sharp(inputPath);
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  // 1. Content bounds excluding outer frame border
  let minX = width, maxX = 0, minY = height, maxY = 0;
  for (let y = 30; y < height - 30; y++) {
    for (let x = 30; x < width - 30; x++) {
      const idx = (y * width + x) * 3;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      if (r < 240 || g < 240 || b < 240) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  // Padding
  const pad = 10;
  const cropX = Math.max(0, minX - pad);
  const cropY = Math.max(0, minY - pad);
  const cropW = Math.min(width - cropX, maxX - minX + pad * 2);
  const cropH = Math.min(height - cropY, maxY - minY + pad * 2);

  console.log('Cropping bounds:', { cropX, cropY, cropW, cropH });

  const cropped = await sharp(inputPath)
    .extract({ left: cropX, top: cropY, width: cropW, height: cropH })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const cData = cropped.data;
  const cW = cropped.info.width;
  const cH = cropped.info.height;

  // Buffer for light logo (black text) and dark logo (white text)
  const lightData = Buffer.from(cData);
  const darkData = Buffer.from(cData);

  // We want to remove all white background.
  // Whiteness is based on how close min(r, g, b) is to 255.
  // Let's use smooth transparency:
  for (let y = 0; y < cH; y++) {
    for (let x = 0; x < cW; x++) {
      const idx = (y * cW + x) * 4;
      const r = cData[idx];
      const g = cData[idx + 1];
      const b = cData[idx + 2];

      const minVal = Math.min(r, g, b);

      let alpha = 255;
      if (minVal >= 250) {
        alpha = 0;
      } else if (minVal >= 215) {
        // Smooth transition between 215 and 250
        alpha = Math.round(255 * (1 - (minVal - 215) / (250 - 215)));
      }

      lightData[idx + 3] = alpha;
      darkData[idx + 3] = alpha;

      if (alpha > 0) {
        // De-blend from white background for crisper edges
        const invA = (255 - alpha) / 255;
        const debR = Math.max(0, Math.min(255, Math.round((r - 255 * invA) / (alpha / 255))));
        const debG = Math.max(0, Math.min(255, Math.round((g - 255 * invA) / (alpha / 255))));
        const debB = Math.max(0, Math.min(255, Math.round((b - 255 * invA) / (alpha / 255))));

        lightData[idx] = debR;
        lightData[idx + 1] = debG;
        lightData[idx + 2] = debB;

        // For dark logo:
        // If the pixel is dark/black text (e.g. max(r,g,b) < 100), change to bright white #FFFFFF
        // Note: the emblem has orange (r > 150, g ~ 80, b < 50), buildings (gray), butterflies (orange/black)
        // Text "Subaiya" is in x > 250 and y > 80. "asset development ltd." is in x > 150 and y > 230.
        const isEmblem = x < 280 && y < 240;
        const isButterfly = x > 490 && y < 180;

        if (!isEmblem && !isButterfly) {
          // It's part of the text! If it's dark text:
          if (debR < 110 && debG < 110 && debB < 110) {
            darkData[idx] = 255;
            darkData[idx + 1] = 255;
            darkData[idx + 2] = 255;
          } else {
            darkData[idx] = debR;
            darkData[idx + 1] = debG;
            darkData[idx + 2] = debB;
          }
        } else {
          darkData[idx] = debR;
          darkData[idx + 1] = debG;
          darkData[idx + 2] = debB;
        }
      }
    }
  }

  // Save light transparent logo
  await sharp(lightData, { raw: { width: cW, height: cH, channels: 4 } })
    .png()
    .toFile('public/logo.png');

  // Save dark transparent logo
  await sharp(darkData, { raw: { width: cW, height: cH, channels: 4 } })
    .png()
    .toFile('public/logo-dark.png');

  console.log('Successfully generated public/logo.png and public/logo-dark.png!');
}

generateLogos();
