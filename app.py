from flask import Flask, request, jsonify, send_from_directory
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson.objectid import ObjectId
from bson.json_util import dumps
import os
import json
import random

app = Flask(__name__)
CORS(app, supports_credentials=True)

# MongoDB Configuration
app.config["MONGO_URI"] = "mongodb://localhost:27017/game_dashboard"
mongo = PyMongo(app)

# Check MongoDB Connection
try:
    mongo.db.command("ping")
    print("✅ MongoDB connected successfully!")
except Exception as e:
    print("❌ Failed to connect to MongoDB:", e)

PUBLIC_FOLDER = "./public"
UPLOAD_FOLDER = os.path.join(PUBLIC_FOLDER, "word_images", "images")
UPLOAD_CHARACTER = os.path.join(PUBLIC_FOLDER, "word_images", "word_sprites")
WORD_DATA_FILE = os.path.join(PUBLIC_FOLDER, "word_images", "word_questions.json")
MATH_DATA_FILE = os.path.join(PUBLIC_FOLDER, "ninja_images", "ninja_questions.json")
BIRD_DATA_FILE = os.path.join(PUBLIC_FOLDER, "bird_images", "bird_questions.json")

os.makedirs(PUBLIC_FOLDER, exist_ok=True)
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(UPLOAD_CHARACTER, exist_ok=True)

# -------------------- STUDENT CRUD API --------------------

@app.route("/api/students/login", methods=["POST"])
def login_by_rollno():
    data = request.json
    rollno = data.get("rollno")
    student = mongo.db.students.find_one({"rollno": rollno})
    if student:
        student["_id"] = str(student["_id"])  # Convert ObjectId to string
        return jsonify(student), 200
    else:
        return jsonify({"message": "Roll number not found"}), 404


@app.route("/api/students", methods=["POST"])
def add_student():
    data = request.json
    if mongo.db.students.find_one({"rollno": data["rollno"]}):
        return jsonify({"message": "Roll number already exists"}), 400

    student_id = mongo.db.students.insert_one({
        "rollno": data["rollno"],
        "name": data["name"],
        "class": data["class"],
        "dob": data["dob"],
        "games": []
    }).inserted_id

    return jsonify({"message": "Student added", "id": str(student_id)}), 201


@app.route("/api/students", methods=["GET"])
def get_students():
    students = mongo.db.students.find()
    return dumps(students), 200


@app.route("/api/students/<student_id>", methods=["PUT"])
def update_student(student_id):
    data = request.json
    mongo.db.students.update_one({"_id": ObjectId(student_id)}, {"$set": {
        "name": data["name"],
        "class": data["class"],
        "dob": data["dob"]
    }})
    return jsonify({"message": "Student updated"}), 200


@app.route("/api/students/<student_id>", methods=["DELETE"])
def delete_student(student_id):
    mongo.db.students.delete_one({"_id": ObjectId(student_id)})
    return jsonify({"message": "Student deleted"}), 200

# -------------------- GAME SCORE API --------------------


@app.route("/api/gamescore", methods=["POST"])
def add_game_score():
    print("📥 Incoming request to /api/gamescore")

    rollno = request.cookies.get("rollno") 
    print("🍪 Roll number from cookies:", rollno)

    if not rollno:
        return jsonify({"error": "Roll number not found in cookies"}), 400

    data = request.get_json()
    print("📦 Request JSON body:", data)

    if not data or "game_id" not in data or "score" not in data or "date" not in data:
        return jsonify({"error": "Missing required fields"}), 400

    game_data = {
        "game_id": data["game_id"],
        "score": data["score"],
        "date": data["date"]
    }

    result = mongo.db.students.update_one({"rollno": rollno}, {"$push": {"games": game_data}})
    print("📌 Mongo update result:", result.modified_count)

    student = mongo.db.students.find_one({"rollno": rollno})
    print("👤 Student data:", student)

    played_games = {game["game_id"]: game for game in student.get("games", [])}
    total_score = sum(game["score"] for game in played_games.values())
    print("🎮 Played games:", played_games)
    print("📊 Total score:", total_score)

    if all(g in played_games for g in ["ninja", "bird", "word", "car", "plane"]):
        mongo.db.students.update_one({"rollno": rollno}, {
            "$set": {
                "final_score": total_score
            }
        })
        print("🏁 Final score updated")

    return jsonify({"message": "Score added"}), 200




@app.route("/api/performance", methods=["GET"])
def get_performance():
    students = mongo.db.students.find()
    performance_data = []
    for student in students:
        for game in student.get("games", []):
            performance_data.append({
                "student": student["name"],
                "game": game["game_id"],
                "score": game["score"],
                "date": game["date"]
            })
    return jsonify(performance_data)

# -------------------- WORD GAME TEMPLATE API --------------------


