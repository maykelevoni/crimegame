import sharp from "sharp";
import fs from "fs";
import path from "path";

const sizes = [192, 512];
const sourceIcon = path.join(process.cwd(), "src", "assets", "icon.svg");
const outputDir = path.join(process.cwd(), "public");

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate icons for each size
sizes.forEach((size) => {
  sharp(sourceIcon)
    .resize(size, size)
    .png()
    .toFile(path.join(outputDir, `icon-${size}x${size}.png`))
    .then(() => console.log(`Generated icon-${size}x${size}.png`))
    .catch((err) =>
      console.error(`Error generating icon-${size}x${size}.png:`, err)
    );
});
