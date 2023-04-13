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
with open("shiritoriAnswers.json", encoding="utf-8") as answerfile:
    shiritoriAnswers=str(answerfile.read()) 
with open("jukugoFreq.json", encoding="utf-8") as freqfile:
    jukugoFreq=str(freqfile.read())     
with open("svgjson.json","r",encoding="utf-8") as svgfile:
    svgs=json.load(svgfile)
with open("vnJukugo.json","r",encoding="utf-8") as svgfile:
    vnJukugo=json.load(svgfile)

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

@views.route('/kanjitori/vs-cpu')
def kanjitoriCpu():
    return render_template("kanjitoriCPU.html", shiritoriAnswers=shiritoriAnswers, jukugoFreq=jukugoFreq)

@views.route('/drawn-out/mode-select')
def drawnOutModeSelect():
    return render_template("DOModeSelect.html")

@views.route('/drawn-out/standard')
def drawnOutStandard():
    return render_template("drawnOut.html", kanjisvgs=svgs, vnJukugo=vnJukugo)

@views.route('/drawn-out/duel-select')
def drawnOutDuelSelect():
    return render_template("drawnOutDuelSelect.html")