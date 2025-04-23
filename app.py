
from flask import Flask, render_template, request, redirect, send_from_directory
from flask_socketio import SocketIO, emit
import json
import random
import pandas as pd
import os
import csv
from werkzeug.utils import secure_filename

app = Flask(__name__)
socketio = SocketIO(app)
app.config['UPLOAD_FOLDER'] = 'uploads'

def load_config():
    with open("prize_config.json", "r", encoding="utf-8") as f:
        return json.load(f)

def save_config(config):
    with open("prize_config.json", "w", encoding="utf-8") as f:
        json.dump(config, f, ensure_ascii=False, indent=2)

def load_log():
    if not os.path.exists("draw_log.json"):
        return []
    with open("draw_log.json", "r", encoding="utf-8") as f:
        return json.load(f)

def save_log(log):
    with open("draw_log.json", "w", encoding="utf-8") as f:
        json.dump(log, f, ensure_ascii=False, indent=2)

def load_names():
    if os.path.exists("participants.csv"):
        df = pd.read_csv("participants.csv")
    else:
        df = pd.read_csv("sample_names.csv")
    return df.to_dict(orient="records")

@app.route("/")
def home():
    return "<h2>Web抽奖系统运行中，请访问 /display、/control 或 /register</h2>"

@app.route("/display")
def display():
    return render_template("display.html")

@app.route("/control")
def control():
    return render_template("control.html")

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        name = request.form["name"]
        file = request.files["avatar"]
        if file and name:
            filename = secure_filename(file.filename)
            save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(save_path)

            # 写入 CSV（编号自动生成）
            csv_path = "participants.csv"
            new_id = 1
            if os.path.exists(csv_path):
                with open(csv_path, newline='', encoding='utf-8') as f:
                    reader = list(csv.reader(f))
                    if len(reader) > 1:
                        new_id = int(reader[-1][0]) + 1
            with open(csv_path, "a", newline='', encoding="utf-8") as f:
                writer = csv.writer(f)
                if new_id == 1:
                    writer.writerow(["编号", "姓名", "头像"])
                writer.writerow([new_id, name, filename])

        return "<h3>✅ 注册成功！您已进入抽奖池</h3><p><a href='/register'>返回</a></p>"
    return render_template("register.html")

@socketio.on("connect")
def on_connect():
    emit("status", "已连接服务器")

@socketio.on("set_prize")
def on_set_prize(prize_name):
    config = load_config()
    config["当前奖项"] = prize_name
    save_config(config)
    socketio.emit("prize_updated", prize_name)

@socketio.on("start_draw")
def on_start_draw():
    config = load_config()
    log = load_log()
    names = load_names()
    current = config["当前奖项"]
    count = config["奖项列表"].get(current, {}).get("数量", 1)
    eligible = [n for n in names if str(n["编号"]) not in log]
    if len(eligible) < count:
        socketio.emit("draw_result", {"error": "人数不足"})
        return
    winners = random.sample(eligible, count)
    for w in winners:
        log.append(str(w["编号"]))
    save_log(log)
    socketio.emit("draw_result", {
        "winners": winners,
        "prize": current,
        "image": config["奖项列表"][current]["图片"]
    })

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000)
