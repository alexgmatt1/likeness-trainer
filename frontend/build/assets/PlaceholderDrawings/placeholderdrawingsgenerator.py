from PIL import Image, ImageDraw, ImageFont
for i in range(14):
    for j in range(7):
        for k in range(3):
            filename = "D" + "-" + str(i+1) + "-" + str(j+1) + "-" + str(k+1)
            filename = filename + ".tiff"
            img = Image.new('RGB', (448, 448))

            # generate placeholder text, delete if needed
            font = ImageFont.truetype("arial.ttf", 80)
            d = ImageDraw.Draw(img)
            d.text((10,10), filename, font=font, fill=(255, 255, 0))
            # ends

            img.save(filename)

# 448 x 448