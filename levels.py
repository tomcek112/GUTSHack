from flask import Flask, jsonify, render_template, request
import json
import numpy 
import numpy.random as npr
import random as rm

app = Flask(__name__)

heights = {1:0.0, 2:0.1, 3:0.2, 4:0.3, 5:0.4, 6:0.5, 7:0.6, 8:0.7, 9:0.8, 10:0.9}

score = 0
deaths = 0
highscore = 0
deathScores = []

seq = []
seq_index = 0 

propMatrix = [[0.1 for x in range(350)] for y in range(10)] 


def checkLevel(v):
	if v[0] > 0.3:
		v[0] = heights[npr.random_integers(0,2)]
	for i in range(2, len(v)):
		if v[i]-v[i-1] > 0.3:
			v[i] = v[i-1] + 0.3
		elif v[i-1]-v[i-2] > 0.3:
			v[i-1] = v[i-2] + 0.3
		elif v[i-2] < 0.2 and v[i-1] < 0.2 and v[i] < 0.2:
			v[i] = heights[npr.random_integers(3,10)]
		elif v[i-2] == v[i-1]:
			while v[i] == v[i-1]:
				v[i] = heights[npr.random_integers(1,10)]
 		else:
			v[i] = v[i]
	return v


def chooseNext(prev):
	diceRoll = rm.random()
	prev_col = [row[prev] for row in propMatrix]
	if diceRoll < prev_col[0]:
		return heights[1]
	elif diceRoll < sum(prev_col[0:2]):
		return heights[2]
	elif diceRoll < sum(prev_col[0:3]):
		return heights[3]
	elif diceRoll < sum(prev_col[0:4]):
		return heights[4]
	elif diceRoll < sum(prev_col[0:5]):
		return heights[5]
	elif diceRoll < sum(prev_col[0:6]):
		return heights[6]
	elif diceRoll < sum(prev_col[0:7]):
		return heights[7]
	elif diceRoll < sum(prev_col[0:8]):
		return heights[8]
	elif diceRoll < sum(prev_col[0:9]):
		return heights[9]
	else:
		return heights[10]

def createBlueprint():
	u = []
	u.append(heights[npr.random_integers(1,3)])
	if deaths % 5 == 0:
		for i in range(1, 350):
			u.append(heights[npr.random_integers(1,10)])
	else:
		for i in range(1,350):
			u.append(chooseNext(i-1))
	return checkLevel(u)


def changeProb(v):
	p = 0.045 #temp
	for i in range(0, 10):
		for j in range(score-2, score+2):
			height = v[j]
			if i == height*10:
				if (propMatrix[i][j] + p) < 1:
					propMatrix[i][j] = propMatrix[i][j] + p
				else:
					propMatrix[i][j] = 0.82
			propMatrix[i][j] = propMatrix[i][j] - 0.005
	checkProb()


def checkProb():
	for i in range(0, 10):
		col = [row[i] for row in propMatrix]
		if abs(1 - sum(row)) > 0.05:
			highestProb = max(col)
			highestProbIndex = col.index(highestProb)
			for i in range(0, len(col)):
				if i == highestProbIndex:
					col[i] = 0.73
				else:
					col[i] = 0.03



@app.route('/')
def index():
	global highscore
	global deathScores
	return render_template('index.html', highscore=highscore)

@app.route('/level')
def get_level():
	vector = createBlueprint()
	return jsonify(result=vector)

@app.route('/post_level', methods=["GET", "POST"])
def post_level():
	vector = request.form["vector"]
	global score 
	score =  int(request.form["score"])
	global highscore
	potHighscore = int(request.form["highscore"])
	global deathScores
	deathScores.append(potHighscore)
	if potHighscore > highscore:
		highscore = potHighscore
	changeProb(vector)
	global deaths
	deaths += 1
	return "ok"

@app.route('/scores')
def deathsFun():
	global highscore
	global deathScores
	ret = {"highscore": highscore, "deathScores": deathScores}
	return jsonify(ret)


if __name__ == '__main__':
    app.run(debug=True,port=5000)


