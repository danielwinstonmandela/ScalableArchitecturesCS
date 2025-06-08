import React, { useState } from "react";
import SongList from "./components/SongList";
import AddSongForm from "./components/AddSongForm";
import { playSong } from "./api/playbackApi";

function App() {
  const [activeTab, setActiveTab] = useState("library");
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePlay = async (songId) => {
    try {
      await playSong(songId);
      console.log(`▶️ Playing song ID: ${songId}`);
    } catch (error) {
      console.error("❌ Error playing song:", error.message);
    }
  };

  const handleSongAdded = () => {
    setRefreshKey(prev => prev + 1);
    setActiveTab("library");
  };

  return (
    <div style={styles.app}>
      {/* Header with Gradient */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>♪</span>
            <h1 style={styles.title}>Sp0t1fy</h1>
            <span style={styles.logoIcon}>♪</span>
          </div>
          <div style={styles.subtitle}>a scalable software engineering assignment</div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav style={styles.nav}>
        <button
          style={{
            ...styles.navButton,
            ...(activeTab === "library" ? styles.navButtonActive : {})
          }}
          onClick={() => setActiveTab("library")}
        >
          <span style={styles.navIcon}>♫</span>
          Your Library
        </button>
        <button
          style={{
            ...styles.navButton,
            ...(activeTab === "upload" ? styles.navButtonActive : {})
          }}
          onClick={() => setActiveTab("upload")}
        >
          <span style={styles.navIcon}>↑</span>
          Upload Music
        </button>
      </nav>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.container}>
          {activeTab === "upload" ? (
            <div style={styles.tabContent}>
              <AddSongForm onSongAdded={handleSongAdded} />
            </div>
          ) : (
            <div style={styles.tabContent}>
              <SongList onPlay={handlePlay} key={refreshKey} />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <span>Made with ♥ using Microservices Architecture</span> <br />
          <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>
            Daniel Winston Mandela Tulung  | | Rindra Adriansyah <br />
            © 2025 Sp0t1fy. All rights reserved.
          </span>
          <div style={styles.footerLinks}>
            <span style={styles.footerLink}>User Service</span>
            <span style={styles.footerSeparator}>•</span>
            <span style={styles.footerLink}>Catalog Service</span>
            <span style={styles.footerSeparator}>•</span>
            <span style={styles.footerLink}>Playback Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    background: "#191414",
    color: "#FFFFFF",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    background: "linear-gradient(135deg, #1DB954 0%, #1ed760 100%)",
    padding: "2rem 0",
    textAlign: "center",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  },
  headerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 2rem",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    marginBottom: "0.5rem",
  },
  logoIcon: {
    fontSize: "3rem",
    color: "#FFFFFF",
    filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
  },
  title: {
    fontSize: "3.5rem",
    fontWeight: "700",
    margin: 0,
    color: "#FFFFFF",
    textShadow: "0 4px 8px rgba(0,0,0,0.3)",
  },
  subtitle: {
    fontSize: "1.2rem",
    opacity: 0.9,
    fontWeight: "300",
    color: "#FFFFFF",
  },
  nav: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    padding: "2rem 0",
    background: "rgba(25, 20, 20, 0.8)",
    backdropFilter: "blur(10px)",
  },
  navButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "1rem 2rem",
    background: "rgba(109, 109, 109, 0.2)",
    border: "2px solid transparent",
    borderRadius: "50px",
    color: "#B3B3B3",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    backdropFilter: "blur(10px)",
  },
  navButtonActive: {
    background: "#1DB954",
    borderColor: "rgba(255,255,255,0.3)",
    color: "#FFFFFF",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 25px rgba(29, 185, 84, 0.4)",
  },
  navIcon: {
    fontSize: "1.2rem",
  },
  main: {
    padding: "2rem 0",
    minHeight: "60vh",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 2rem",
  },
  tabContent: {
    animation: "fadeIn 0.5s ease-in-out",
  },
  footer: {
    background: "rgba(25, 20, 20, 0.9)",
    backdropFilter: "blur(10px)",
    padding: "2rem 0",
    marginTop: "auto",
    borderTop: "1px solid rgba(109, 109, 109, 0.3)",
  },
  footerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 2rem",
    textAlign: "center",
    fontSize: "0.9rem",
    color: "#B3B3B3",
  },
  footerLinks: {
    marginTop: "0.5rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.8rem",
  },
  footerLink: {
    color: "#1DB954",
    fontWeight: "500",
  },
  footerSeparator: {
    opacity: 0.5,
    color: "#6D6D6D",
  },
};

// Add CSS animation keyframes
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: #191414;
    border-radius: 10px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #1DB954;
    border-radius: 10px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #1ed760;
  }
`;
document.head.appendChild(styleSheet);

export default App;