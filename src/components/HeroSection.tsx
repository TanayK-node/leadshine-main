import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Shield, Package, TrendingUp } from "lucide-react";
import heroBackground from "@/assets/hero-background.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-mesh">
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-bounce-slow"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-bounce-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-bounce-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Floating image */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 hidden lg:block">
        <img
          src={heroBackground}
          alt="Colorful toys background"
          className="w-full h-auto object-contain animate-float drop-shadow-2xl"
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="max-w-2xl">
          {/* Main content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-6 py-3 shadow-glow hover-wiggle">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm font-bold font-display">India's #1 Toy Store! 🎉</span>
            </div>

            {/* Heading */}
            <div className="space-y-6">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-display font-bold text-foreground leading-[1.05]">
                Bringing Joy to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-primary">Every Child</span>
              </h1>
              <p className="text-2xl sm:text-3xl text-foreground/80 leading-relaxed max-w-xl font-display">
                Premium toys from trusted brands. Fun guaranteed! 🎈
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button variant="default" size="xl" className="group shadow-glow hover-pop font-display text-lg">
                Explore Collection 🚀
                <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </Button>
              <Button variant="secondary" size="xl" className="shadow-card hover-pop font-display text-lg">
                Get Wholesale Pricing 💰
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-10 pt-10">
              <div className="text-center">
                <div className="text-5xl font-display font-bold text-primary">50K+</div>
                <div className="text-base text-muted-foreground font-display">Happy Retailers</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-display font-bold text-accent">500+</div>
                <div className="text-base text-muted-foreground font-display">Products</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-display font-bold text-secondary">98%</div>
                <div className="text-base text-muted-foreground font-display">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;