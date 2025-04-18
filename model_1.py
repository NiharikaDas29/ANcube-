# -*- coding: utf-8 -*-
"""Model_1

Automatically generated by Colab.

Original file is located at
    https://colab.research.google.com/drive/1pIRPdGtXCskOP_Xd_JQ1GjvOHtuwPWiT
"""

!pip install transformers diffusers datasets torch torchvision pandas scikit-learn sentencepiece

import pandas as pd
import torch
import torch.nn as nn
from transformers import T5Tokenizer, T5ForConditionalGeneration
from diffusers import StableDiffusionPipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score

df = pd.read_csv("/content/hotels_festivals_prompts (1).csv")


df.drop_duplicates(inplace=True)
df.dropna(subset=["Festival Name", "Hotel Name", "Prompt for DALL-E", "Caption"], inplace=True)


df["Festival Name"] = df["Festival Name"].str.lower().str.strip()
df["Hotel Name"] = df["Hotel Name"].str.lower().str.strip()
df["Prompt for DALL-E"] = df["Prompt for DALL-E"].str.lower().str.strip()
df["Caption"] = df["Caption"].str.lower().str.strip()


train_df, test_df = train_test_split(df, test_size=0.2, random_state=42)


device = "cuda" if torch.cuda.is_available() else "cpu"
model_name = "t5-small"
tokenizer = T5Tokenizer.from_pretrained(model_name)
model = T5ForConditionalGeneration.from_pretrained(model_name).to(device)


def generate_caption(festival, hotel, prompt):
    input_text = f"festival: {festival}, hotel: {hotel}, prompt: {prompt}"
    inputs = tokenizer(input_text, return_tensors="pt").to(device)
    outputs = model.generate(**inputs, max_length=50)
    return tokenizer.decode(outputs[0], skip_special_tokens=True)


true_captions = test_df["Caption"].tolist()
predicted_captions = [generate_caption(row["Festival Name"], row["Hotel Name"], row["Prompt for DALL-E"]) for _, row in test_df.iterrows()]


true_captions = [c.lower() for c in true_captions]
predicted_captions = [c.lower() for c in predicted_captions]

accuracy = accuracy_score(true_captions, predicted_captions) * 100
precision = precision_score(true_captions, predicted_captions, average="weighted") * 100

print(f" Caption Generation Accuracy: {accuracy:.2f}%")
print(f"Caption Generation Precision: {precision:.2f}%")

pipe = StableDiffusionPipeline.from_pretrained("CompVis/stable-diffusion-v1-4").to(device)

def generate_image(prompt):
    image = pipe(prompt).images[0]
    return image

example_prompt = test_df.iloc[0]["Prompt for DALL-E"]
generated_image = generate_image(example_prompt)

import matplotlib.pyplot as plt
plt.imshow(generated_image)
plt.axis("off")
plt.show()

!ls -l fine_tuned_t5

save_path = "/content/fine_tuned_t5"  # Ensure correct path
model.save_pretrained(save_path)
tokenizer.save_pretrained(save_path)
print(f"Model and tokenizer saved at {save_path}")

import shutil
from google.colab import files

shutil.make_archive("fine_tuned_t5", 'zip', "/content/fine_tuned_t5")


files.download("fine_tuned_t5.zip")