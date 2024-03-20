from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

async def model(article: str):
  tokenizer = AutoTokenizer.from_pretrained("ProsusAI/finbert")
  model = AutoModelForSequenceClassification.from_pretrained("ProsusAI/finbert")
  inputs = tokenizer([article], return_tensors='pt')
  outputs = model(**inputs)
  predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)
  positive = predictions[:, 0].tolist()
  negative = predictions[:, 1].tolist()
  neutral = predictions[:, 2].tolist()
  return positive[0], negative[0], neutral[0]


