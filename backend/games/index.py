"""
API для управления играми: получение списка, добавление, удаление.
"""
import json
import os
import psycopg2
import psycopg2.extras

SCHEMA = "t_p81467236_torrent_game_downloa"

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def handler(event: dict, context) -> dict:
    method = event.get("httpMethod", "GET")
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if method == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    path = event.get("path", "/")
    
    # DELETE /games/{id}
    if method == "DELETE":
        game_id = path.rstrip("/").split("/")[-1]
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"DELETE FROM {SCHEMA}.games WHERE id = %s RETURNING id", (game_id,))
        deleted = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        if deleted:
            return {"statusCode": 200, "headers": cors, "body": {"success": True}}
        return {"statusCode": 404, "headers": cors, "body": {"error": "Not found"}}

    # POST /games — добавить игру
    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        title = body.get("title", "").strip()
        genre = body.get("genre", "").strip()
        year = int(body.get("year", 2024))
        rating = float(body.get("rating", 8.0))
        description = body.get("description", "").strip()
        tags = body.get("tags", [])
        color = body.get("color", "#c8a96e")

        if not title or not genre:
            return {"statusCode": 400, "headers": cors, "body": {"error": "title and genre required"}}

        conn = get_conn()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"""INSERT INTO {SCHEMA}.games (title, genre, year, rating, description, tags, color)
                VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING *""",
            (title, genre, year, rating, description, tags, color)
        )
        game = dict(cur.fetchone())
        game["tags"] = list(game["tags"]) if game["tags"] else []
        conn.commit()
        cur.close()
        conn.close()
        return {"statusCode": 201, "headers": cors, "body": game}

    # GET /games — список всех игр
    conn = get_conn()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(f"SELECT * FROM {SCHEMA}.games ORDER BY created_at DESC")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    games = []
    for row in rows:
        g = dict(row)
        g["tags"] = list(g["tags"]) if g["tags"] else []
        games.append(g)
    return {"statusCode": 200, "headers": cors, "body": games}