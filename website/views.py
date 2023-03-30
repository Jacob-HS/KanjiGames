from flask import Blueprint, render_template
import json
views = Blueprint('views', __name__)
componentsToKanji = []
finalDifficulty=[]
@views.route('/')
def home():
    return render_template("home.html")

@views.route('/radical-rush')
def radicalRush():
    global componentsToKanji
    with open("ComponentsToKanji.json",encoding = "utf-8") as answerfile:
        componentsToKanji=str(answerfile.read())
    with open("FinalDifficulty.json",encoding = "utf-8") as answerfile:
        finalDifficulty=str(answerfile.read())
    return render_template("radicalRush.html", componentsToKanji=componentsToKanji, finalDifficulty=finalDifficulty)
