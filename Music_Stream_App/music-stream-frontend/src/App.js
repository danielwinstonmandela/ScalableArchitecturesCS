import React from "react";
import SongList from "./components/SongList";
import AddSongForm from "./components/AddSongForm";
import { playSong } from "./api/playbackApi";

function App() {
  const handlePlay = async (songId) => {
    try {
      await playSong(songId);
      alert(`▶️ Playing song ID: ${songId}`);
    } catch (error) {
      alert("❌ Error playing song: " + error.message);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>🎵 My Spotify-Lite</h1>
      <div style={styles.card}>
        <AddSongForm onSongAdded={() => window.location.reload()} />
      </div>
      <div style={styles.card}>
        <SongList onPlay={handlePlay} />
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 700,
    margin: "0 auto",
    padding: 20,
    fontFamily: "Helvetica, Arial, sans-serif",
    backgroundColor: "#121212",
    minHeight: "100vh",
    color: "#ffffff",
  },
  header: {
    fontSize: "2.2rem",
    textAlign: "center",
    color: "#1DB954",
    marginBottom: 30,
  },
  card: {
    background: "#1e1e1e",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    boxShadow: "0 4px 10px rgba(0,0,0,0.6)",
  },
};

export default App;
