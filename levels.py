from flask import Flask, jsonify
import json
import numpy 
import numpy.random as npr
import random as rm

app = Flask(__name__)

score = 0

def createBlueprint(l):
	u = []
	for i in range(0,l-1):
		if len(u) > 2 and u[i-1] < 0.1 and u[i-2] < 0.1:
			u.append(round(rm.uniform(0.1,1),3 ))
		elif len(u) > 2 and u[i-1] > 0.1 and u[i-2] > 0.1:
			u.append(round(rm.uniform(0, 0.11), 3))
		else:
			u.append(round(rm.random(), 3))
	u.append(score)
	return u

def generateRand(n):
	return round(rm.uniform(-n, n), 3)


def createNewLevel(blueprint):
	newLevel = []
	n = rm.uniform(0.01, 0.09)
	for element in blueprint[:-1]:
		incr = generateRand(n)
		temp = round(incr + element, 3)
		if temp < 0:
			newLevel.append(0)
		elif temp >= 1:
			newLevel.append(temp-1)
		else:
			newLevel.append(temp)
	newLevel.append(0)
	return newLevel

test = createBlueprint(701)

data = {}
data['vector'] = test

@app.route('/')
def index():
	return jsonify(result=data)

if __name__ == '__main__':
    app.run(debug=true,port=5001)