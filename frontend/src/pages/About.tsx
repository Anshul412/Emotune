import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Brain, Music2, Smile, Users, Target, Heart, ArrowRight } from "lucide-react";

const About = () => {
  const team = [
    { name: "AI Model", role: "Deep Learning", description: "Trained on millions of facial expressions to accurately detect emotions" },
    { name: "Music Engine", role: "Recommendation", description: "Curates the perfect playlist based on your emotional state" },
    { name: "Privacy", role: "Security", description: "Images are processed locally and never stored" },
  ];

  const stats = [
    { value: "80%", label: "Accuracy" },
    { value: "7", label: "Emotions Detected" },
    { value: "10K+", label: "Songs Curated" },
    { value: "<5s", label: "Response Time" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-display font-bold mb-6"
          >
            About EmoTune
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            We believe music has the power to transform your mood. Our mission is to connect 
            your emotions with the perfect soundtrack using cutting-edge AI technology.
          </motion.p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="glass" className="p-6 text-center">
                  <div className="text-4xl font-display font-bold gradient-text mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              The Technology Behind
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A combination of deep learning and music intelligence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card variant="glass" className="p-8 h-full">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6">
                  <Brain className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-4">Facial Emotion Recognition</h3>
                <p className="text-muted-foreground mb-4">
                  Our deep learning model is trained on extensive facial expression datasets, 
                  enabling it to accurately identify 7 distinct emotional states from facial features.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Smile className="w-4 h-4 text-primary" />
                    Happy, Sad, Angry, Surprise
                  </li>
                  <li className="flex items-center gap-2">
                    <Smile className="w-4 h-4 text-primary" />
                    Fear, Disgust, Neutral
                  </li>
                </ul>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card variant="glass" className="p-8 h-full">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center mb-6">
                  <Music2 className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-4">Music Recommendation Engine</h3>
                <p className="text-muted-foreground mb-4">
                  Our recommendation system maps detected emotions to musical attributes like tempo, 
                  key, energy, and valence to find songs that perfectly complement your mood.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    Mood-based curation
                  </li>
                  <li className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-primary" />
                    Personalized recommendations
                  </li>
                </ul>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              What Makes Us Different
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="glass" className="p-6 text-center h-full">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-10 h-10 text-primary" />
                  </div>
                  <h4 className="font-display font-semibold text-lg mb-1">{item.name}</h4>
                  <p className="text-primary text-sm mb-3">{item.role}</p>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20" />
            <div className="absolute inset-0 bg-secondary/50 backdrop-blur-xl" />
            
            <div className="relative z-10 p-8 md:p-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Ready to Experience It?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Try our emotion detection and discover music that truly resonates with how you feel.
              </p>
              <Button variant="hero" size="xl" asChild>
                <Link to="/signup" className="flex items-center gap-2">
                  Start Detection
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
