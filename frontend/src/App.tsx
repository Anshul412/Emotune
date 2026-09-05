import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Detect from "./pages/Detect";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Playlist from "./pages/Playlist";
import Favourites from "./pages/Favourites";
import Analytics from "./pages/Analytics";
import GamePage from "./pages/GamePage";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/detect" element={<Detect />} />
          <Route path="/about" element={<About />} />
          <Route path="/playlist" element={<Playlist />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/emotiongame" element={<GamePage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);


export default App;