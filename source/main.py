#2023.09.27.
#Shopping list 2.0
#-*- coding: utf-8 -*-

from flask import Flask, render_template, redirect, request, url_for, jsonify, send_from_directory
import json
import time


app = Flask(__name__)

DATA = {"pending":[
    {"id":0,
     "name":"alma"},
    {"id":1,
     "name":"körte"}
    ],
    "ready": [],
    }

def save_data():
    global DATA
    with open("lista.json","wt",encoding="UTF-8") as f:
        print(DATA)
        json.dump(DATA,f, indent=4, ensure_ascii=False)

def load_data():
    global DATA
    with open("lista.json","rt", encoding="UTF-8") as f:
        DATA = json.load(f)


@app.route('/')
def root():
    return render_template('index.html')

@app.route('/img/<image>')
def get_img(image):
    return send_from_directory(app.static_folder+"/images", image)#, mimetype='image/vnd.microsoft.icon')

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(app.static_folder+'/images','favicon.ico', mimetype='image/vnd.microsoft.icon')

@app.route('/api/cmd', methods=['POST'])
def cmd():
    global DATA
    request_data = request.get_json()
    print(request_data)
    match request_data["cmd"]:
        case "save":
            save_data()
            return jsonify({"msg":"ok"})
        case "clear":
            DATA["ready"] = []
            return jsonify(DATA)

@app.route('/api/tobasket', methods=['PUT'])
def tobasket():
    print("/api/tobasket: PUT")
    request_data =request.get_json()
    print(request_data)
    for product in DATA["pending"]:
        if product["id"] == request_data["id"]:
            product.update(request_data)
            DATA["ready"].append(product)
            DATA["pending"].remove(product)
    return jsonify(DATA)

def generateID():
    id = int(time.time())
    #print("Generate id:", id)
    return id



@app.route('/api', methods=['GET','POST','PUT'])
def api():
    global DATA
    match request.method:
        case 'GET':
            print("/api: GET")

            return jsonify(DATA)
        case 'POST':
            # addProduct
            print("/api:POST")
            request_data = request.get_json()
            request_data["id"]= generateID()
            DATA["pending"].append(request_data)
            
            return jsonify(DATA)
        case 'PUT':
            print("/api: PUT")
            return "PUT"

@app.route('/api/delete/<productID>', methods=['DELETE'])
def delete_product(productID):
    for product in DATA["pending"]:
                if product["id"] == int(productID):
                    print("delete product: ", product)
                    DATA["pending"].remove(product)
    return jsonify(DATA)

if __name__ == '__main__':
    load_data()
    app.run(host='0.0.0.0', port=8080, debug=True)