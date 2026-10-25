import json, os
import faiss
import streamlit as st
from sentence_transformers import SentenceTransformer

st.set_page_config(page_title="AgriRAG", page_icon="🌾", layout="centered")

SYSTEM = (
    "You are AgriRAG, an agriculture advisory assistant for Indian farmers. "
    "Answer ONLY using the provided context. Keep it short, simple and actionable, "
    "using numbered steps if useful. Cite source ids like [3]. "
    "If the context does not answer the question, say you are not sure and advise "
    "contacting the local agriculture officer or Krishi Vigyan Kendra. "
    "Never invent pesticide doses."
)

EXAMPLES = [
    "My rice leaves have diamond shaped spots, what should I do?",
    "How to collect soil sample for testing?",
    "Holes in maize leaves and droppings in the whorl",
    "How to claim crop insurance after flood?",
]


@st.cache_resource(show_spinner="Loading AgriRAG...")
def load():
    kb = json.load(open("kb.json", encoding="utf-8"))
    model = SentenceTransformer("all-MiniLM-L6-v2")
    emb = model.encode(
        [f"{d['topic']}. {d['text']}" for d in kb], normalize_embeddings=True
    ).astype("float32")
    index = faiss.IndexFlatIP(emb.shape[1])
    index.add(emb)
    return kb, model, index


def get_key():
    key = os.environ.get("ANTHROPIC_API_KEY")
    if not key:
        try:
            key = st.secrets["ANTHROPIC_API_KEY"]
        except Exception:
            key = None
    return key


def retrieve(q, k=3):
    qv = model.encode([q], normalize_embeddings=True).astype("float32")
    scores, ids = index.search(qv, k)
    return [(int(i), float(s)) for i, s in zip(ids[0], scores[0])]


def generate(q, hits):
    top = kb[hits[0][0]]
    key = get_key()
    if not key:
        return f"**{top['topic']}**: {top['text']}", False
    ctx = "\n\n".join(f"[{i}] {kb[i]['topic']}: {kb[i]['text']}" for i, _ in hits)
    try:
        import anthropic
        r = anthropic.Anthropic(api_key=key).messages.create(
            model="claude-sonnet-5-5",
            max_tokens=500,
            system=SYSTEM,
            messages=[{"role": "user", "content": f"Context:\n{ctx}\n\nFarmer question: {q}"}],
        )
        return r.content[0].text, True
    except Exception:
        return f"**{top['topic']}**: {top['text']}", False


kb, model, index = load()

st.title("🌾 AgriRAG")
st.caption("AI-powered agriculture advisory using Retrieval-Augmented Generation")

if "q" not in st.session_state:
    st.session_state.q = ""

st.write("Try an example:")
cols = st.columns(2)
for n, ex in enumerate(EXAMPLES):
    if cols[n % 2].button(ex, key=f"ex{n}", use_container_width=True):
        st.session_state.q = ex

q = st.text_input("Ask your farming question", key="q")

if q.strip():
    hits = retrieve(q.strip())
    with st.spinner("Finding advice..."):
        ans, used_llm = generate(q.strip(), hits)
    st.subheader("Advice")
    st.write(ans)
    if not used_llm:
        st.info("Showing the best matching passage (LLM answer unavailable).")
    with st.expander("Sources used"):
        for i, s in hits:
            st.markdown(f"**[{i}] {kb[i]['topic']}** (similarity {s:.2f})")
            st.write(kb[i]["text"])
    st.caption("For chemical doses and serious crop loss, confirm with your local agriculture officer or KVK.")
