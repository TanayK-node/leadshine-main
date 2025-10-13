import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter } from "lucide-react";

export const OrderManagement = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Order Management</CardTitle>
            <CardDescription>View and manage all customer orders</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg mb-2">Order management functionality coming soon</p>
          <p className="text-sm">
            This feature requires setting up order-related tables in your database.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
