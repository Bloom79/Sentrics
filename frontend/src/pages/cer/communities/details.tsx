import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ClipboardCheck, Share2, Users, Receipt } from 'lucide-react';
import { formatDate } from '@/lib/utils';

type EnergyCommunity = {
  id: number;
  name: string;
  legal_type: string;
  description: string;
  boundary: string;
  total_capacity: number;
  gse_compliant: boolean;
  created_at: string;
  updated_at: string;
};

export default function CommunityDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: community, isLoading } = useQuery({
    queryKey: ['community', id],
    queryFn: async () => {
      const response = await api.get(`/api/cer/communities/${id}`);
      return response.data as EnergyCommunity;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!community) {
    return (
      <Alert>
        <AlertDescription>Community not found</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{community.name}</h1>
          <p className="text-muted-foreground">{community.description}</p>
        </div>
        <Button variant="outline" onClick={() => navigate(`/cer/communities/${id}/edit`)}>
          Edit Community
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Community Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Legal Type</div>
              <Badge variant="outline" className="mt-1 capitalize">
                {community.legal_type.toLowerCase()}
              </Badge>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Boundary</div>
              <div className="mt-1">{community.boundary}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Total Capacity</div>
              <div className="mt-1">{community.total_capacity} kW</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">GSE Compliance</div>
              <Badge variant={community.gse_compliant ? 'success' : 'destructive'} className="mt-1">
                {community.gse_compliant ? 'Compliant' : 'Non-Compliant'}
              </Badge>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Created</div>
              <div className="mt-1">{formatDate(community.created_at)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Last Updated</div>
              <div className="mt-1">{formatDate(community.updated_at)}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate(`/cer/communities/${id}/members`)}
            >
              <Users className="w-4 h-4 mr-2" />
              Manage Members
            </Button>
            <Button variant="outline" asChild>
              <Link to={`/cer/communities/${id}/compliance`}>
                <ClipboardCheck className="w-4 h-4 mr-2" />
                Compliance Records
              </Link>
            </Button>
            <Button asChild>
              <Link to={`/cer/communities/${id}/share`}>
                <Share2 className="w-4 h-4 mr-2" />
                Energy Sharing
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate(`/cer/communities/${id}/billing`)}
            >
              <Receipt className="w-4 h-4 mr-2" />
              Billing
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="sharing">Energy Sharing</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        <TabsContent value="members">
          {/* Members tab content */}
        </TabsContent>
        <TabsContent value="sharing">
          {/* Energy sharing tab content */}
        </TabsContent>
        <TabsContent value="compliance">
          {/* Compliance tab content */}
        </TabsContent>
        <TabsContent value="billing">
          {/* Billing tab content */}
        </TabsContent>
      </Tabs>
    </div>
  );
} 