import os
import google.generativeai as genai

# Config
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyAS5cc5dwpWFTDbsFQRbARebHSDuGxjsAA")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
DB_PATH = os.getenv("DB_PATH", "ayurveda_demo.db")

# Gemini init
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel(GEMINI_MODEL)
