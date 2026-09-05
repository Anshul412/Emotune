import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";
import { 
  Camera, 
  Upload, 
  Sparkles, 
  Music2, 
  Zap, 
  Shield, 
  Brain,
  Headphones,
  ArrowRight,
  Play
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Camera,
      title: "Webcam Detection",
      description: "Use your camera for real-time facial emotion recognition with instant results.",
    },
    {
      icon: Upload,
      title: "Image Upload",
      description: "Upload any photo and let our AI analyze the emotions captured in the moment.",
    },
    {
      icon: Brain,
      title: "Deep Learning Model",
      description: "Powered by deep learning models trained on 64 thousand facial expressions.",
    },
    {
      icon: Music2,
      title: "Smart Recommendations",
      description: "Get personalized song suggestions that perfectly match your current mood.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get emotion analysis and music recommendations in under a second.",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your images are processed locally and never stored on our servers.",
    },
  ];

  const steps = [
    { 
      number: "01", 
      title: "Capture or Upload", 
      description: "Use your webcam or upload an image of your face",
      icon: Camera
    },
    { 
      number: "02", 
      title: "AI Analysis", 
      description: "Our deep learning model detects your emotion",
      icon: Brain
    },
    { 
      number: "03", 
      title: "Get Music", 
      description: "Receive curated song recommendations for your mood",
      icon: Headphones
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-7xl font-display font-bold mb-6 leading-tight"
            >
              Let Your Emotions              <br />
              Choose Your Music
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            >
              Experience music that truly resonates with how you feel. Our software analyzes your facial expressions 
              to recommend the perfect soundtrack for your mood.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button variant="glass" size="xl" asChild>
                <Link to="/signup" className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Try It Now
                </Link>
              </Button>
              <Button variant="glass" size="xl" asChild>
                <Link to="/about" className="flex items-center gap-2">
                  Learn More
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20 relative"
          >
            
            {/* Glow effect */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-3xl opacity-50" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-30 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to discover music that matches your mood
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="mt-40 py-40 px-4 bg-secondary/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to your perfect playlist
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative text-center"
              >
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/50 to-accent/50" />
                )}
                
                <div className="relative z-10 inline-flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-border flex items-center justify-center mb-6">
                    <step.icon className="w-12 h-12 text-primary" />
                  </div>
                  <span className="text-5xl font-display font-bold gradient-text mb-4">{step.number}</span>
                  <h3 className="text-xl font-display font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm max-w-xs">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20" />
            <div className="absolute inset-0 bg-secondary/50 backdrop-blur-xl" />
            
            {/* Content */}
            <div className="relative z-10 p-8 md:p-16 text-center">
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
                Ready to Discover Your Sound?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Join thousands of users who have found their perfect playlist through emotion-driven music discovery.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/signup">Get Started for Free</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
