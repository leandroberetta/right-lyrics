from flask import Flask, request
import redis
import os

r = redis.Redis(decode_responses=True, 
                password=os.environ.get("DB_PASSWORD", "pass"), 
                host=os.environ.get("DB_HOST", "localhost"))

app = Flask(__name__)

@app.route("/health")
def health():
    return {"status": "0", "message": "OK"} 

@app.route("/api/hits/<id>")
def get(id):
    try :
        hits = r.get(id) if r.get(id) is not None else 0
        total = r.get("total") if r.get("total") is not None else 0

        return {"status": "0", "hits": str(hits), "total": str(total)}
    except redis.ConnectionError as e:
        return {"status": "-1", "message": str(e)}
    except:
        return {"status": "-1", "message": "Unexpected Error"} 
    
@app.route("/api/popularity/<id>")
def get_popularity(id):
    try: 
        print(id)
        hits = int(r.get(id)) if r.get(id) is not None else 0
        total = int(r.get("total")) if r.get("total") is not None else 0

        if (total is not 0):
            ratio = hits * 5 // total
        else:
            ratio = 0 

        return {"status": "0", "popularity": str(round(ratio, 2))}
    except redis.ConnectionError as e:
        return {"status": "-1", "message": str(e)}
    except Exception as e:
        print(e)
        return {"status": "-1", "message": "Unexpected Error"}    

@app.route("/api/hits", methods=["POST"])
def hit():
    try:
        data = request.json
        id = int(data["id"])

        r.setnx(id, 0)
        r.incr(id, 1)

        r.setnx("total", 0)
        r.incr("total", 1)

        hits = int(r.get(id))
        total = int(r.get("total"))

        ratio = hits * 5 / total

        return {"status": "0", "popularity": str(round(ratio, 2))}
    except redis.ConnectionError as e:
        return {"status": "-1", "message": str(e)}
    except Exception as e:
        print(e)
        return {"status": "-1", "message": "Unexpected Error"} 

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)