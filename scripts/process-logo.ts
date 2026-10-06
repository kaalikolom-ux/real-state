import sharp from 'sharp';

const inputPath = 'C:/Users/Alam M/.gemini/antigravity/brain/d676647f-8732-4425-9d77-6be58ca23243/.user_uploaded/media_1791269585069.jpg';

async function processLogo() {
  const image = sharp(inputPath);
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  // 1. First, find content bounds (minX, maxX, minY, maxY) excluding the outer frame
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

  // Add small padding around the logo
  const pad = 12;
  const cropX = Math.max(0, minX - pad);
  const cropY = Math.max(0, minY - pad);
  const cropW = Math.min(width - cropX, maxX - minX + pad * 2);
  const cropH = Math.min(height - cropY, maxY - minY + pad * 2);

  console.log('Cropping to:', { cropX, cropY, cropW, cropH });

  // Extract cropped region into RGBA buffer
  const cropped = await sharp(inputPath)
    .extract({ left: cropX, top: cropY, width: cropW, height: cropH })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const cData = cropped.data;
  const cW = cropped.info.width;
  const cH = cropped.info.height;

  // Let's create a transparent version:
  // For each pixel, determine if it's background white
  // Note: in the stylized emblem:
  // The 'S' ribbon: is the 'S' white? Let's check:
  // The cursive 'S' shape inside the circle is white ribbon with burgundy shadow/border.
  // We want to make sure the white background is transparent, but if the 'S' is enclosed or distinct, does transparency hurt it?
  // Let's check flood fill vs whiteness threshold.
  
  // Flood fill from all outer edges to mark background pixels
  const isBg = new Uint8Array(cW * cH); // 0 = unknown, 1 = bg
  const queue: number[] = [];

  function isWhite(x: number, y: number): boolean {
    const idx = (y * cW + x) * 4;
    const r = cData[idx];
    const g = cData[idx + 1];
    const b = cData[idx + 2];
    // Background in JPEG can have noise (typically > 235)
    return r > 230 && g > 230 && b > 230;
  }

  // Seed with border pixels
  for (let x = 0; x < cW; x++) {
    if (isWhite(x, 0)) { queue.push(x, 0); isBg[0 * cW + x] = 1; }
    if (isWhite(x, cH - 1)) { queue.push(x, cH - 1); isBg[(cH - 1) * cW + x] = 1; }
  }
  for (let y = 0; y < cH; y++) {
    if (isWhite(0, y)) { queue.push(0, y); isBg[y * cW + 0] = 1; }
    if (isWhite(cW - 1, y)) { queue.push(cW - 1, y); isBg[y * cW + (cW - 1)] = 1; }
  }

  // BFS flood fill
  let head = 0;
  while (head < queue.length) {
    const qx = queue[head++];
    const qy = queue[head++];

    const neighbors = [
      [qx + 1, qy],
      [qx - 1, qy],
      [qx, qy + 1],
      [qx, qy - 1],
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < cW && ny >= 0 && ny < cH) {
        const nPos = ny * cW + nx;
        if (isBg[nPos] === 0 && isWhite(nx, ny)) {
          isBg[nPos] = 1;
          queue.push(nx, ny);
        }
      }
    }
  }

  // Also flood fill inner holes of letters like "b" and "a" if they are white
  // Let's check: any pixel with isBg === 1 has alpha = 0 (or smooth alpha at edges).
  // Also any pixel where all neighbors are white:
  for (let y = 0; y < cH; y++) {
    for (let x = 0; x < cW; x++) {
      const pos = y * cW + x;
      const idx = pos * 4;
      const r = cData[idx];
      const g = cData[idx + 1];
      const b = cData[idx + 2];

      const minVal = Math.min(r, g, b);

      if (isBg[pos] === 1) {
        // Pure background
        if (minVal >= 245) {
          cData[idx + 3] = 0;
        } else {
          // Antialiased edge
          const alpha = Math.max(0, Math.min(255, Math.round(255 - (minVal - 200) * (255 / 45))));
          cData[idx + 3] = alpha;
        }
      } else {
        // Pixel is inside or part of content
        // If it's very white AND near the edge of isBg, antialias it:
        if (minVal > 240) {
          // Check if it's adjacent to isBg
          let nearBg = false;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const ny = y + dy;
              const nx = x + dx;
              if (nx >= 0 && nx < cW && ny >= 0 && ny < cH && isBg[ny * cW + nx] === 1) {
                nearBg = true;
              }
            }
          }
          if (nearBg) {
            const alpha = Math.max(0, Math.min(255, Math.round(255 - (minVal - 220) * (255 / 35))));
            cData[idx + 3] = alpha;
          }
        }
      }
    }
  }

  // Save the result to public/logo.png
  await sharp(cData, { raw: { width: cW, height: cH, channels: 4 } })
    .png()
    .toFile('public/logo.png');

  console.log('Saved public/logo.png successfully!');
}

processLogo();
