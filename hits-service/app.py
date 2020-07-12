from flask import Flask

import redis
import os

r = redis.Redis(decode_responses=True,
                password=os.environ.get("DB_PASSWORD", "right-lyrics"),
                host=os.environ.get("DB_HOST", "localhost"))

app = Flask(__name__)


def calculate_popularity(hits, total):
    hits = int(hits) if hits is not None else 0
    total = int(total) if total is not None else 0
    ratio = (hits * 5 // total) if total is not 0 else 0

    return str(round(ratio, 2))


@app.route("/api/popularity/<id>")
def get_popularity(id=0):
    try:
        return calculate_popularity(r.get(id), r.get('total'))
    except redis.ConnectionError:
        return 'Error', 500


@app.route("/api/hits/<id>")
def hit(id):
    try:
        r.setnx(id, 0)
        r.incr(id, 1)

        r.setnx("total", 0)
        r.incr("total", 1)

        return calculate_popularity(r.get(id), r.get('total'))
    except redis.ConnectionError:
        return 'Error', 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
