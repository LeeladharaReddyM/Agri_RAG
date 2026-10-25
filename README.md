# AgriRAG - Smart Farming Assistant

B.Tech AIML final year major project, Malla Reddy University.

Web front end for the AgriRAG pipeline: a farmer asks a question, the system retrieves the most relevant agronomy knowledge by cosine similarity and returns action steps with sources.

## Features
- Chat advisor with voice input and read-aloud
- Fertilizer calculator and crop calendar
- Searchable knowledge base, saved advice
- Sample weather and mandi price cards (live APIs are future scope)

## Files
- index.html - page structure
- style.css - styling
- script.js - retrieval (TF-IDF + cosine), chat, tools

## Run
Open index.html in Chrome. For voice input use the hosted link (GitHub Pages).

## Scope
Browser demo uses TF-IDF retrieval. The notebook uses sentence-transformers embeddings. LLM generation and live data are future work.
