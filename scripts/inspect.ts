import sharp from 'sharp';

const inputPath = 'C:/Users/Alam M/.gemini/antigravity/brain/d676647f-8732-4425-9d77-6be58ca23243/.user_uploaded/media_1791269585069.jpg';

async function inspectLogo() {
  const image = sharp(inputPath);
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const width = info.width;
  const height = info.height;

  // Let's sample a small crop around the S monogram:
  // Circle is around x: 166 to 430, y: 108 to 360
  // Let's check how flood-fill from outside works vs color keying!
  console.log('Image dimensions:', width, height);
}

inspectLogo();
