import sharp from 'sharp';

async function listComponents() {
  const image = sharp('public/logo.png');
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  const visited = new Uint8Array(width * height);
  const components: any[] = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pos = y * width + x;
      const idx = pos * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];

      if (a > 100 && r > 230 && g > 230 && b > 230 && visited[pos] === 0) {
        // BFS
        let count = 0;
        let cMinX = x, cMaxX = x, cMinY = y, cMaxY = y;
        const q = [x, y];
        visited[pos] = 1;
        let head = 0;

        while (head < q.length) {
          const cx = q[head++];
          const cy = q[head++];
          count++;

          if (cx < cMinX) cMinX = cx;
          if (cx > cMaxX) cMaxX = cx;
          if (cy < cMinY) cMinY = cy;
          if (cy > cMaxY) cMaxY = cy;

          for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const nx = cx + dx;
            const ny = cy + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const nPos = ny * width + nx;
              const nIdx = nPos * 4;
              if (
                visited[nPos] === 0 &&
                data[nIdx + 3] > 100 &&
                data[nIdx] > 230 &&
                data[nIdx + 1] > 230 &&
                data[nIdx + 2] > 230
              ) {
                visited[nPos] = 1;
                q.push(nx, ny);
              }
            }
          }
        }

        if (count > 10) {
          components.push({
            count,
            minX: cMinX,
            maxX: cMaxX,
            minY: cMinY,
            maxY: cMaxY,
            width: cMaxX - cMinX,
            height: cMaxY - cMinY,
          });
        }
      }
    }
  }

  console.log('White components found:', components);
}

listComponents();
