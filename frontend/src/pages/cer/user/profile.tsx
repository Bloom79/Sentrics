import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditUserForm } from "@/components/UserManagement/EditUserForm";
import { authService } from '@/lib/auth';
import { useToast } from '@/components/ui/use-toast';

export default function CERUserProfile() {
  const user = authService.getUser();
  const { toast } = useToast();

  const handleSuccess = () => {
    toast({
      title: "Success",
      description: "Your profile has been updated successfully.",
    });
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">My Profile</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <EditUserForm user={user} onSuccess={handleSuccess} />
        </CardContent>
      </Card>
    </div>
  );
} 