import sharp from 'sharp';

async function makeFavicon() {
  const image = sharp('public/logo.png');
  const metadata = await image.metadata();

  // Emblem circle is roughly from left 0 to 220, top 0 to 230
  await sharp('public/logo.png')
    .extract({ left: 0, top: 0, width: 230, height: 230 })
    .resize(64, 64)
    .png()
    .toFile('public/favicon.png');

  console.log('Generated public/favicon.png');
}

makeFavicon();
