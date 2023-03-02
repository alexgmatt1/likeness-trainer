"""
Pre-generates CLIP embeddings for images in the "output" directory and pickles the embeddings to "res.pkl".
"""

import torch
import clip
import os
import pickle
from tqdm import tqdm

from PIL import Image

device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load("ViT-B/32", device=device)

res = []
with torch.no_grad():
    for f in tqdm(os.listdir("output")):
        if f.endswith(".png"):
            img = preprocess(Image.open(f"output/{f}")).unsqueeze(0).to(device)
            img_features = model.encode_image(img)
            res.append({ "img": f, "features": list(img_features.numpy().flatten()) })

with open("res.pkl", "wb") as f:
    pickle.dump(res, f)

print("Dumped output to res.pkl")
