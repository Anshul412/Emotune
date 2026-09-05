/*connect spotify API routes so frontend can call*/
import express from "express";
import cors from "cors";
import spotifyRoutes from "./routes/spotify";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/spotify", spotifyRoutes);

app.listen(8000, () => {
  console.log("Backend running on http://localhost:8000");
});
