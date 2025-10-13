import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-primary rounded-xl p-2">
                <span className="text-primary-foreground font-display font-bold text-xl">
                  ToyVerse
                </span>
              </div>
            </div>
            <p className="text-background/80 leading-relaxed">
              Your trusted partner for premium wholesale toys. We provide safe, 
              educational, and fun toys for retailers and educators worldwide.
            </p>
            <div className="flex space-x-3">
              <Button size="icon" variant="ghost" className="text-background hover:bg-background/10">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="text-background hover:bg-background/10">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="text-background hover:bg-background/10">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="text-background hover:bg-background/10">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-display font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">About Us</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Wholesale Pricing</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Bulk Orders</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Become a Retailer</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Safety Standards</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Quality Assurance</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-display font-semibold">Categories</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Educational Toys</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Building Blocks</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Plush & Soft Toys</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Vehicles & Cars</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">Art & Crafts</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors">School Essentials</a></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-display font-semibold">Stay Connected</h3>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-background/80">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-background/80">wholesale@toyverse.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-background/80">123 Toy Street, Play City, PC 12345</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-3">
              <p className="text-background/80 text-sm">
                Subscribe for wholesale deals and new product updates
              </p>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter your email"
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/60"
                />
                <Button variant="secondary" size="sm">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="pt-8 border-t border-background/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-background/60 text-sm">
              © 2024 ToyVerse Wholesale. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-background/60 hover:text-background transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-background/60 hover:text-background transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-background/60 hover:text-background transition-colors">
                Shipping Policy
              </a>
              <a href="#" className="text-background/60 hover:text-background transition-colors">
                Return Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;