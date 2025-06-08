import React, { useState } from "react";

function AddSongForm({ onSongAdded }) {
  const [form, setForm] = useState({
    title: "",
    artist: "",
    album: "",
    duration: 180,
    genre: "",
    release_year: new Date().getFullYear(),
  });
  const [audioFile, setAudioFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAudioFile(file);
    if (file && !form.title) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      setForm(prev => ({ ...prev, title: nameWithoutExt }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      if (!form.title) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
        setForm(prev => ({ ...prev, title: nameWithoutExt }));
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!audioFile) {
      setMessage("✗ Please upload an audio file.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("audio_file", audioFile);

    try {
      const response = await fetch("http://localhost:8002/songs", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Upload failed");
      }

      setMessage("✓ Song uploaded successfully!");
      setForm({
        title: "",
        artist: "",
        album: "",
        duration: 180,
        genre: "",
        release_year: new Date().getFullYear(),
      });
      setAudioFile(null);
      setTimeout(() => setMessage(""), 3000);
      onSongAdded?.();
    } catch (err) {
      setMessage("✗ Upload failed: " + err.message);
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>
          <span style={styles.titleIcon}>♪</span>
          Upload New Song
        </h2>
        <p style={styles.subtitle}>Share your music with the world</p>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* File Upload Area */}
        <div
          style={{
            ...styles.dropZone,
            ...(dragOver ? styles.dropZoneActive : {}),
            ...(audioFile ? styles.dropZoneSuccess : {})
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {audioFile ? (
            <div style={styles.fileSuccess}>
              <span style={styles.fileIcon}>♪</span>
              <div style={styles.fileName}>{audioFile.name}</div>
              <div style={styles.fileSize}>
                {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
              </div>
              <button
                type="button"
                style={styles.removeFile}
                onClick={() => setAudioFile(null)}
              >
                ✕ Remove
              </button>
            </div>
          ) : (
            <div style={styles.dropContent}>
              <span style={styles.uploadIcon}>↑</span>
              <div style={styles.uploadText}>
                <strong>Drop your audio file here</strong>
                <br />
                or{" "}
                <label style={styles.browseLink}>
                  browse
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    style={styles.hiddenInput}
                  />
                </label>
              </div>
              <div style={styles.supportedFormats}>
                Supported: MP3, WAV, FLAC, M4A
              </div>
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div style={styles.fieldsGrid}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Song Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter song title"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Artist *</label>
            <input
              name="artist"
              value={form.artist}
              onChange={handleChange}
              placeholder="Enter artist name"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Album</label>
            <input
              name="album"
              value={form.album}
              onChange={handleChange}
              placeholder="Enter album name"
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Genre *</label>
            <select
              name="genre"
              value={form.genre}
              onChange={handleChange}
              required
              style={styles.select}
            >
              <option value="">Select genre</option>
              <option value="Pop">Pop</option>
              <option value="Rock">Rock</option>
              <option value="Hip Hop">Hip Hop</option>
              <option value="Jazz">Jazz</option>
              <option value="Classical">Classical</option>
              <option value="Electronic">Electronic</option>
              <option value="Country">Country</option>
              <option value="R&B">R&B</option>
              <option value="Alternative">Alternative</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Duration (seconds)</label>
            <input
              name="duration"
              type="number"
              min="1"
              value={form.duration}
              onChange={handleChange}
              placeholder="Duration in seconds"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Release Year</label>
            <input
              name="release_year"
              type="number"
              min="1900"
              max={new Date().getFullYear() + 1}
              value={form.release_year}
              onChange={handleChange}
              placeholder="Release year"
              required
              style={styles.input}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isUploading || !audioFile}
          style={{
            ...styles.submitButton,
            ...(isUploading ? styles.submitButtonLoading : {}),
            ...(!audioFile ? styles.submitButtonDisabled : {})
          }}
        >
          {isUploading ? (
            <>
              <span style={styles.spinner}>⟳</span>
              Uploading...
            </>
          ) : (
            <>
              <span style={styles.buttonIcon}>↑</span>
              Upload Song
            </>
          )}
        </button>

        {/* Message */}
        {message && (
          <div style={{
            ...styles.message,
            ...(message.includes('✓') ? styles.messageSuccess : styles.messageError)
          }}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

const styles = {
  container: {
    background: "rgba(25, 20, 20, 0.8)",
    borderRadius: "20px",
    padding: "2rem",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(109, 109, 109, 0.3)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    margin: "0 0 0.5rem 0",
    color: "#1DB954",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
  },
  titleIcon: {
    fontSize: "2rem",
    color: "#1DB954",
  },
  subtitle: {
    fontSize: "1rem",
    color: "#B3B3B3",
    margin: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  dropZone: {
    border: "2px dashed #6D6D6D",
    borderRadius: "15px",
    padding: "3rem 2rem",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    background: "rgba(25, 20, 20, 0.5)",
  },
  dropZoneActive: {
    borderColor: "#1DB954",
    background: "rgba(29, 185, 84, 0.1)",
    transform: "scale(1.02)",
  },
  dropZoneSuccess: {
    borderColor: "#1DB954",
    background: "rgba(29, 185, 84, 0.1)",
  },
  dropContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
  },
  uploadIcon: {
    fontSize: "3rem",
    color: "#6D6D6D",
  },
  uploadText: {
    fontSize: "1.1rem",
    lineHeight: 1.5,
    color: "#FFFFFF",
  },
  browseLink: {
    color: "#1DB954",
    textDecoration: "underline",
    cursor: "pointer",
    fontWeight: "600",
  },
  hiddenInput: {
    display: "none",
  },
  supportedFormats: {
    fontSize: "0.9rem",
    color: "#6D6D6D",
  },
  fileSuccess: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
  },
  fileIcon: {
    fontSize: "2rem",
    color: "#1DB954",
  },
  fileName: {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#1DB954",
  },
  fileSize: {
    fontSize: "0.9rem",
    color: "#B3B3B3",
  },
  removeFile: {
    background: "rgba(25, 20, 20, 0.8)",
    border: "1px solid #6D6D6D",
    borderRadius: "20px",
    padding: "0.5rem 1rem",
    color: "#FFFFFF",
    cursor: "pointer",
    fontSize: "0.9rem",
    marginTop: "0.5rem",
    transition: "all 0.2s ease",
  },
  fieldsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1rem",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  label: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#1DB954",
  },
  input: {
    padding: "0.75rem 1rem",
    border: "1px solid #6D6D6D",
    borderRadius: "10px",
    backgroundColor: "#191414",
    color: "#FFFFFF",
    fontSize: "1rem",
    transition: "all 0.2s ease",
  },
  select: {
    padding: "0.75rem 1rem",
    border: "1px solid #6D6D6D",
    borderRadius: "10px",
    backgroundColor: "#191414",
    color: "#FFFFFF",
    fontSize: "1rem",
    transition: "all 0.2s ease",
  },
  submitButton: {
    background: "#1DB954",
    color: "#FFFFFF",
    border: "none",
    padding: "1rem 2rem",
    borderRadius: "50px",
    cursor: "pointer",
    fontSize: "1.1rem",
    fontWeight: "600",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    boxShadow: "0 4px 15px rgba(29, 185, 84, 0.4)",
  },
  submitButtonLoading: {
    opacity: 0.8,
    cursor: "not-allowed",
  },
  submitButtonDisabled: {
    background: "#6D6D6D",
    cursor: "not-allowed",
    boxShadow: "none",
  },
  buttonIcon: {
    fontSize: "1.2rem",
  },
  spinner: {
    animation: "spin 1s linear infinite",
  },
  message: {
    padding: "1rem",
    borderRadius: "10px",
    textAlign: "center",
    fontSize: "1rem",
    fontWeight: "500",
  },
  messageSuccess: {
    background: "rgba(29, 185, 84, 0.2)",
    border: "1px solid #1DB954",
    color: "#1DB954",
  },
  messageError: {
    background: "rgba(179, 179, 179, 0.2)",
    border: "1px solid #B3B3B3",
    color: "#B3B3B3",
  },
};

// Add spinner animation
const spinnerStyle = document.createElement("style");
spinnerStyle.innerText = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(spinnerStyle);

export default AddSongForm;