#2023.09.27.
#Shopping list 2.0
#-*- coding: utf-8 -*-

from flask import Flask, render_template, request, url_for, jsonify
import json

app = Flask(__name__)

data = [
    {"id":0,
     "name":"alma"},
    {"id":1,
     "name":"körte"}
    ]

@app.route('/')
def root():
    return render_template('index.html')

@app.route('/api', methods=['GET','POST','PUT','DELETE'])
def api():
    match request.method:
        case 'GET':
            return jsonify(data)
        case 'POST':
            request_data = request.get_json()
            request_data["id"]= len(data)
            data.append(request.get_json())
            print("DATA: ", data)
            return jsonify(data)
        case 'PUT':
            pass
        case 'DELETE':
            pass


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)