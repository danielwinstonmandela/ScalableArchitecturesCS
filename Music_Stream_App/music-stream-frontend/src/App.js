import React from "react";
import SongList from "./components/SongList";
import { playSong } from "./api/playbackApi";
import { addSong } from "./api/catalogApi";

function App() {
  const handlePlay = async (songId) => {
    try {
      await playSong(songId);
      alert("Playing song ID: " + songId);
    } catch (error) {
      alert("Error playing song: " + error.message);
    }
  };

  const handleAddSong = async () => {
    const newSong = {
      title: "Song Title",
      artist: "Artist Name",
      album: "Album Name",
      duration: 180,
      genre: "Pop",
      tags: ["pop", "2024"],
    };

    try {
      const song = await addSong(newSong);
      console.log("Added:", song);
      alert("Song added successfully!");
    } catch (err) {
      alert("Error adding song: " + err.message);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>Simple Music Streaming</h1>
      <button onClick={handleAddSong}>Add Sample Song</button>
      <SongList onPlay={handlePlay} />
    </div>
  );
}

export default App;
