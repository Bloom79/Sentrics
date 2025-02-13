import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authService } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { Loader2 } from 'lucide-react';

interface CommunityUserResponse {
  id: number;
  exists: boolean;
}

export default function CERUserWorkspace() {
  const user = authService.getUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [communityUser, setCommunityUser] = useState<CommunityUserResponse | null>(null);

  useEffect(() => {
    const checkCommunityUser = async () => {
      try {
        const response = await api.get(`/api/v1/app-users/${user?.id}/community-user`);
        setCommunityUser(response.data);
      } catch (error) {
        console.error('Error checking community user:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      checkCommunityUser();
    }
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Workspace</h2>
      </div>

      {communityUser?.exists ? (
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Community Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <iframe 
                  src={`/cer/users/${communityUser.id}/edit`}
                  className="w-full min-h-[600px] border-none"
                  title="Community User Profile"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Community Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>You don't have a community user profile yet. Create one to start participating in the energy community.</p>
            <Button onClick={() => navigate('/cer/users/new')}>
              Create Community Profile
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 