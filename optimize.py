import os
from PIL import Image
import sys

# Configuration
RAW_ASSETS_DIR = "raw_assets"
OUTPUT_DIR = "images"
QUALITY = 80

def optimize_images():
    # Ensure directories exist
    if not os.path.exists(RAW_ASSETS_DIR):
        os.makedirs(RAW_ASSETS_DIR)
        print(f"Created '{RAW_ASSETS_DIR}' folder. Put your original images here.")
        return

    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    # Process images
    processed_count = 0
    for file_name in os.listdir(RAW_ASSETS_DIR):
        if file_name.lower().endswith(('.png', '.jpg', '.jpeg', '.tiff', '.bmp')):
            input_path = os.path.join(RAW_ASSETS_DIR, file_name)
            base_name = os.path.splitext(file_name)[0]
            output_path = os.path.join(OUTPUT_DIR, base_name + ".webp")

            try:
                with Image.open(input_path) as img:
                    # Convert to RGB (in case of RGBA/P formats being saved as JPEG later, though WebP handles transparency)
                    # For WebP, RGBA is fine, but let's ensure it's handled correctly.
                    
                    print(f"Optimizing: {file_name} -> {base_name}.webp")
                    img.save(output_path, "webp", quality=QUALITY, method=6)
                    processed_count += 1
            except Exception as e:
                print(f"Error processing {file_name}: {e}")

    if processed_count == 0:
        print("No images found to process. Add files to 'raw_assets/'.")
    else:
        print(f"Successfully optimized {processed_count} images!")

if __name__ == "__main__":
    optimize_images()
