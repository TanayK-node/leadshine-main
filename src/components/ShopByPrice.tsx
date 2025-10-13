import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const ShopByPrice = () => {
  const priceRanges = [
    { range: "Under ₹500", description: "Budget Friendly", color: "bg-toy-pink/10 border-toy-pink/20" },
    { range: "₹500 - ₹1,000", description: "Mid Range", color: "bg-toy-blue/10 border-toy-blue/20" },
    { range: "₹1,000 - ₹2,500", description: "Premium", color: "bg-toy-yellow/10 border-toy-yellow/20" },
    { range: "₹2,500+", description: "Luxury", color: "bg-primary/10 border-primary/20" },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-bold text-foreground mb-4">
            Shop by Price Range
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find toys that fit your budget. Quality products across all price ranges with wholesale discounts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {priceRanges.map((range, index) => (
            <Card key={index} className={`p-8 text-center cursor-pointer hover:shadow-card transition-all ${range.color}`}>
              <div className="space-y-4">
                <div className="text-2xl font-display font-bold text-foreground">
                  {range.range}
                </div>
                <div className="text-sm text-muted-foreground">
                  {range.description}
                </div>
                <Button variant="ghost" size="sm" className="w-full">
                  Shop Now
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByPrice;