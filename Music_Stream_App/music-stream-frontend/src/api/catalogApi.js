// src/api/catalogApi.js

const API_BASE_URL = "http://localhost:8002"; // catalog service

export async function fetchSongs() {
  const response = await fetch(`${API_BASE_URL}/tracks/`);
  if (!response.ok) {
    throw new Error("Failed to fetch songs");
  }
  return response.json();
}

export async function addSong(song) {
  const response = await fetch(`${API_BASE_URL}/tracks/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(song),
  });

  if (!response.ok) {
    throw new Error("Failed to add song");
  }

  return response.json();
}
