import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { AlertCircle, Pencil, Trash2, CogIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/components/ui/use-toast';

type Community = {
  id: number;
  name: string;
  legal_type: 'cooperative' | 'association';
  status: 'draft' | 'pending_gse' | 'active' | 'archived';
  primary_substation_id: string;
  boundary: GeoJSON.Polygon;
  total_capacity: number;
  gse_compliance: {
    submitted: number;
    approved: number;
  };
  created_at: string;
  updated_at: string;
  region: string;
  member_count: {
    producers: number;
    consumers: number;
    prosumers: number;
  };
};

function ActionButtons({ communityId }: { communityId: number }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/api/cer/communities/${communityId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      toast({
        title: "Success",
        description: "Community deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete community",
        variant: "destructive",
      });
    },
  });

  const handleEdit = () => {
    navigate(`/cer/communities/${communityId}/edit`);
  };

  const handleConfigurations = () => {
    navigate(`/cer/communities/${communityId}/configurations`);
  };

  return (
    <div className="flex space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleConfigurations}
      >
        <CogIcon className="h-4 w-4" />
        <span className="sr-only">Configurations</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleEdit}
      >
        <Pencil className="h-4 w-4" />
        <span className="sr-only">Edit</span>
      </Button>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              community and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate()}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function useColumns() {
  return [
    {
      id: 'name',
      header: 'Name',
      accessorKey: 'name',
      cell: ({ row }) => (
        <Link
          to={`/cer/communities/${row.original.id}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {row.original.name}
        </Link>
      ),
    },
    {
      id: 'legal_type',
      header: 'Legal Type',
      accessorKey: 'legal_type',
      cell: ({ row }) => (
        <span className="capitalize">
          {row.original.legal_type}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.status === 'active'
              ? 'success'
              : row.original.status === 'pending_gse'
              ? 'warning'
              : row.original.status === 'draft'
              ? 'default'
              : 'destructive'
          }
        >
          {row.original.status.replace('_', ' ').toUpperCase()}
        </Badge>
      ),
    },
    {
      id: 'primary_substation_id',
      header: 'Substation ID',
      accessorKey: 'primary_substation_id',
    },
    {
      id: 'total_capacity',
      header: 'Capacity',
      accessorKey: 'total_capacity',
      cell: ({ row }) => (
        <span className={row.original.total_capacity > 200 ? 'text-red-600' : ''}>
          {row.original.total_capacity}/200 kW
        </span>
      ),
    },
    {
      id: 'gse_compliance',
      header: 'GSE Compliance',
      cell: ({ row }) => {
        if (!row.original.gse_compliance) return null;
        
        const approved = row.original.gse_compliance.approved || 0;
        const submitted = row.original.gse_compliance.submitted || 0;
        
        const variant = 
          approved >= 16 ? 'success' :
          approved >= 6 ? 'warning' :
          'destructive';
        
        return (
          <Badge variant={variant}>
            {approved}/{submitted} of 20
          </Badge>
        );
      },
    },
    {
      id: 'member_count',
      header: 'Members',
      cell: ({ row }) => {
        if (!row.original.member_count) return null;
        
        const producers = row.original.member_count.producers || 0;
        const consumers = row.original.member_count.consumers || 0;
        const prosumers = row.original.member_count.prosumers || 0;
        
        return (
          <div className="space-x-2">
            <Badge variant="outline">P: {producers}</Badge>
            <Badge variant="outline">C: {consumers}</Badge>
            <Badge variant="outline">PR: {prosumers}</Badge>
          </div>
        );
      },
    },
    {
      id: 'created_at',
      header: 'Created',
      accessorKey: 'created_at',
      cell: ({ row }) => formatDate(row.original.created_at),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => <ActionButtons communityId={row.original.id} />,
    },
  ];
}

export default function CommunityList() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(100);
  const columns = useColumns();

  const { data, isLoading, error } = useQuery({
    queryKey: ['communities', pageIndex, pageSize],
    queryFn: async () => {
      const response = await api.get('/api/cer/communities', {
        params: {
          skip: pageIndex * pageSize,
          limit: pageSize,
        },
      });
      
      const communities = response.data.data.map((community: any) => ({
        ...community,
        gse_compliance: community.gse_compliance || { submitted: 0, approved: 0 },
        member_count: community.member_count || { producers: 0, consumers: 0, prosumers: 0 },
        total_capacity: community.total_capacity || 0,
        created_at: community.created_at || new Date().toISOString(),
      }));

      return {
        data: communities,
        total: response.data.total
      };
    },
  });

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load communities. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Energy Communities</h1>
          <p className="text-muted-foreground">
            Manage and monitor your energy communities
          </p>
        </div>
        <Button asChild>
          <Link to="/cer/communities/new">Create Community</Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        pageCount={Math.ceil((data?.total || 0) / pageSize)}
        pageIndex={pageIndex}
        pageSize={pageSize}
        onPageIndexChange={setPageIndex}
        onPageSizeChange={setPageSize}
        isLoading={isLoading}
      />
    </div>
  );
} 