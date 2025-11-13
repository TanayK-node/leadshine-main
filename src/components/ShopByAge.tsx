import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const ShopByAge = () => {
  const navigate = useNavigate();
  const [ageGroups, setAgeGroups] = useState([
    { range: "0-2 Years", description: "Infants & Toddlers", color: "bg-toy-pink/10 border-toy-pink/20", count: 0 },
    { range: "3-5 Years", description: "Preschoolers", color: "bg-toy-blue/10 border-toy-blue/20", count: 0 },
    { range: "6-8 Years", description: "Early School", color: "bg-toy-yellow/10 border-toy-yellow/20", count: 0 },
    { range: "9-12 Years", description: "Middle School", color: "bg-primary/10 border-primary/20", count: 0 },
    { range: "13+ Years", description: "Teens & Adults", color: "bg-accent/10 border-accent/20", count: 0 },
  ]);

  useEffect(() => {
    fetchAgeCounts();
  }, []);

  const fetchAgeCounts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('age_range');

      if (error) throw error;

      // Count products for each age group
      const updatedGroups = ageGroups.map(group => ({
        ...group,
        count: data?.filter(p => p.age_range === group.range).length || 0
      }));

      setAgeGroups(updatedGroups);
    } catch (error) {
      console.error('Error fetching age counts:', error);
    }
  };

  const handleAgeClick = (ageRange: string) => {
    // Navigate to shop all products with age filter
    navigate(`/shop-all?age=${encodeURIComponent(ageRange)}`);
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-bold text-foreground mb-4">
            Shop by Age Group
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find the perfect toys for every stage of development. Age-appropriate selections ensure safety and engagement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {ageGroups.map((group, index) => (
            <div 
              key={index} 
              className="group bg-white rounded-3xl border-4 border-foreground shadow-sticker hover:shadow-glow hover:scale-105 hover:-rotate-1 transition-all duration-300 p-6 text-center cursor-pointer"
              onClick={() => handleAgeClick(group.range)}
            >
              <div className="space-y-4">
                <div className="text-3xl font-display font-bold text-primary group-hover:animate-pop">
                  {group.range}
                </div>
                <div className="text-sm font-display font-semibold text-foreground">
                  {group.description}
                </div>
                {group.count > 0 && (
                  <div className="text-xs font-display text-muted-foreground bg-accent/20 rounded-full py-1 px-3 inline-block border-2 border-foreground">
                    {group.count} {group.count === 1 ? 'product' : 'products'}
                  </div>
                )}
                <Button className="w-full rounded-full h-10 font-display font-bold text-sm shadow-lg hover-pop border-2 border-foreground mt-2">
                  Explore 🎈
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByAge;