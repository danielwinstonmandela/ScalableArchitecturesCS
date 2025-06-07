const API_URL = "http://localhost:8002";

export const fetchSongs = async () => {
  const response = await fetch(`${API_URL}/songs`);
  if (!response.ok) throw new Error("Failed to fetch songs");
  return response.json();
};

export const addSong = async (songData) => {
  const response = await fetch(`${API_URL}/tracks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(songData),
  });
  if (!response.ok) throw new Error("Failed to add song");
  return response.json();
};