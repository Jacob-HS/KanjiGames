from flask import Blueprint, render_template
import json
views = Blueprint('views', __name__)
componentsToKanji = []
with open("ComponentsToKanji.json",encoding = "utf-8") as answerfile:
    componentsToKanji=str(answerfile.read())
finalDifficulty=[]
with open("FinalDifficulty.json",encoding = "utf-8") as answerfile:
        finalDifficulty=str(answerfile.read())
with open("Endless.json",encoding = "utf-8") as answerfile:
        endless=str(answerfile.read())
@views.route('/')
def home():
    return render_template("home.html")

@views.route('/radical-rush/mode-select')
def radicalRushModeSelect():
    return render_template("RRmodeSelect.html")

@views.route('/radical-rush/endless')
def radicalRushEndless(): 
    return render_template("radicalRushEndless.html", componentsToKanji=endless)

@views.route('/radical-rush/standard')
def radicalRushTrial():
    return render_template("radicalRush.html", componentsToKanji=componentsToKanji, finalDifficulty=finalDifficulty)

@views.route('/kanjitori/mode-select')
def kanjitoriModeSelect():
     return render_template("KTmodeSelect.html")