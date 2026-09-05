// src/pages/Detect.tsx
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Footer from "@/components/Footer";
import EmotionDisplay from "@/components/EmotionDisplay";
import SongCard from "@/components/SongCard";
import { Camera, Upload, RefreshCw, X, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { detectEmotion } from "../services/emotionApi";
import {signOut} from "firebase/auth"
import { useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";
import {Headphones,Heart,BarChart3} from "lucide-react"
import {Link} from "react-router-dom"
import {Plus,Gamepad2 } from "lucide-react";

type Song = {
  name: string;
  artist: { name: string };
  spotifyUrl: string;
};

type EmotionResult = {
  emotion: string;
  confidence: number;
  songs: Song[];
} | null;

function base64ToFile(base64: string, filename: string): File {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

const Detect = () => {
  const [mode, setMode] = useState<"webcam" | "upload" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [emotionResult, setEmotionResult] = useState<EmotionResult>(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { toast } = useToast();
  const emotions = ["angry", "disgust", "fear", "happy", "neutral", "sad", "surprise"];

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsWebcamActive(true);
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsWebcamActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL("image/jpeg");
        setCapturedImage(imageData);
        stopWebcam();
        processImage(imageData);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setCapturedImage(imageData);
        processImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = useCallback(
    async (imageData: string) => {
      setIsProcessing(true);
      try {
        const file = base64ToFile(imageData, "emotion.jpg");
        const result = await detectEmotion(file);
        localStorage.setItem("detectedEmotion", result.emotion.toLowerCase());
        localStorage.setItem("emotionConfidence", result.confidence.toString()); 
        setEmotionResult({
          emotion: result.emotion,
          confidence: result.confidence,
          songs: result.songs,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to analyze emotion. Please try again.",
          variant: "destructive",
        });
        setEmotionResult(null);
      } finally {
        setIsProcessing(false);
      }
    },
    [toast]
  );

  const reset = () => {
    setCapturedImage(null);
    setEmotionResult(null);
    setMode(null);
    stopWebcam();
  };

  const handleModeSelect = (selectedMode: "webcam" | "upload") => {
    setMode(selectedMode);
    if (selectedMode === "webcam") startWebcam();
  };

  const navigate = useNavigate();

const handleSignOut = async () => {
  try {
    await signOut(auth);
    navigate("/"); 
  } catch (err) {
    console.error("Sign out failed", err);
  }
};


  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 pb-20 px-4">
         <button
            onClick={handleSignOut}
            className="fixed top-6 right-6 z-[9999] bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700"
          >
           Sign Out
          </button>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Detect Your Emotion
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Use your webcam or upload an image to discover music that matches your mood
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {/* Mode Selection */}
            {!mode && !emotionResult && (
              <motion.div
                key="mode-select"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto"
              >
                <Card
                  variant="glass"
                  className="p-10 cursor-pointer hover:border-primary/50 transition-all duration-300 group"
                  onClick={() => handleModeSelect("webcam")}
                >
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Camera className="w-10 h-10 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-display font-semibold mb-2">Use Webcam</h3>
                    <p className="text-muted-foreground text-sm">
                      Capture a live photo using your camera for real-time emotion detection
                    </p>
                  </div>
                </Card>

                <Card
                  variant="glass"
                  className="p-10 cursor-pointer hover:border-primary/50 transition-all duration-300 group"
                  onClick={() => handleModeSelect("upload")}
                >
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent to-primary mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Upload className="w-10 h-10 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-display font-semibold mb-2">Upload Image</h3>
                    <p className="text-muted-foreground text-sm">
                      Upload a photo from your device to analyze facial expressions
                    </p>
                  </div>
                </Card>
                <Link to="/playlist" className="block">
                <Card
                    variant="glass"
                    className="p-10 cursor-pointer hover:border-primary/50 transition-all duration-300 group"
                  >
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Headphones className="w-10 h-10 text-primary-foreground" />
                      </div>
                      <h3 className="text-xl font-display font-semibold mb-2">View Playlist</h3>
                      <p className="text-muted-foreground text-sm">
                        Find songs added to your curated playlist
                      </p>
                    </div>
                  </Card>
                </Link>
                <Link to="/favourites" className="block">
                <Card
                    variant="glass"
                    className="p-10 cursor-pointer hover:border-primary/50 transition-all duration-300 group"
                  >
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Heart className="w-10 h-10 text-primary-foreground" />
                      </div>
                      <h3 className="text-xl font-display font-semibold mb-2">Favourite Songs</h3>
                      <p className="text-muted-foreground text-sm">
                        Checkout your most favourite songs
                      </p>
                    </div>
                  </Card>
                </Link>
                <Link to="/analytics" className="block">
                <Card
                    variant="glass"
                    className="p-10 cursor-pointer hover:border-primary/50 transition-all duration-300 group"
                  >
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Heart className="w-10 h-10 text-primary-foreground" />
                      </div>
                      <h3 className="text-xl font-display font-semibold mb-2">Analytics Dashboard</h3>
                      <p className="text-muted-foreground text-sm">
                        View general trends of your listening history
                      </p>
                    </div>
                  </Card>
                </Link>
                <Link to="/emotiongame" className="block">
                <Card
                    variant="glass"
                    className="p-10 cursor-pointer hover:border-primary/50 transition-all duration-300 group"
                  >
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Gamepad2 className="w-10 h-10 text-primary-foreground" />
                      </div>
                      <h3 className="text-xl font-display font-semibold mb-2">Play a Game</h3>
                      <p className="text-muted-foreground text-sm">
                        Burst emotion bubbles and earn brownie points!
                      </p>
                    </div>
                  </Card>
                </Link>

              </motion.div>
            )}

            {/* Webcam View */}
            {mode === "webcam" && !capturedImage && (
              <motion.div
                key="webcam"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-2xl mx-auto"
              >
                <Card variant="glass" className="p-6">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-secondary mb-6">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    {!isWebcamActive && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-muted-foreground">Loading camera...</p>
                      </div>
                    )}
                    {/* Face Detection Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-48 h-48 border-2 border-primary/50 rounded-full animate-pulse" />
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <Button variant="outline" size="lg" onClick={reset}>
                      <X className="w-5 h-5 mr-2" /> Cancel
                    </Button>
                    <Button variant="hero" size="lg" onClick={capturePhoto} disabled={!isWebcamActive}>
                      <Camera className="w-5 h-5 mr-2" /> Capture Photo
                    </Button>
                  </div>
                </Card>
                <canvas ref={canvasRef} className="hidden" />
              </motion.div>
            )}

            {/* Upload View */}
            {mode === "upload" && !capturedImage && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-2xl mx-auto"
              >
                <Card variant="glass" className="p-6">
                  <div
                    className="aspect-video rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer flex flex-col items-center justify-center mb-6"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon className="w-16 h-16 text-muted-foreground mb-4" />
                    <p className="text-foreground font-medium mb-2">Click to upload an image</p>
                    <p className="text-muted-foreground text-sm">or drag and drop</p>
                    <p className="text-muted-foreground text-xs mt-2">PNG, JPG up to 10MB</p>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  <div className="flex items-center justify-center">
                    <Button variant="outline" size="lg" onClick={reset}>
                      <X className="w-5 h-5 mr-2" /> Cancel
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Processing */}
            {isProcessing && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-2xl mx-auto text-center"
              >
                <Card variant="glass" className="p-12">
                  {capturedImage && (
                    <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-6 border-4 border-primary">
                      <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent mx-auto mb-6 animate-spin" />
                  <h3 className="text-xl font-display font-semibold mb-2">Analyzing Expression...</h3>
                  <p className="text-muted-foreground">Our AI is detecting your emotion</p>
                </Card>
              </motion.div>
            )}

            {/* Results */}
            {emotionResult && !isProcessing && (
              <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Emotion Result */}
                      <div className="lg:col-span-1">
                        <Card variant="glass" className="p-8">
                          {capturedImage && (
                            <div className="w-40 h-40 rounded-full overflow-hidden mx-auto mb-6 border-4 border-primary shadow-lg shadow-primary/20">
                              <img src={capturedImage} alt="Your photo" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <EmotionDisplay emotion={emotionResult.emotion} confidence={emotionResult.confidence} />
                      <div className="mt-6 flex flex-col gap-3">
                            <Button variant="gradient" size="lg" onClick={reset} className="w-full">
                              <RefreshCw className="w-5 h-5 mr-2" /> Try Again
                            </Button>
                            {/*Button: View Favourite Songs */}
                          <div className="mt-6 flex flex-col gap-3">
                            <Link to="/favourites">
                              <Button variant="secondary" size="lg" className="w-full">
                                <Heart className="w-5 h-5 mr-2" /> View Favourite Songs
                              </Button>
                            </Link>
                            {/*Button: View Playlists */}
                          <div className="mt-6 flex flex-col gap-3">
                            <Link to="/playlist">
                              <Button variant="secondary" size="lg" className="w-full">
                                <Plus className="w-5 h-5 mr-2" /> View Playlists
                              </Button>
                            </Link>
                          </div>
                          {/*Button: View Analytics */}
                          <div className="mt-6 flex flex-col gap-3">
                            <Link to="/analytics">
                              <Button variant="secondary" size="lg" className="w-full">
                                <BarChart3 className="w-5 h-5 mr-2" /> View Analytics
                              </Button>
                            </Link>
                          </div>
                          {/*Button: Play a Game*/}
                          <div className="mt-6 flex flex-col gap-3">
                            <Link to="/emotiongame">
                              <Button variant="secondary" size="lg" className="w-full">
                                <Gamepad2 className="w-5 h-5 mr-2" /> Play a fun game
                              </Button>
                            </Link>
                          </div>
                          </div>
                          </div>
                        </Card>
                      </div>

                  {/* Song Recommendations */}
                  <div className="lg:col-span-2">
                    <h3 className="text-2xl font-display font-bold mb-10">
                      Songs for Your <span className="gradient-text capitalize">{emotionResult.emotion}</span> Mood
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-10">
                      {emotionResult.songs?.map((song, index) => (
                        <SongCard
                          key={song.name}
                          title={song.name}
                          artist={song.artist.name}
                          emotion={emotionResult.emotion}
                          delay={index * 0.1}
                          link={song.spotifyUrl}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Detect;
