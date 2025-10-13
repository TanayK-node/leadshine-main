import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Gift, Truck, Shield } from "lucide-react";

const SpecialOffers = () => {
  return (
    <section className="py-20 bg-gradient-hero">
      <div className="container mx-auto px-4">
        {/* Main offer banner */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
            🎉 Biggest Sale of the Year!
          </h2>
          <p className="text-2xl text-primary font-semibold mb-6">
            UP TO 70% OFF on Wholesale Orders
          </p>
          <div className="bg-card rounded-2xl p-8 shadow-glow max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="text-left">
                <h3 className="text-3xl font-display font-bold text-foreground mb-4">
                  Use Code: <span className="text-primary">BIGGESTSALE</span>
                </h3>
                <p className="text-muted-foreground mb-6">
                  Get additional 10% off on your entire order when you spend $500 or more. 
                  Limited time offer - valid until stock lasts!
                </p>
                <Button variant="hero" size="xl" className="w-full md:w-auto">
                  Shop Now & Save Big
                </Button>
              </div>
              <div className="text-center">
                <div className="bg-gradient-primary rounded-full w-32 h-32 mx-auto flex items-center justify-center mb-4">
                  <div className="text-center">
                    <div className="text-3xl font-display font-bold text-primary-foreground">70%</div>
                    <div className="text-sm text-primary-foreground">OFF</div>
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Limited Time Offer</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center p-6 hover-lift border-0 shadow-card">
            <CardContent className="p-0">
              <div className="bg-toy-pink rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Gift className="h-8 w-8 text-foreground" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">
                Bulk Discounts
              </h3>
              <p className="text-sm text-muted-foreground">
                Save more with larger orders. Progressive discounts up to 50% off.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover-lift border-0 shadow-card">
            <CardContent className="p-0">
              <div className="bg-toy-blue rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Truck className="h-8 w-8 text-foreground" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">
                Free Shipping
              </h3>
              <p className="text-sm text-muted-foreground">
                Free shipping on all orders over $500. Fast and secure delivery.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover-lift border-0 shadow-card">
            <CardContent className="p-0">
              <div className="bg-toy-yellow rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-foreground" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">
                Quality Guarantee
              </h3>
              <p className="text-sm text-muted-foreground">
                All toys are safety certified and come with quality guarantee.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover-lift border-0 shadow-card">
            <CardContent className="p-0">
              <div className="bg-secondary-light rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-8 w-8 text-foreground" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">
                Fast Processing
              </h3>
              <p className="text-sm text-muted-foreground">
                Orders processed within 24 hours. Quick turnaround for your business.
              </p>
            </CardContent>
          </Card>
        </div>

      </div>
    </section>
  );
};

export default SpecialOffers;