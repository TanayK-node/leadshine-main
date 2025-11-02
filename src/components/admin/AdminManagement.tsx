import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Trash2, Shield, ShieldAlert } from "lucide-react";

interface AdminUser {
  id: string;
  user_id: string;
  role: string;
  is_root: boolean;
  created_at: string;
  email?: string;
}

export const AdminManagement = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isRootAdmin, setIsRootAdmin] = useState(false);

  useEffect(() => {
    checkRootAdmin();
    fetchAdmins();
  }, []);

  const checkRootAdmin = async () => {
    const { data, error } = await supabase.rpc('is_root_admin');
    if (!error && data) {
      setIsRootAdmin(true);
    }
  };

  const fetchAdmins = async () => {
    try {
      const { data, error } = await supabase.rpc('get_admin_users');

      if (error) throw error;

      setAdmins(data || []);
    } catch (error: any) {
      console.error('Error fetching admins:', error);
      toast.error("Failed to load admin users");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newAdminEmail)) {
        toast.error("Please enter a valid email address");
        return;
      }

      // Call the database function to add admin
      const { data, error } = await supabase.rpc('add_admin_by_email', {
        admin_email: newAdminEmail.toLowerCase()
      });

      if (error) throw error;

      const result = data as { success: boolean; error?: string; message?: string };

      if (!result.success) {
        toast.error(result.error || "Failed to add admin");
        return;
      }

      toast.success(result.message || "Admin added successfully");
      setDialogOpen(false);
      setNewAdminEmail("");
      fetchAdmins();
    } catch (error: any) {
      console.error('Error adding admin:', error);
      toast.error("Failed to add admin: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveAdmin = async (adminId: string, isRoot: boolean, email: string) => {
    if (isRoot) {
      toast.error("Cannot remove root admin");
      return;
    }

    if (!confirm(`Are you sure you want to remove admin access from ${email}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("id", adminId);

      if (error) throw error;

      toast.success("Admin removed successfully");
      fetchAdmins();
    } catch (error: any) {
      console.error('Error removing admin:', error);
      toast.error("Failed to remove admin: " + error.message);
    }
  };

  if (!isRootAdmin) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Only root administrators can manage admin users.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading admin users...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Admin Management</CardTitle>
            <CardDescription>
              Manage administrator access to the admin panel
            </CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Admin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Administrator</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    User must already have an account on the platform
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Adding..." : "Add Admin"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Added</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    No administrators found
                  </TableCell>
                </TableRow>
              ) : (
                admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {admin.is_root ? (
                          <ShieldAlert className="h-4 w-4 text-orange-500" />
                        ) : (
                          <Shield className="h-4 w-4 text-blue-500" />
                        )}
                        {admin.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={admin.is_root ? "destructive" : "default"}
                        className={admin.is_root ? "" : "bg-blue-500"}
                      >
                        {admin.is_root ? "Root Admin" : "Admin"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(admin.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {!admin.is_root && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleRemoveAdmin(admin.id, admin.is_root, admin.email || '')
                          }
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
