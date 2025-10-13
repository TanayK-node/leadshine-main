import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import blocksImage from "@/assets/blocks-category.jpg";
import plushImage from "@/assets/plush-category.jpg";
import vehiclesImage from "@/assets/vehicles-category.jpg";

const categories = [
  {
    title: "Building Blocks",
    description: "Educational construction toys for creative minds",
    image: blocksImage,
    color: "bg-toy-blue",
    itemCount: "120+ items",
  },
  {
    title: "Plush & Soft Toys",
    description: "Cuddly companions that spark imagination",
    image: plushImage,
    color: "bg-toy-pink",
    itemCount: "85+ items",
  },
  {
    title: "Vehicles & Cars",
    description: "Rolling adventures for little drivers",
    image: vehiclesImage,
    color: "bg-toy-yellow",
    itemCount: "95+ items",
  },
];

const CategorySection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
            Shop by Category
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our carefully curated collections designed to inspire learning, 
            creativity, and endless fun for children of all ages.
          </p>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Card key={index} className="group hover-lift cursor-pointer border-0 shadow-card overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={category.image}
                    alt={`${category.title} - wholesale toys category`}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  
                  {/* Category badge */}
                  <div className={`absolute top-4 left-4 ${category.color} text-foreground px-3 py-1 rounded-full text-sm font-medium`}>
                    {category.itemCount}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {category.description}
                  </p>
                  
                  <Button variant="ghost" className="group/btn p-0 h-auto font-medium">
                    Explore Collection
                    <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Button variant="playful" size="lg">
            View All Categories
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;