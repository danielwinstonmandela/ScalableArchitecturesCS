import React, { useEffect, useState, useRef } from "react";
import { fetchSongs } from "../api/catalogApi";

function SongList() {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null); // current song object
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // current time in seconds
  const [duration, setDuration] = useState(0); // duration in seconds

  const audioRef = useRef(null);

  useEffect(() => {
    fetchSongs()
      .then(setSongs)
      .catch(console.error);
  }, []);

  // When currentSong changes, update audio source and reset states
  useEffect(() => {
    if (currentSong) {
      setIsPlaying(false);
      setProgress(0);
      setDuration(0);
    }
  }, [currentSong]);

  // Attach audio event listeners for updating progress and duration
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const onTimeUpdate = () => {
      setProgress(audio.currentTime);
    };

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);

    // Cleanup listeners on unmount or when audio changes
    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [currentSong]);

  const play = () => {
    if (!currentSong) return;
    audioRef.current.play();
    setIsPlaying(true);
  };

  const pause = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const stop = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setProgress(0);
  };

  const onSeek = (e) => {
    const newTime = Number(e.target.value);
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🎧 All Songs</h2>
      {songs.length === 0 ? (
        <p style={{ color: "#aaa" }}>No songs found.</p>
      ) : (
        <ul style={styles.list}>
          {songs.map((song) => (
            <li key={song.id} style={styles.item}>
              <div>
                <strong style={{ color: "#fff" }}>{song.title}</strong> by{" "}
                <span style={{ color: "#ccc" }}>{song.artist}</span>
                <div style={{ fontSize: 12, color: "#888" }}>
                  Album: {song.album || "N/A"} | Year: {song.release_year || "N/A"}
                </div>
              </div>
              <button
                style={styles.button}
                onClick={() => {
                  if (currentSong?.id === song.id && isPlaying) {
                    pause();
                  } else {
                    setCurrentSong(song);
                    setTimeout(() => play(), 100); // slight delay to update audio src
                  }
                }}
              >
                {currentSong?.id === song.id && isPlaying ? "⏸ Pause" : "▶ Play"}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Audio player controls */}
      {currentSong && (
        <div style={styles.player}>
          <audio
            ref={audioRef}
            src={`http://localhost:8002/songs/${currentSong.id}/audio`}
            preload="metadata"
          />
          <div style={{ marginBottom: 8, color: "#fff" }}>
            Now Playing: <strong>{currentSong.title}</strong> by {currentSong.artist}
          </div>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step="0.01"
            value={progress}
            onChange={onSeek}
            style={styles.slider}
          />
          <div style={styles.time}>
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div>
            <button style={styles.controlButton} onClick={play} disabled={!currentSong}>
              ▶ Play
            </button>
            <button style={styles.controlButton} onClick={pause} disabled={!currentSong}>
              ⏸ Pause
            </button>
            <button style={styles.controlButton} onClick={stop} disabled={!currentSong}>
              ⏹ Stop
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper to format seconds to mm:ss
function formatTime(seconds) {
  if (isNaN(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

const styles = {
  container: {
    color: "#eee",
    maxWidth: 600,
    margin: "auto",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "1.3rem",
    marginBottom: 10,
    color: "#1DB954",
  },
  list: {
    listStyle: "none",
    padding: 0,
    marginBottom: 20,
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #333",
    padding: "12px 0",
  },
  button: {
    backgroundColor: "#1DB954",
    color: "#fff",
    border: "none",
    padding: "6px 14px",
    borderRadius: 20,
    cursor: "pointer",
    fontWeight: "bold",
  },
  player: {
    borderTop: "1px solid #444",
    paddingTop: 15,
  },
  slider: {
    width: "100%",
    cursor: "pointer",
    marginBottom: 8,
  },
  time: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 12,
    color: "#aaa",
    marginBottom: 10,
  },
  controlButton: {
    backgroundColor: "#1DB954",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: 20,
    cursor: "pointer",
    fontWeight: "bold",
    marginRight: 8,
  },
};

export default SongList;
