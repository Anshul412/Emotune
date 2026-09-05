# 🎵 EmoTune – AI-Based Music Emotion Mapper

EmoTune is an AI-powered music recommendation system that detects a user’s **real-time facial emotions** and recommends suitable music tracks accordingly. The system combines **deep learning–based facial emotion recognition**, a **FastAPI backend**, **Spotify integration**, and a **React-based frontend** to deliver a personalized and engaging music experience.

---

## ✨ Features

- Real-time facial emotion detection using live camera input or uploaded images  
- Detection of 7 emotions: **angry, happy, sad, fear, disgust, surprise, neutral**
- Deep learning model with attention mechanism for improved accuracy  
- Emotion-to-music mapping for personalized music recommendations  
- Spotify track recommendations displayed using **Spotify embeds (iframes)**  
- Secure user authentication using **Firebase Authentication**  
- Responsive and intuitive UI built with **React + Tailwind CSS**  

---

## 📊 Dataset

A balanced facial emotion recognition dataset was used for training the model.  
All images were resized to **75×75 pixels** and preprocessed using normalization and label encoding.

**Dataset link:**  
https://www.kaggle.com/datasets/dollyprajapati182/fer2013-balance-dataset

---

## 🧠 Model Used

- **Architecture:** Convolutional Neural Network (CNN)  
- **Enhancement:** Convolutional Block Attention Module (CBAM)  
- **Framework:** TensorFlow  
- **Training Platform:** Kaggle Notebook  
- **Input Size:** 75 × 75 grayscale facial images  
- **Output:** 7 emotion classes  
- **Achieved Accuracy:** ~80%  

The trained model was saved and deployed for real-time inference using a FastAPI backend.

---

## 🛠 Tech Stack

### Backend
- FastAPI  
- TensorFlow  
- OpenCV  
- NumPy  
- Python-dotenv  
- Spotify Web API  

### Frontend
- React.js  
- Tailwind CSS  
- Spotify Embed (iframe)  

### Authentication
- Firebase Authentication  

---

## ▶️ How to Run the Backend

### 1. Navigate to backend directory
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
```
### 2.Install dependencies
```bash
pip install -r requirements.txt
```
### 3. Create a .env file
```bash
LAST_FM_API_KEY=your_lastfm_apikey
LAST_FM_SHARED_SECRET=your_lastfm_secret_id
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```
### 4.Start FastAPI server
```bash
uvicorn main:app --reload
```
Backend will run at:
```bash
http://localhost:8000
```

---

## ▶️ How to Run the Frontend

### 1.Navigate to frontend directory
```bash
cd frontend
```

### 2.Install dependencies
```bash
npm install
```

### 3.Create .env file in frontend folder
```bash
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 4.Start development server
```bash
npm run dev
```

Frontend will run at:
```bash
http://localhost:5173
```

