import sys
from PIL import Image

def remove_white_bg(input_path, output_path, threshold=240):
    try:
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            # Change all white (also shades of whites)
            # pixels to transparent
            if item[0] > threshold and item[1] > threshold and item[2] > threshold:
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)

        img.putdata(newData)
        img.save(output_path, "PNG")
        print(f"Processed {input_path} -> {output_path}")
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

if __name__ == "__main__":
    remove_white_bg('images/cat_default.png', 'images/cat_default.png', 230)
    remove_white_bg('images/cat_with_mouse.png', 'images/cat_with_mouse.png', 230)
    remove_white_bg('images/mouse_tongue.png', 'images/mouse_tongue.png', 230)
