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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setAudioFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!audioFile) {
      setMessage("❌ Please upload an audio file.");
      return;
    }

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

      setMessage("✅ Song uploaded successfully!");
      setForm({
        title: "",
        artist: "",
        album: "",
        duration: 180,
        genre: "",
        release_year: new Date().getFullYear(),
      });
      setAudioFile(null);
      onSongAdded?.();
    } catch (err) {
      setMessage("❌ Upload failed: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <h2 style={styles.title}>➕ Add New Song</h2>
      <div style={styles.form}>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          required
          style={styles.input}
        />
        <input
          name="artist"
          value={form.artist}
          onChange={handleChange}
          placeholder="Artist"
          required
          style={styles.input}
        />
        <input
          name="album"
          value={form.album}
          onChange={handleChange}
          placeholder="Album"
          style={styles.input}
        />
        <input
          name="genre"
          value={form.genre}
          onChange={handleChange}
          placeholder="Genre"
          required
          style={styles.input}
        />
        <input
          name="duration"
          type="number"
          value={form.duration}
          onChange={handleChange}
          placeholder="Duration (seconds)"
          required
          style={styles.input}
        />
        <input
          name="release_year"
          type="number"
          value={form.release_year}
          onChange={handleChange}
          placeholder="Release Year"
          required
          style={styles.input}
        />
        <input
          type="file"
          name="audio_file"
          accept="audio/*"
          onChange={handleFileChange}
          required
          style={styles.fileInput}
        />
      </div>
      <button type="submit" style={styles.button}>
        Upload Song
      </button>
      {message && <p style={styles.message}>{message}</p>}
    </form>
  );
}

const styles = {
  title: {
    fontSize: "1.4rem",
    marginBottom: 15,
    color: "#1DB954",
    textAlign: "center",
  },
  form: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginBottom: 20,
  },
  input: {
    padding: 10,
    border: "1px solid #333",
    borderRadius: 6,
    backgroundColor: "#121212",
    color: "#fff",
    fontSize: "0.95rem",
  },
  fileInput: {
    gridColumn: "1 / -1",
    padding: "10px",
    backgroundColor: "#222",
    color: "#fff",
    borderRadius: 6,
  },
  button: {
    gridColumn: "1 / -1",
    backgroundColor: "#1DB954",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: 25,
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem",
  },
  message: {
    textAlign: "center",
    marginTop: 15,
    color: "#ccc",
  },
};

export default AddSongForm;
