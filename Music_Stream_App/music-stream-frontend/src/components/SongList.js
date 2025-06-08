import React, { useEffect, useState, useRef } from "react";
import { fetchSongs } from "../api/catalogApi";

function SongList() {
  const [songs, setSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [volume, setVolume] = useState(0.7);

  const audioRef = useRef(null);
  const currentSongIdRef = useRef(null);

  useEffect(() => {
    setIsLoading(true);
    fetchSongs()
      .then(setSongs)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => {
      if (!isSeeking) setProgress(audio.currentTime);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setIsSeeking(false);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

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

  // Load new song
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && currentSong && currentSongIdRef.current !== currentSong.id) {
      audio.src = `http://localhost:8002/songs/${currentSong.id}/audio`;
      audio.volume = volume;
      audio.load();
      setProgress(0);
      setDuration(0);
      setIsPlaying(false);
      currentSongIdRef.current = currentSong.id;
    }
  }, [currentSong, volume]);

  const play = () => {
    const audio = audioRef.current;
    if (!currentSong || !audio) return;
    audio.play().catch(console.error);
  };

  const pause = () => {
    const audio = audioRef.current;
    if (audio) audio.pause();
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

  const onSeek = (e) => {
    const newTime = Number(e.target.value);
    const audio = audioRef.current;
    
    if (audio && duration > 0 && currentSong && currentSongIdRef.current === currentSong.id) {
      console.log(`Seeking to: ${newTime.toFixed(1)}s`);
      
      // Temporarily disable timeupdate
      setIsSeeking(true);
      
      // Set audio time
      audio.currentTime = newTime;
      
      // Update progress
      setProgress(newTime);
      
      // Re-enable timeupdate after audio has processed the seek
      setTimeout(() => {
        setIsSeeking(false);
      }, 200);
    }
  };

  const onSeekStart = () => {
    setIsSeeking(true);
  };

  const onSeekEnd = () => {
    setTimeout(() => {
      setIsSeeking(false);
    }, 200);
  };

  const onVolumeChange = (e) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const filteredSongs = songs.filter((song) =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (song.album && song.album.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const progressPercentage = duration > 0 ? (progress / duration) * 100 : 0;

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}>♪</div>
        <div style={styles.loadingText}>Loading your music library...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>
          <span style={styles.titleIcon}>♫</span>
          Your Music Library
        </h2>
        <div style={styles.statsBar}>
          <span style={styles.songCount}>{filteredSongs.length} songs</span>
          {searchTerm && (
            <span style={styles.searchResults}>
              {filteredSongs.length} results for "{searchTerm}"
            </span>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div style={styles.searchContainer}>
        <div style={styles.searchInputWrapper}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search songs, artists, or albums..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          {searchTerm && (
            <button
              style={styles.clearSearch}
              onClick={() => setSearchTerm("")}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Songs List */}
      {filteredSongs.length === 0 ? (
        <div style={styles.emptyState}>
          <span style={styles.emptyIcon}>♪</span>
          <h3 style={styles.emptyTitle}>No songs found</h3>
          <p style={styles.emptyText}>
            {searchTerm 
              ? "Try adjusting your search terms"
              : "Upload your first song to get started!"
            }
          </p>
        </div>
      ) : (
        <div style={styles.songsGrid}>
          {filteredSongs.map((song, index) => (
            <div
              key={song.id}
              style={{
                ...styles.songCard,
                ...(currentSong?.id === song.id ? styles.songCardActive : {})
              }}
            >
              <div style={styles.songIndex}>#{index + 1}</div>
              <div style={styles.songInfo}>
                <h4 style={styles.songTitle}>{song.title}</h4>
                <p style={styles.songArtist}>{song.artist}</p>
                <div style={styles.songMeta}>
                  <span style={styles.songAlbum}>
                    ○ {song.album || "Unknown Album"}
                  </span>
                  <span style={styles.songYear}>
                    • {song.release_year || "Unknown"}
                  </span>
                  <span style={styles.songDuration}>
                    ♪ {formatTime(song.duration)}
                  </span>
                </div>
                <div style={styles.songGenre}>
                  <span style={styles.genreTag}>{song.genre}</span>
                </div>
              </div>
              <div style={styles.songActions}>
                <button
                  style={{
                    ...styles.playButton,
                    ...(currentSong?.id === song.id && isPlaying ? styles.pauseButton : {})
                  }}
                  onClick={() => {
                    if (currentSong?.id === song.id && isPlaying) {
                      pause();
                    } else {
                      setCurrentSong(song);
                      setTimeout(() => play(), 100);
                    }
                  }}
                >
                  {currentSong?.id === song.id && isPlaying ? "||" : "▷"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Enhanced Audio Player */}
      {currentSong && (
        <div style={styles.player}>
          <audio ref={audioRef} preload="metadata" />
          
          {/* Now Playing Header */}
          <div style={styles.playerHeader}>
            <div style={styles.nowPlayingInfo}>
              <span style={styles.nowPlayingLabel}>Now Playing</span>
              <h3 style={styles.nowPlayingTitle}>{currentSong.title}</h3>
              <p style={styles.nowPlayingArtist}>{currentSong.artist}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={styles.progressContainer}>
            <span style={styles.timeLabel}>{formatTime(progress)}</span>
            <div style={styles.progressBarContainer}>
              <div style={styles.progressBarBackground}>
                <div 
                  style={{
                    ...styles.progressBarFill,
                    width: `${progressPercentage}%`
                  }}
                />
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  step="0.1"
                  value={progress}
                  onChange={onSeek}
                  onMouseDown={onSeekStart}
                  onMouseUp={onSeekEnd}
                  onTouchStart={onSeekStart}
                  onTouchEnd={onSeekEnd}
                  style={styles.progressSlider}
                />
              </div>
            </div>
            <span style={styles.timeLabel}>{formatTime(duration)}</span>
          </div>

          {/* Controls */}
          <div style={styles.controls}>
            <button style={styles.controlButton} onClick={stop}>
              ■
            </button>
            <button 
              style={{
                ...styles.controlButton,
                ...styles.mainPlayButton
              }}
              onClick={isPlaying ? pause : play}
            >
              {isPlaying ? "||" : "▷"}
            </button>
            <div style={styles.volumeControl}>
              <span style={styles.volumeIcon}>♪</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={onVolumeChange}
                style={styles.volumeSlider}
              />
            </div>
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
    color: "#FFFFFF",
    fontFamily: "'Segoe UI', Arial, sans-serif",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "4rem 2rem",
    textAlign: "center",
  },
  loadingSpinner: {
    fontSize: "3rem",
    color: "#1DB954",
    animation: "pulse 2s infinite",
  },
  loadingText: {
    fontSize: "1.2rem",
    marginTop: "1rem",
    color: "#B3B3B3",
  },
  header: {
    marginBottom: "2rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    margin: "0 0 0.5rem 0",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    color: "#1DB954",
  },
  titleIcon: {
    fontSize: "2rem",
    color: "#1DB954",
  },
  statsBar: {
    display: "flex",
    gap: "1rem",
    fontSize: "0.9rem",
    color: "#B3B3B3",
  },
  songCount: {
    color: "#1DB954",
    fontWeight: "600",
  },
  searchResults: {
    fontStyle: "italic",
    color: "#6D6D6D",
  },
  searchContainer: {
    marginBottom: "2rem",
  },
  searchInputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  searchIcon: {
    position: "absolute",
    left: "1rem",
    fontSize: "1.2rem",
    color: "#6D6D6D",
    zIndex: 1,
  },
  searchInput: {
    width: "100%",
    padding: "1rem 1rem 1rem 3rem",
    borderRadius: "50px",
    border: "1px solid #6D6D6D",
    backgroundColor: "#191414",
    color: "#FFFFFF",
    fontSize: "1rem",
    transition: "all 0.3s ease",
  },
  clearSearch: {
    position: "absolute",
    right: "1rem",
    background: "none",
    border: "none",
    color: "#6D6D6D",
    cursor: "pointer",
    fontSize: "1rem",
    padding: "0.5rem",
  },
  emptyState: {
    textAlign: "center",
    padding: "4rem 2rem",
  },
  emptyIcon: {
    fontSize: "4rem",
    color: "#6D6D6D",
    display: "block",
    marginBottom: "1rem",
  },
  emptyTitle: {
    fontSize: "1.5rem",
    margin: "0 0 1rem 0",
    color: "#B3B3B3",
  },
  emptyText: {
    fontSize: "1rem",
    color: "#6D6D6D",
    margin: 0,
  },
  songsGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginBottom: "2rem",
  },
  songCard: {
    background: "rgba(25, 20, 20, 0.8)",
    borderRadius: "15px",
    padding: "1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    transition: "all 0.3s ease",
    border: "1px solid rgba(109, 109, 109, 0.3)",
    backdropFilter: "blur(10px)",
  },
  songCardActive: {
    background: "rgba(29, 185, 84, 0.1)",
    borderColor: "#1DB954",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 25px rgba(29, 185, 84, 0.2)",
  },
  songIndex: {
    fontSize: "1.2rem",
    fontWeight: "700",
    color: "#1DB954",
    minWidth: "3rem",
    textAlign: "center",
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: "1.2rem",
    fontWeight: "600",
    margin: "0 0 0.5rem 0",
    color: "#FFFFFF",
  },
  songArtist: {
    fontSize: "1rem",
    margin: "0 0 0.5rem 0",
    color: "#B3B3B3",
  },
  songMeta: {
    display: "flex",
    gap: "1rem",
    fontSize: "0.8rem",
    color: "#6D6D6D",
    marginBottom: "0.5rem",
    flexWrap: "wrap",
  },
  songAlbum: {
    color: "#B3B3B3",
  },
  songYear: {
    color: "#B3B3B3",
  },
  songDuration: {
    color: "#1DB954",
    fontWeight: "600",
  },
  songGenre: {
    marginTop: "0.5rem",
  },
  genreTag: {
    background: "rgba(29, 185, 84, 0.2)",
    color: "#1DB954",
    padding: "0.25rem 0.75rem",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "500",
  },
  songActions: {
    display: "flex",
    gap: "0.5rem",
  },
  playButton: {
    background: "#1DB954",
    border: "none",
    borderRadius: "50%",
    width: "60px",
    height: "60px",
    cursor: "pointer",
    fontSize: "1.5rem",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(29, 185, 84, 0.4)",
  },
  pauseButton: {
    background: "#FFFFFF",
    color: "#191414",
    boxShadow: "0 4px 15px rgba(255, 255, 255, 0.4)",
  },
  player: {
    position: "sticky",
    bottom: 0,
    background: "rgba(25, 20, 20, 0.95)",
    borderRadius: "20px 20px 0 0",
    padding: "2rem",
    backdropFilter: "blur(20px)",
    border: "1px solid #6D6D6D",
    borderBottom: "none",
    boxShadow: "0 -8px 32px rgba(0,0,0,0.3)",
  },
  playerHeader: {
    textAlign: "center",
    marginBottom: "1.5rem",
  },
  nowPlayingInfo: {
    marginBottom: "1rem",
  },
  nowPlayingLabel: {
    fontSize: "0.8rem",
    color: "#1DB954",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  nowPlayingTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    margin: "0.5rem 0 0.25rem 0",
    color: "#FFFFFF",
  },
  nowPlayingArtist: {
    fontSize: "1rem",
    margin: 0,
    color: "#B3B3B3",
  },
  progressContainer: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  timeLabel: {
    fontSize: "0.9rem",
    color: "#1DB954",
    fontWeight: "600",
    minWidth: "45px",
  },
  progressBarContainer: {
    flex: 1,
  },
  progressBarBackground: {
    position: "relative",
    height: "8px",
    backgroundColor: "#6D6D6D",
    borderRadius: "4px",
    overflow: "hidden",
  },
  progressBarFill: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    background: "#1DB954",
    borderRadius: "4px",
    transition: "width 0.1s ease",
  },
  progressSlider: {
    position: "absolute",
    top: "-4px",
    left: 0,
    width: "100%",
    height: "16px",
    opacity: 0,
    cursor: "pointer",
  },
  controls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
  },
  controlButton: {
    background: "rgba(109, 109, 109, 0.3)",
    border: "1px solid #6D6D6D",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    cursor: "pointer",
    fontSize: "1.2rem",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
  },
  mainPlayButton: {
    width: "70px",
    height: "70px",
    fontSize: "1.8rem",
    background: "#1DB954",
    boxShadow: "0 4px 15px rgba(29, 185, 84, 0.4)",
  },
  volumeControl: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginLeft: "1rem",
  },
  volumeIcon: {
    fontSize: "1rem",
    color: "#B3B3B3",
  },
  volumeSlider: {
    width: "100px",
    cursor: "pointer",
  },
};

// Add pulse animation
const pulseStyle = document.createElement("style");
pulseStyle.innerText = `
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
  }
`;
document.head.appendChild(pulseStyle);

export default SongList;