CREATE TABLE t_p81467236_torrent_game_downloa.games (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  genre VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  rating NUMERIC(3,1) NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  color VARCHAR(20) DEFAULT '#c8a96e',
  created_at TIMESTAMP DEFAULT NOW()
);