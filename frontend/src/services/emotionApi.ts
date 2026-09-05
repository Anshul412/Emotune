const API_BASE_URL = "http://127.0.0.1:8000";

export async function detectEmotion(image: File) {
  const formData = new FormData();
  formData.append("image", image);

  const response = await fetch(`${API_BASE_URL}/emotion`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let message = "Emotion analysis failed";
    try {
      const data = await response.json();
      message = data.detail || message;
    } catch {
      message = await response.text();
    }
    throw new Error(message);
  }

  return response.json();
}
