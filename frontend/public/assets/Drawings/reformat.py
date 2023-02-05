# Put this code file in the same directory as the artist folder. Example: testfolder:{Artist1:{Drawing1:{...},...},reformat-to-D-X-Y-Z.py}
# Run under windows

# Remapping to indices:

# Assuming artists are named as Artist1, Artist2, etc.
artist_remap = {("Artist" + str(i)):i for i in range(1, 7 + 1)}

drawing_remap = {("Drawing" + str(i)):i for i in range(1, 3 + 1)}

#print(artist_remap)

photo_remap = {"100":1, "106":2, "242":3, "270":4, "354":5, "883":6, "1041":7, \
    "1195":8, "1204":9, "1237":10, "1344":11, "1501":12, "1527":13, "1955":14}

from PIL import Image
import sys

artist_unmap = {}
for (k, v) in artist_remap.items():
    artist_unmap[v] = k
    
drawing_unmap = {}
for (k, v) in drawing_remap.items():
    drawing_unmap[v] = k

photo_unmap = {}
for (k, v) in photo_remap.items():
    photo_unmap[v] = k

for i in range(1, 14 + 1):
    for j in range(1, 7 + 1):
        for k in range(1, 10 + 1):
            try:
                img = Image.open(artist_unmap[j] + "\\" + drawing_unmap[min(k, 3)] + "\\" + photo_unmap[i] + ".tif")
                img.save(photo_unmap[i] + "_" + str(j) + "_" + str(k) + ".png")
            except FileNotFoundError:
                pass