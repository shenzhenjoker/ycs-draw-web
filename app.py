from flask import Flask
app = Flask(__name__)
@app.route('/')
def index(): return '✅ Flask 正常运行！'