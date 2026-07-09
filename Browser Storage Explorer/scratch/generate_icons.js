const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '..', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// A generic blue database-style icon (valid PNG base64)
// We will write this base64 as the image content for all icons
const base64Png = 'iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAD0ElEQVR4nO2az2sTQRDFX8peqqKgB0t7EgoVetoieCgIeiv+g178B4qC/gMe9SCoF5ViDx5E7CUI/gEePLToQURUkB5K7aVo8aUp6aopszsbk22T7G7IbprtDx4s292dfbMzs7Pvzc4sxhhDkiRJkiRJkiSpPhhQA2gCeNjsuQDwEsCg2XMB4DGA381ee6ZmA2gD2CcjK81ee4HmA2gD2CcjN81ee4HmA7hGRt6YvXYfFv4P8B3A4z1+5x+AGfG5YvbaU9sE5K0A8E3c181ee4pWAHgj7l/MXnuKVgDYEvdF5v2lqV0C3ov7HzPvL03tEvBO3K+YeffV2iXgi7ifMvPuq7VLwDdxf2bm3Vdrl4C/4v7DzLuv1i4BAZl3lqZ2CQjJvLM0tUtAqMzvNPPuq7VHQD1z/6X4fs/Mu6+mDqD5v2H5v33tETArPnfMXntqj4C/4nPF7LWn9gj4I+6XzV57ap+ATXH/YebdR2uXgB1xPzPz7qO1S8B+fK6YvfbULgHvxf2bmXcfbfH3AG3+4TfO/1xX2wT8EfdTZt59tXYJeCfuV8y8+2rtEvBF3M+YeffV2iXgm7g/M/Puq7VLwDvi3jDzzlK1AWiJjO02e+0Fmr8DkpH7Zq+9QPMBrJGRn2avvUDzAWyTkVfNXnsB2gA2yciS2WsvwDoZWSsj/5i9dh/K/K/7G4BPAJ4DeNjsuQDwAsDjZj83G0C72V3xO98BvALwEsCrZq89k6RJkiRJkiRJkhrC/2vAzQD2ZcT9AegC2D5A/2bTf4n1N0K3DbgdwKGMuCcA+gC2D9C/Ofa/DbgewBMy4n4N6APYPkD/Zs3+twCXZMR9CegD2D5A/+bO/jcA12XEfQ3oA9g+QP/mwf63ANdkxH0O6APYPkD/5sn+twBPZMR9DOgD2D5A/+bN/rcAL8uIexPQB7B9gP7Ns/1vAV6WEfc4QB/A9gH6d739B8B1GXFPAPQBbB+gf/PsPwCuyYj7dUAW4bE+gP5dc/+n4v95wLp4/L0eYf0A/bvm/n+K/+cB/Yt14f6bY/0A/bvm/i/E//OA9UXs/yXWD9C/a+5/VPy7C1hbBq/3yHqA/l1z/1bx7y5gbQm43iHrAfp3zf13i393AWvLwPU+WQ/Qv2vuvyP+3QWsLQvWj8h6gP5dc/9n4t9dwNpFwPoNWQ/Qv2vuv1f8uwuI17B+V9YD9O+a+x8T/9sF1G8K1n/IeoD+XXP/I+LfXUC8Bq4PyHqA/l1z/zX//4yRJEmSJEmSJEkNYgxeH/wG1lV2q/Pj6lIAAAAASUVORK5CYII=';

const iconSizes = [16, 32, 48, 128];
iconSizes.forEach(size => {
  const filePath = path.join(iconsDir, `icon${size}.png`);
  fs.writeFileSync(filePath, Buffer.from(base64Png, 'base64'));
});

console.log('Successfully generated icon files.');
