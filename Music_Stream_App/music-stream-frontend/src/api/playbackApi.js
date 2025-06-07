const BASE_URL = "http://localhost:8003";

export async function playSong(songId) {
  const response = await fetch(`${BASE_URL}/playback/play`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ song_id: songId }),
  });
  if (!response.ok) throw new Error("Failed to play song");
  return response.json();
}
