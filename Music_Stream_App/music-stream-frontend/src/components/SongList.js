import React, { useEffect, useState, useRef } from "react";
import { fetchSongs } from "../api/catalogApi";

function SongList() {
  const [songs, setSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false); // Add this to track seeking

  const audioRef = useRef(null);

  useEffect(() => {
    fetchSongs().then(setSongs).catch(console.error);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      console.log("Duration loaded:", audio.duration);
    };
    
    const handleTimeUpdate = () => {
      // Only update progress if we're not seeking
      if (!isSeeking) {
        setProgress(audio.currentTime);
      }
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setIsSeeking(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [isSeeking]);

  useEffect(() => {
    if (currentSong) {
      const audio = audioRef.current;
      if (audio) {
        audio.src = `http://localhost:8002/songs/${currentSong.id}/audio`;
        audio.load();
        setProgress(0);
        setDuration(0);
        setIsPlaying(false);
      }
    }
  }, [currentSong]);

  const play = () => {
    const audio = audioRef.current;
    if (!currentSong || !audio) return;
    audio.play().catch(console.error);
  };

  const pause = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
    }
  };

  const stop = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setProgress(0);
      setIsPlaying(false);
    }
  };

  // Replace your current seek functions with these improved versions:

  // Handle seeking with better state management
  const onSeek = (e) => {
    const newTime = Number(e.target.value);
    const audio = audioRef.current;
    
    if (audio && duration > 0) {
      console.log(`Seeking to: ${newTime.toFixed(1)}s`);
      
      // Set the audio time immediately
      audio.currentTime = newTime;
      
      // Update progress state
      setProgress(newTime);
    }
  };

  // Handle mouse down on seeker (start seeking)
  const onSeekStart = () => {
    console.log("Started seeking");
    setIsSeeking(true);
  };

  // Handle mouse up on seeker (end seeking)
  const onSeekEnd = () => {
    console.log("Stopped seeking");
    // Add a longer delay before allowing timeupdate to take over
    setTimeout(() => {
      setIsSeeking(false);
    }, 200);
  };

  // Add this new function for smooth dragging
  const onSeekInput = (e) => {
    const newTime = Number(e.target.value);
    // Update progress immediately for smooth visual feedback while dragging
    setProgress(newTime);
  };

  // Calculate progress percentage for visual feedback
  const progressPercentage = duration > 0 ? (progress / duration) * 100 : 0;

  const filteredSongs = songs.filter((song) =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🎧 All Songs</h2>

      <input
        type="text"
        placeholder="🔍 Search by title or artist..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.searchInput}
      />

      {filteredSongs.length === 0 ? (
        <p style={{ color: "#aaa" }}>No songs found.</p>
      ) : (
        <ul style={styles.list}>
          {filteredSongs.map((song) => (
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
                    // Small delay to ensure song is loaded before playing
                    setTimeout(() => play(), 100);
                  }
                }}
              >
                {currentSong?.id === song.id && isPlaying ? "⏸ Pause" : "▶ Play"}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Enhanced Audio Player with Better Seeker */}
      {currentSong && (
        <div style={styles.player}>
          <audio ref={audioRef} preload="metadata" />
          
          {/* Now Playing Info */}
          <div style={styles.nowPlaying}>
            <strong>🎵 Now Playing:</strong> {currentSong.title} by {currentSong.artist}
          </div>

          {/* Enhanced Seeker Bar with Visual Progress */}
          <div style={styles.seekerContainer}>
            <div style={styles.seekerBackground}>
              <div 
                style={{
                  ...styles.seekerProgress,
                  width: `${progressPercentage}%`
                }}
              />
              <input
                type="range"
                min={0}
                max={duration || 0}
                step="0.1"
                value={progress}
                onInput={onSeekInput}      // For smooth dragging feedback
                onChange={onSeek}          // For final seek position
                onMouseDown={onSeekStart}  // Start seeking
                onMouseUp={onSeekEnd}      // End seeking
                onTouchStart={onSeekStart} // Mobile support
                onTouchEnd={onSeekEnd}     // Mobile support
                style={styles.seekerSlider}
                title={`Seek to ${formatTime(progress)} / ${formatTime(duration)}`}
              />
            </div>
          </div>

          {/* Time Display */}
          <div style={styles.timeDisplay}>
            <span style={styles.currentTime}>{formatTime(progress)}</span>
            <span style={styles.totalTime}>{formatTime(duration)}</span>
          </div>

          {/* Control Buttons */}
          <div style={styles.controls}>
            <button 
              style={styles.controlButton} 
              onClick={play} 
              disabled={!currentSong || isPlaying}
              title="Play"
            >
              ▶ Play
            </button>
            <button 
              style={styles.controlButton} 
              onClick={pause} 
              disabled={!currentSong || !isPlaying}
              title="Pause"
            >
              ⏸ Pause
            </button>
            <button 
              style={styles.controlButton} 
              onClick={stop} 
              disabled={!currentSong}
              title="Stop"
            >
              ⏹ Stop
            </button>
          </div>

          {/* Progress Info */}
          <div style={styles.progressInfo}>
            Progress: {Math.round(progressPercentage)}% • 
            Remaining: {formatTime(duration - progress)}
          </div>

          {/* Debug Info */}
          <div style={{ fontSize: '10px', color: '#666', marginTop: '10px' }}>
            Debug: Playing: {isPlaying ? 'Yes' : 'No'} | Duration: {duration.toFixed(1)}s | Progress: {progress.toFixed(1)}s | Seeking: {isSeeking ? 'Yes' : 'No'}
          </div>
        </div>
      )}
    </div>
  );
}

function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return "00:00";
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
  searchInput: {
    width: "100%",
    padding: "8px 12px",
    marginBottom: 15,
    borderRadius: 20,
    border: "1px solid #444",
    backgroundColor: "#222",
    color: "#fff",
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
    borderTop: "2px solid #1DB954",
    paddingTop: 20,
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
  },
  nowPlaying: {
    marginBottom: 15,
    color: "#fff",
    fontSize: "1.1rem",
    textAlign: "center",
  },
  seekerContainer: {
    marginBottom: 10,
  },
  seekerBackground: {
    position: "relative",
    height: 12, // Made slightly taller for easier clicking
    backgroundColor: "#333",
    borderRadius: 6,
    overflow: "hidden",
    cursor: "pointer",
  },
  seekerProgress: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    backgroundColor: "#1DB954",
    transition: "width 0.1s ease",
    borderRadius: 6,
    pointerEvents: "none", // Prevent interference with slider
  },
  seekerSlider: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: 0,
    cursor: "pointer",
    margin: 0,
    background: "transparent",
  },
  timeDisplay: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.9rem",
    color: "#aaa",
    marginBottom: 15,
  },
  currentTime: {
    color: "#1DB954",
    fontWeight: "bold",
  },
  totalTime: {
    color: "#ccc",
  },
  controls: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
    marginBottom: 10,
  },
  controlButton: {
    backgroundColor: "#1DB954",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: 25,
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "0.9rem",
    transition: "all 0.2s ease",
  },
  progressInfo: {
    textAlign: "center",
    fontSize: "0.8rem",
    color: "#888",
    fontStyle: "italic",
  },
};

export default SongList;
