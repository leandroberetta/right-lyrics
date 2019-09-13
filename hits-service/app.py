from flask import Flask, request
import redis
import os

r = redis.Redis(decode_responses=True, password=os.environ["DB_PASSWORD"], host=os.environ["DB_HOST"])
app = Flask(__name__)

@app.route('/api/hits/<id>')
def get(id):
    try :
        return {"status": "0", "hits": str(r.get(id)), "total": str(r.get("total")), "message": "ok"}
    except redis.ConnectionError as e:
        return {"status": "-1", "message": str(e)}
    
@app.route('/api/popularity/<id>')
def get_popularity(id):
    try: 
        hits = int(r.get(id))
        total = int(r.get('total'))

        ratio = hits * 5 / total

        return {"status": "0", "popularity": str(round(ratio, 2)) + '/5', "message": "ok"}
    except redis.ConnectionError as e:
        return {"status": "-1", "message": str(e)}    

@app.route('/api/hits', methods=['POST'])
def hit():
    try:
        data = request.json

        r.setnx(data['id'], 0)
        r.incr(data['id'], 1)

        r.setnx('total', 0)
        r.incr('total', 1)

        return {"status": "0", "message": "ok"}
    except redis.ConnectionError as e:
        return {"status": "-1", "message": str(e)}


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)