from litellm import completion
import os
from app.core.config import settings

os.environ["HUGGINGFACE_API_KEY"] = settings.HF_TOKEN
os.environ["HF_TOKEN"] = settings.HF_TOKEN

def test(model):
    try:
        completion(model=f"huggingface/{model}", messages=[{"role": "user", "content": "Hi"}], max_tokens=2)
        print("SUCCESS:", model)
    except Exception as e:
        print("FAIL:", model)

test("microsoft/Phi-3-mini-4k-instruct")
test("Qwen/Qwen2.5-7B-Instruct")
test("google/gemma-2-2b-it")