if not os.path.exists(WORD_DATA_FILE):
    with open(WORD_DATA_FILE, "w", encoding="utf-8") as file:
        json.dump({"selected_image": None, "words": []}, file, indent=4)


@app.route("/api/word/backgrounds", methods=["GET"])
def get_word_background_images():
    images = [f for f in os.listdir(UPLOAD_FOLDER) if f.endswith(("jpg", "jpeg", "png", "gif", "avif"))]
    return jsonify({"images": images})


@app.route("/api/word/characters", methods=["GET"])
def get_word_characters():
    characters = [f for f in os.listdir(UPLOAD_CHARACTER) if f.endswith(("jpg", "jpeg", "png", "gif", "avif"))]
    return jsonify({"images": characters})


@app.route("/api/word/uploads/background/<filename>")
def serve_word_background(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


@app.route("/api/word/uploads/character/<filename>")
def serve_word_character(filename):
    return send_from_directory(UPLOAD_CHARACTER, filename)


@app.route("/api/word/submit/background", methods=["POST"])
def submit_word_background():
    data = request.get_json()
    selected_image = data.get("image")
    if not selected_image:
        return jsonify({"message": "No image selected!"}), 400

    try:
        with open(WORD_DATA_FILE, "r+", encoding="utf-8") as file:
            content = json.load(file)
            content["selected_image"] = selected_image
            file.seek(0)
            json.dump(content, file, indent=4)
            file.truncate()
        return jsonify({"message": f"Selected background image saved: {selected_image}"}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500


@app.route("/api/word/submit/character", methods=["POST"])
def submit_word_character():
    data = request.get_json()
    selected_image = data.get("image")
    if not selected_image:
        return jsonify({"message": "No image selected!"}), 400

    try:
        with open(WORD_DATA_FILE, "r+", encoding="utf-8") as file:
            content = json.load(file)
            content["selected_character"] = selected_image
            file.seek(0)
            json.dump(content, file, indent=4)
            file.truncate()
        return jsonify({"message": f"Selected character image saved: {selected_image}"}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500


@app.route("/api/word/selected/background", methods=["GET"])
def get_selected_word_background():
    try:
        with open(WORD_DATA_FILE, "r", encoding="utf-8") as file:
            data = json.load(file)
            return jsonify({"selected_image": data.get("selected_image")})
    except:
        return jsonify({"selected_image": None})


@app.route("/api/word/selected/character", methods=["GET"])
def get_selected_word_character():
    try:
        with open(WORD_DATA_FILE, "r", encoding="utf-8") as file:
            data = json.load(file)
            return jsonify({"selected_character": data.get("selected_character")})
    except:
        return jsonify({"selected_character": None})


@app.route("/api/word/words", methods=["GET"])
def get_saved_words():
    try:
        with open(WORD_DATA_FILE, "r", encoding="utf-8") as file:
            data = json.load(file)
            return jsonify({"words": data.get("words", [])})
    except:
        return jsonify({"words": []})


@app.route("/api/word/words/add", methods=["POST"])
def save_word_entry():
    data = request.get_json()
    word = data.get("word", "").strip()
    emoji = data.get("emoji", "").strip()

    if not word or not emoji:
        return jsonify({"message": "Both word and emoji are required!"}), 400

    try:
        with open(WORD_DATA_FILE, "r+", encoding="utf-8") as file:
            content = json.load(file)
            content.setdefault("words", []).append({"word": word, "emoji": emoji})
            file.seek(0)
            json.dump(content, file, indent=4, ensure_ascii=False)
            file.truncate()
        return jsonify({"message": "Word saved successfully!"})
    except Exception as e:
        return jsonify({"message": str(e)}), 500


@app.route("/api/word/words/delete", methods=["POST"])
def remove_word_entry():
    data = request.get_json()
    word_to_remove = data.get("word", "").strip()

    try:
        with open(WORD_DATA_FILE, "r+", encoding="utf-8") as file:
            content = json.load(file)
            words = content.get("words", [])
            content["words"] = [w for w in words if w.get("word") != word_to_remove]
            file.seek(0)
            json.dump(content, file, indent=4, ensure_ascii=False)
            file.truncate()
        return jsonify({"message": "Word removed successfully!"})
    except Exception as e:
        return jsonify({"message": str(e)}), 500

# -------------------- NINJA GAME TEMPLATE API --------------------


if not os.path.exists(MATH_DATA_FILE):
    with open(MATH_DATA_FILE, "w", encoding="utf-8") as file:
        json.dump([], file, indent=4)

num_map = {str(i): f"{i}️⃣" for i in range(10)}
operator_map = {"+": "➕", "-": "➖", "*": "✖️", "/": "➗"}


def text_to_emoji_math(expression):
    return "".join(num_map.get(c, operator_map.get(c, c)) for c in expression)


def generate_math_question():
    num1 = random.randint(2, 10)
    num2 = random.randint(2, 10)
    operator = random.choice(["+", "-", "*", "/"])
    if operator == "/":
        num1 *= num2

    question = f"{num1} {operator} {num2}"
    answer = eval(question)

    options = {answer}
    while len(options) < 4:
        options.add(answer + random.randint(-5, 5))

    emoji_question = text_to_emoji_math(question)
    emoji_options = [text_to_emoji_math(str(opt)) for opt in options]
    emoji_answer = text_to_emoji_math(str(answer))

    return {
        "question": emoji_question,
        "options": emoji_options,
        "correctAnswer": emoji_answer,
        "emoji": emoji_answer
    }


@app.route("/api/ninja/questions", methods=["GET"])
def get_ninja_questions():
    try:
        with open(MATH_DATA_FILE, "r", encoding="utf-8") as file:
            return jsonify(json.load(file))
    except:
        return jsonify([])


@app.route("/api/ninja/questions/generate", methods=["POST"])
def generate_ninja_questions():
    data = request.get_json()
    num_questions = int(data.get("numQuestions", 5))
    questions = [generate_math_question() for _ in range(num_questions)]

    with open(MATH_DATA_FILE, "w", encoding="utf-8") as file:
        json.dump(questions, file, indent=4, ensure_ascii=False)

    return jsonify({"message": f"{num_questions} questions generated!", "questions": questions})


@app.route("/api/ninja/questions/add", methods=["POST"])
def add_ninja_question():
    data = request.get_json()
    question_text = data.get("question", "").strip()
    options = data.get("options", [])
    correct_answer = data.get("correctAnswer", "").strip()

    if not question_text or not options or not correct_answer:
        return jsonify({"message": "Invalid input!"}), 400

    emoji_question = text_to_emoji_math(question_text)
    emoji_options = [text_to_emoji_math(opt) for opt in options]
    emoji_correct = text_to_emoji_math(correct_answer)

    try:
        with open(MATH_DATA_FILE, "r+", encoding="utf-8") as file:
            questions = json.load(file)
            questions.append({
                "question": emoji_question,
                "options": emoji_options,
                "correctAnswer": emoji_correct,
                "emoji": emoji_correct
            })
            file.seek(0)
            json.dump(questions, file, indent=4, ensure_ascii=False)
            file.truncate()
        return jsonify({"message": "Question added successfully!"}), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 500


@app.route("/api/ninja/questions/delete", methods=["POST"])
def delete_ninja_question():
    data = request.get_json()
    index = data.get("index")

    try:
        with open(MATH_DATA_FILE, "r+", encoding="utf-8") as file:
            questions = json.load(file)
            if 0 <= index < len(questions):
                removed = questions.pop(index)
                file.seek(0)
                json.dump(questions, file, indent=4, ensure_ascii=False)
                file.truncate()
                return jsonify({"message": "Question deleted successfully!", "deleted": removed}), 200
            else:
                return jsonify({"message": "Invalid index!"}), 400
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    
# -------------------- BIRD GAME TEMPLATE API --------------------

def load_bird_questions():
    if os.path.exists(BIRD_DATA_FILE):
        with open(BIRD_DATA_FILE, 'r', encoding='utf-8') as file:
            return json.load(file)
    return {}


def save_bird_questions(data):
    with open(BIRD_DATA_FILE, 'w', encoding='utf-8') as file:
        json.dump(data, file, indent=4, ensure_ascii=False)


@app.route('/api/bird/questions', methods=['GET'])
def get_bird_questions():
    bird_questions = load_bird_questions()
    return jsonify(bird_questions)


@app.route('/api/bird/questions/add', methods=['POST'])
def add_bird_question():
    data = request.get_json()
    emoji = data.get('emoji')
    question = data.get('question')
    answer = data.get('answer')

    if not emoji or not question or not answer:
        return jsonify({"message": "Invalid data"}), 400

    bird_questions = load_bird_questions()

    bird_questions[emoji] = {"question": question, "answer": answer}
    
    save_bird_questions(bird_questions)

    return jsonify({"message": "Question added successfully."}), 200


@app.route('/api/bird/questions/delete', methods=['POST'])
def delete_bird_question():
    data = request.get_json()
    emoji = data.get('emoji')

    bird_questions = load_bird_questions()

    if emoji in bird_questions:
        del bird_questions[emoji]
        save_bird_questions(bird_questions)
        return jsonify({"message": "Question deleted successfully."}), 200
    else:
        return jsonify({"message": "Emoji not found."}), 404


# -------------------- START FLASK SERVER --------------------
if __name__ == "__main__":
    app.run(debug=True, port=5000)
