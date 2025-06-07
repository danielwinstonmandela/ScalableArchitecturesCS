import React, { useEffect, useState } from "react";
import { fetchSongs } from "../api/catalogApi";

export default function SongList({ onPlay }) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSongs()
      .then((data) => {
        setSongs(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading songs...</p>;
  if (!songs.length) return <p>No songs found.</p>;

  return (
    <div>
      <h2>Music Catalogue</h2>
      <ul>
        {songs.map((song) => (
          <li key={song.id}>
            <b>{song.title}</b> — {song.artist}{" "}
            <button onClick={() => onPlay(song.id)}>Play</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
