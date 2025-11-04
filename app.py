import os
import google.generativeai as genai
from flask import Flask, render_template, request, jsonify, redirect, url_for
from dotenv import load_dotenv
import backend  # Assuming you have a backend.py file

# Load environment variables from .env file
load_dotenv(encoding='latin-1')  # Try with latin-1 encoding for Windows compatibility

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False  # Handle non-ASCII characters in JSON responses

# --- FIXED GEMINI CONFIGURATION ---

# Define model in the global scope so routes can access it
model = None 

# Gemini API Configuration
try:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in environment variables")
    
    # 1. Initialize the Gemini client
    genai.configure(api_key=api_key)
    
    # 2. Create the MODEL (not a client)
    #    Using 'gemini-1.5-flash' as it's a valid and fast model
    model = genai.GenerativeModel('gemini-2.5-flash')
    
    # 3. Test the model directly
    test_response = model.generate_content(
        "What is Ayurveda?",
    )
    
    if test_response and hasattr(test_response, 'text'):
        print("Test response:", test_response.text)
        print("Gemini model configured successfully.")
    else:
        raise Exception("Test response failed")
        
except Exception as e:
    print(f"Error configuring Gemini model: {str(e)}")

# --- END OF FIX ---


plants = [
    {
        "name": "Bamboo",
        "info": "Bamboo is the fastest-growing plant on Earth.",
        "advantages": "Strong, eco-friendly, and sustainable.",
        "disadvantages": "Can become invasive if not managed.",
        "uses": "Used for building, paper, and textile production.",
        "benefits": "Improves soil and air quality.",
        "model": "https://sketchfab.com/models/a02bf0e3ffe44617ad49daf3cd94fe59/embed",
        "image": "https://tse2.mm.bing.net/th/id/OIP.vY975J-GwWplXsDN8Xp56QHaHa?pid=Api&P=0&h=180"
    },
    {
    "name": "Kadamba",
    "info": "Kadamba is a tropical tree known for its fragrant flowers and cultural significance in India.",
    "advantages": "Beautiful flowers, supports biodiversity, culturally significant.",
    "disadvantages": "Needs proper space; can grow large.",
    "uses": "Ornamental tree, religious and cultural purposes.",
    "benefits": "Adds aesthetic value, attracts pollinators, used in traditional ceremonies.",
    "model": "https://sketchfab.com/models/437e2e93786e44069aa5fdce3128ced2/embed",
    "image": "https://kadiyamrajasrinursery.com/cdn/shop/products/cadambaburflower-treekadamcadambakadamba-tree-1-live-healthy-plant-kadiyam-nursery-3_1000x667.jpg?v=1672226582"
},
{
        "name": "Ginger",
        "info": "Ginger is a popular spice with powerful medicinal properties.",
        "advantages": "Helps digestion, reduces nausea, fights cold and flu.",
        "disadvantages": "May cause heartburn if consumed in excess.",
        "uses": "Used in cooking, teas, and Ayurvedic medicine.",
        "benefits": "Anti-inflammatory, boosts immunity, improves metabolism.",
        "model": "https://sketchfab.com/models/de8da99c3c1742708cd4ea858750b881/embed",
        "image": "https://cdn.pixabay.com/photo/2023/03/30/21/06/ginger-7888804_1280.jpg"
    }

]

@app.route('/')
def home():
    return render_template('index.html', plants=plants)

@app.route('/login-page')
def login_page():
    return backend.show_login_page()

@app.route('/mental')
def mental():
    return render_template('mental.html')

@app.route('/oral')
def oral():
    return render_template('oral.html')


@app.route('/respiratory')
def respiratory():
    return render_template('respiratory.html')

@app.route('/skin')
def skin():
    return render_template('skin.html')

@app.route('/immunity')
def immunity():
    return render_template('immunity.html')

@app.route('/login', methods=['POST'])
def login():
    return backend.handle_login(request)
    
@app.route("/doctor")
def doctor():
    return render_template("doctor.html")


@app.route('/api/search')
def search_plants():
    query = request.args.get('q', '').lower()
    if not query:
        return jsonify([])
    results = [
        {
            "name": p["name"],
            "info": p.get("info", ""),
            "advantages": p.get("advantages", ""),
            "disadvantages": p.get("disadvantages", ""),
            "uses": p.get("uses", ""),
            "benefits": p.get("benefits", ""),
            "model": p.get("model", ""),
            "image": p.get("image", "")
        }
        for p in plants if query in p["name"].lower()
    ]
    return jsonify(results)


# --- FIXED CHAT ENDPOINT ---
@app.route('/chat', methods=['POST'])
def handle_chat():
    print("Received chat request")  # Debug log
    
    # Check for the 'model' object, not 'client'
    if not model:
        print("Error: Gemini model not initialized")
        return jsonify({"reply": "The AI assistant is not available right time. Please check your API key and try again."}), 500

    try:
        if not request.is_json:
            return jsonify({"reply": "Invalid request format"}), 400
            
        user_message = request.json.get('message')
        if not user_message:
            return jsonify({"reply": "Please type a message"}), 400

        print(f"Processing message: {user_message}")  # Debug log
        
        # Format the prompt for Ayurvedic context
        prompt = f"""Based on Ayurvedic medicine, please answer: {user_message}
        Include traditional remedies and herbs if relevant.
        End with a medical disclaimer."""
        
        try:
            # Generate response using the 'model' object
            response = model.generate_content(
                contents=prompt
            )
            
            if response and hasattr(response, 'text'):
                print(f"Got response: {response.text[:100]}...")  # Debug log
                return jsonify({"reply": response.text})
            else:
                print("Error: Invalid response format")  # Debug log
                return jsonify({"reply": "I couldn't generate a proper response. Please try again."}), 500
                
        except Exception as model_error:
            print(f"Generation error: {str(model_error)}")
            return jsonify({
                "reply": "I'm having trouble generating a response. Please try a different question."
            }), 500

    except Exception as e:
        print(f"Request error: {str(e)}")
        return jsonify({
            "reply": "Sorry, something went wrong. Please try again."
        }), 500
# --- END OF FIX ---

if __name__ == "__main__":
    app.run(debug=True)