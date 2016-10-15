from flask import Flask, jsonify, render_template, request
import json
import numpy 
import numpy.random as npr
import random as rm

app = Flask(__name__)

heights = {1:0.0, 2:0.1, 3:0.2, 4:0.3, 5:0.4, 6:0.5, 7:0.6, 8:0.7, 9:0.8, 10:0.9}

score = 0
deaths = 0

seq = []
seq_index = 0 

propMatrix = [[0.1 for x in range(700)] for y in range(10)] 


def checkLevel(v):
	for i in range(2, len(v)-1):
		if v[i-1]-v[i-2] > 0.3:
			v[i-1] = v[i-2] + 0.3
		elif v[i-2] == 0.0 and v[i-1] == 0.0 and v[i] == 0.0:
			v[i] = heights[npr.random_integers(2,10)]
 		else:
			v[i] = v[i]
	return v

# def createBlueprint(l):
# 	u = []
# 	for i in range(0,l):
# 		ri = npr.random_integers(1,10)
# 		if len(u) > 2 and u[i-1] == 0.0 and u[i-2] == 0.0 and ri == 1:
# 			u.append(heights[ri + npr.random_integers(1,9)])
# 		else:
# 			u.append(heights[ri])
# 	return checkLevel(u)

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
	u.append(heights[npr.random_integers(0,9)])
	for i in range(1,700):
		u.append(chooseNext(i-1))
	return u



def changeProb(v):
	p = 0.045 #temp
	for i in range(0, 10):
		for j in range(score-2, score+2):
			height = v[j]
			if i == height*10:
				propMatrix[i][j] = propMatrix[i][j] + p
			propMatrix[i][j] = propMatrix[i][j] - 0.005


# v = createBlueprint()
# x = [row[0] for row in propMatrix]
# print v
# deaths = 7
# score = 10
# changeProb(v)
# y = [row[9] for row in propMatrix]
# print sum(y)



def createNewLevel(blueprint):
	newLevel = []
	# for element in blueprint[:-1]:
	# 	incr = npr.random_integers(-10,10)
	# 	temp = round(element + incr)
	# 	if temp < 0:
	# 		newLevel.append(0.0)
	# 	elif temp >= 10:
	# 		newLevel.append(temp-10)
	# 	else:
	# 		newLevel.append(temp)

	return checkLevel(newLevel)

data = {}
data['vector'] = createBlueprint()


@app.route('/')
def index():
	return render_template('index.html')

@app.route('/level')
def get_level():
	vector = createBlueprint()
	return jsonify(result=vector)

@app.route('/post_level', methods=["GET", "POST"])
def post_level():
	vector = request.form["vector"]
	score = request.form["score"]
	changeProb(vector)
	death += 1
	return "ok"


if __name__ == '__main__':
    app.run(debug=True,port=5000)


