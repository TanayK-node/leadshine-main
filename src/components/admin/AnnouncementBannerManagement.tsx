import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Megaphone } from "lucide-react";

interface AnnouncementBanner {
  id: string;
  text: string;
  button_text: string | null;
  button_link: string | null;
  is_active: boolean;
  bg_color: string;
  text_color: string;
}

export const AnnouncementBannerManagement = () => {
  const [banner, setBanner] = useState<AnnouncementBanner | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBanner();
  }, []);

  const fetchBanner = async () => {
    try {
      const { data, error } = await supabase
        .from("announcement_banner")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setBanner(data);
      }
    } catch (error: any) {
      console.error("Error fetching banner:", error);
      toast.error("Failed to load announcement banner");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!banner) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("announcement_banner")
        .update({
          text: banner.text,
          button_text: banner.button_text || null,
          button_link: banner.button_link || null,
          is_active: banner.is_active,
          bg_color: banner.bg_color,
          text_color: banner.text_color,
        })
        .eq("id", banner.id);

      if (error) throw error;

      toast.success("Announcement banner updated successfully");
      fetchBanner();
    } catch (error: any) {
      console.error("Error saving banner:", error);
      toast.error("Failed to save announcement banner");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading announcement banner...</p>
        </CardContent>
      </Card>
    );
  }

  if (!banner) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No announcement banner found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Megaphone className="h-6 w-6" />
          Announcement Banner
        </CardTitle>
        <CardDescription>
          Customize the announcement banner that appears at the top of your site
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <Label htmlFor="is_active" className="text-base font-medium">
              Banner Status
            </Label>
            <p className="text-sm text-muted-foreground">
              {banner.is_active ? "Banner is currently visible" : "Banner is currently hidden"}
            </p>
          </div>
          <Switch
            id="is_active"
            checked={banner.is_active}
            onCheckedChange={(checked) =>
              setBanner({ ...banner, is_active: checked })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="text">Banner Text *</Label>
          <Input
            id="text"
            value={banner.text}
            onChange={(e) => setBanner({ ...banner, text: e.target.value })}
            placeholder="🎉 BIGGEST Wholesale Sale - Up to 50% Off"
          />
          <p className="text-xs text-muted-foreground">
            You can use emojis to make your banner more engaging
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="button_text">Button Text (Optional)</Label>
            <Input
              id="button_text"
              value={banner.button_text || ""}
              onChange={(e) =>
                setBanner({ ...banner, button_text: e.target.value })
              }
              placeholder="Shop Now"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="button_link">Button Link (Optional)</Label>
            <Input
              id="button_link"
              value={banner.button_link || ""}
              onChange={(e) =>
                setBanner({ ...banner, button_link: e.target.value })
              }
              placeholder="/shop-all"
            />
            <p className="text-xs text-muted-foreground">
              Use relative links like /shop-all or external links
            </p>
          </div>
        </div>

        <div className="p-4 border rounded-lg bg-muted/50">
          <Label className="text-sm font-medium mb-2 block">Preview</Label>
          <div className={`${banner.bg_color} ${banner.text_color} py-3 px-4 rounded flex items-center justify-center gap-4`}>
            <p className="text-sm font-medium">{banner.text}</p>
            {banner.button_text && (
              <Button
                size="sm"
                variant="secondary"
                className="h-7 text-xs"
              >
                {banner.button_text}
              </Button>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={fetchBanner}>
            Reset
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
