import os
import re
import json
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import pdfplumber
import docx
import spacy
from spacy.matcher import PhraseMatcher

app = Flask(__name__)

# Load spaCy NLP model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    # Fallback if model isn't downloaded yet (e.g. during initialization)
    nlp = None

# Initialize PhraseMatcher for skills
matcher = None
skills_dict = {} # Maps lowercased skill to its original casing

def load_skills():
    global matcher, skills_dict, nlp
    if nlp is None:
        return
    
    skills_file = os.path.join(os.path.dirname(__file__), 'skills.json')
    if os.path.exists(skills_file):
        with open(skills_file, 'r') as f:
            skills_list = json.load(f)
        
        matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
        patterns = []
        for skill in skills_list:
            skills_dict[skill.lower()] = skill
            patterns.append(nlp.make_doc(skill))
        
        matcher.add("SKILLS", patterns)

# Try loading skills initially
if nlp:
    load_skills()

# Text extraction helpers
def extract_text_from_pdf(file_path):
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text

def extract_text_from_docx(file_path):
    doc = docx.Document(file_path)
    text = ""
    for para in doc.paragraphs:
        text += para.text + "\n"
    return text

def extract_text(file_path):
    _, ext = os.path.splitext(file_path)
    ext = ext.lower()
    if ext == '.pdf':
        return extract_text_from_pdf(file_path)
    elif ext in ['.docx', '.doc']:
        # Note: python-docx natively supports docx. .doc files might fail, 
        # but modern files use docx.
        return extract_text_from_docx(file_path)
    else:
        raise ValueError(f"Unsupported file extension: {ext}")

# NLP Parsing logic
def parse_resume_text(text):
    global nlp, matcher, skills_dict
    if nlp is None:
        # Load spaCy model lazily if not loaded yet
        nlp = spacy.load("en_core_web_sm")
        load_skills()

    doc = nlp(text)
    
    # 1. Extract Skills using PhraseMatcher
    skills = set()
    if matcher:
        matches = matcher(doc)
        for match_id, start, end in matches:
            span = doc[start:end]
            matched_skill = span.text.lower()
            if matched_skill in skills_dict:
                skills.add(skills_dict[matched_skill])
    
    # 2. Extract Education using NER and keywords
    institutions = []
    edu_keywords = ["university", "college", "institute", "school", "academy", "iit", "nit", "bits"]
    for ent in doc.ents:
        if ent.label_ == "ORG":
            ent_text = ent.text.strip().replace('\n', ' ')
            if any(kw in ent_text.lower() for kw in edu_keywords):
                # Clean up multiple whitespaces
                clean_ent = re.sub(r'\s+', ' ', ent_text)
                if clean_ent not in institutions and len(clean_ent) > 5:
                    institutions.append(clean_ent)

    # Regex search for degrees
    degree_pattern = r"\b(B\.?Tech|M\.?Tech|B\.?Sc|M\.?Sc|B\.?A|M\.?A|B\.?E|M\.?E|B\.?Com|M\.?Com|B\.?B\.?A|M\.?B\.?A|Ph\.?D|Bachelor of [A-Za-z ]+|Master of [A-Za-z ]+)\b"
    lines = text.split("\n")
    degrees = []
    for line in lines:
        matches = re.findall(degree_pattern, line, re.IGNORECASE)
        for m in matches:
            # Clean up degree names (e.g. remove trailing dot/spaces)
            clean_degree = m.strip()
            # Normalize common degrees
            if clean_degree.lower() == "btech":
                clean_degree = "B.Tech"
            elif clean_degree.lower() == "mtech":
                clean_degree = "M.Tech"
            elif clean_degree.lower() == "mba":
                clean_degree = "MBA"
                
            if clean_degree not in degrees:
                degrees.append(clean_degree)

    return {
        "skills": list(skills),
        "education": {
            "institutions": institutions,
            "degrees": degrees
        }
    }

@app.route('/parse', methods=['POST'])
def parse_resume():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected for uploading"}), 400
        
    temp_path = None
    try:
        # Save uploaded file to a temporary location
        filename = secure_filename(file.filename)
        temp_dir = os.path.join(os.path.dirname(__file__), 'temp')
        os.makedirs(temp_dir, exist_ok=True)
        temp_path = os.path.join(temp_dir, filename)
        file.save(temp_path)
        
        # Extract text and parse
        text = extract_text(temp_path)
        parsed_data = parse_resume_text(text)
        
        return jsonify(parsed_data), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
        
    finally:
        # Cleanup temporary file
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception as e:
                print(f"Failed to delete temp file {temp_path}: {e}")

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    print(f"Starting Resume Parser Flask service on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=False)
