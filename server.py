from flask import Flask, render_template, request, redirect, url_for, jsonify
import backend 

app = Flask(__name__)

# -------------------------
# Sample user credentials (assuming this is managed in 'backend.py')
# -------------------------

# -------------------------
# Sample plant data
# -------------------------
plants = [
    {
        "name": "Neem",
        "info": "Neem is antibacterial and antifungal.",
        "advantages": "Boosts skin health, kills bacteria, purifies blood. Good for skin, boosts immunity, cleans teeth. Neem is very useful in Ayurveda because it keeps the body safe from infections. It has strong antibacterial and antifungal powers. Neem helps clean the skin, reduce pimples, improve oral health, and boost overall immunity.",
        "disadvantages": "Overuse may cause liver irritation. Neem is very bitter, and if eaten in large amounts it may cause nausea or stomach problems. Pregnant women and small children should avoid using it. Too much neem oil can also be harmful.",
        "uses": "Used in skin creams, shampoos, and oral care. Neem leaves, oil, and twigs are used — for skincare, making herbal medicines, toothpaste, and natural remedies.",
        "benefits": "Helps acne, dandruff, and oral hygiene. Neem helps treat acne, purify the blood, improve oral hygiene, and strengthen the body’s immunity.",
        "model": "https://sketchfab.com/models/0bdf53a9a7cf453981818c6a1a78e964/embed",
        "image": "https://upload.wikimedia.org/wikipedia/commons/3/32/Neem_leaves.jpg"
    },
    {
        "name": "Tulsi",
        "info": "Tulsi boosts immunity and reduces stress.",
        "advantages": "Rich in antioxidants and anti-inflammatory. Tulsi boosts immunity, helps relieve cold, cough, and respiratory problems. It has strong antibacterial, antifungal, and antioxidant properties that keep the body healthy.",
        "disadvantages": "May lower blood sugar too much in diabetics. Consuming too much Tulsi may lower blood sugar or cause mild stomach upset. Pregnant women should use it carefully.",
        "uses": "Used in herbal teas and ayurvedic medicines. Used as leaves, extracts, and in teas or Ayurvedic medicines to treat infections and improve overall health.",
        "benefits": "Relieves cold, cough, stress, and improves digestion. Improves immunity, reduces stress, purifies blood, supports heart health, and helps fight infections naturally.",
        "model": "https://sketchfab.com/models/bc7af890f8564e2a890acb1a26f91539/embed",
        "image": "https://upload.wikimedia.org/wikipedia/commons/f/f8/Ocimum_tenuiflorum_Tulsi.jpg"
    },
    {
        "name": "Aloe Vera",
        "info": "Aloe Vera heals skin and aids digestion.",
        "advantages": "Hydrates skin and improves gut health. Aloe Vera is widely known for its soothing and healing properties. It helps calm irritated skin, promotes faster healing of burns and wounds, moisturizes dry skin, and has antibacterial and anti-inflammatory effects. It also supports digestion and boosts the immune system.",
        "disadvantages": "Excessive intake can cause stomach cramps. Consuming too much Aloe Vera latex (the yellow sap) can cause stomach cramps or diarrhea. Some people may have allergic reactions to Aloe Vera gel or products. Pregnant women should avoid consuming large amounts internally.",
        "uses": "Used in gels, creams, and juices. Aloe Vera is used in multiple forms: as gel applied directly to the skin for burns and wounds, as juice for digestive health, in creams and lotions for skincare, and as a component in Ayurvedic medicines for overall wellness.",
        "benefits": "Soothes burns, acne, and improves skin glow. Aloe Vera helps heal burns and wounds, moisturizes and rejuvenates skin, improves digestion, purifies blood, strengthens immunity, and promotes overall health.",
        "model": "https://sketchfab.com/models/dc6f3211b32647dc830d7ff17a7eb807/embed",
        "image": "https://upload.wikimedia.org/wikipedia/commons/f/f7/Aloe_vera_flower.jpg"
    },
    {
        "name": "Ashwagandha",
        "info": "Ashwagandha reduces stress and improves strength.",
        "advantages": "Boosts energy and lowers cortisol. Ashwagandha helps reduce stress and anxiety, improves energy and stamina, and supports overall immunity. It has adaptogenic properties, meaning it helps the body cope with physical and mental stress.",
        "disadvantages": "May cause drowsiness if overused. High doses may cause stomach upset, diarrhea, or drowsiness. Pregnant women should avoid it, and people with certain medical conditions should consult a doctor before use.",
        "uses": "Used in supplements and tonics. Roots and leaves are commonly used in powders, capsules, teas, and Ayurvedic medicines.",
        "benefits": "Reduces stress, increases stamina, improves sleep. Reduces stress, boosts energy, improves mental focus, strengthens immunity, and supports overall well-being.",
        "model": "https://sketchfab.com/models/e8b7a84ecf47421c93967b22dc1cb91e/embed",
        "image": "https://upload.wikimedia.org/wikipedia/commons/e/e7/Withania_somnifera_plant.jpg"
    },
    {
    "name": "Bamboo",
    "info": "Bamboo is the fastest-growing plant on Earth.",
    "advantages": "Strong, eco-friendly, and sustainable.",
    "disadvantages": "Can become invasive if not managed.",
    "uses": "Used for building, paper, and textile production.",
    "benefits": "Improves soil and air quality.",
    "model": "https://sketchfab.com/models/a02bf0e3ffe44617ad49daf3cd94fe59/embed",
    "image": "https://upload.wikimedia.org/wikipedia/commons/3/30/Bamboo_forest.jpg"
    }

]
    
# -------------------------
# Routes
# -------------------------
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/login-page')
def login_page():
    return backend.show_login_page()

@app.route('/login', methods=['POST'])
def login():
    return backend.handle_login(request)

# --- FIXED API ROUTE: Returns all necessary data attributes ---
@app.route('/api/search')
def search_plants():
    query = request.args.get('q', '').lower()
    if not query:
        return jsonify([])
        
    results = [
        {
            "name": p["name"], 
            "info": p["info"], 
            "image": p["image"],
            "advantages": p["advantages"],
            "disadvantages": p["disadvantages"],
            "uses": p["uses"],
            "benefits": p["benefits"],
            "model": p["model"]
        }
        for p in plants if query in p["name"].lower()
    ]
    return jsonify(results)

@app.route('/api/plant/<name>')
def get_plant(name):
    plant = next((p for p in plants if p["name"].lower() == name.lower()), None)
    if not plant:
        return jsonify({"error": "Plant not found"}), 404
    return jsonify(plant)


if __name__ == "__main__":
    app.run(debug=True)
