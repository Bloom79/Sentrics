import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DataTable } from '@/components/ui/data-table';
import { formatDate } from '@/lib/utils';

type Producer = {
  id: number;
  name: string;
  capacity: number;
  available_capacity: number;
  last_reading_date: string;
};

type SharingStatistics = {
  total_shared: number;
  total_available: number;
  total_producers: number;
  total_consumers: number;
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export default function EnergySharing() {
  const { id: communityId } = useParams<{ id: string }>();

  const { data: producers = [], isLoading: isLoadingProducers } = useQuery({
    queryKey: ['producers', communityId],
    queryFn: async () => {
      const response = await api.get(`/api/cer/communities/${communityId}/producers`);
      return response.data as Producer[];
    },
  });

  const { data: statistics, isLoading: isLoadingStats } = useQuery({
    queryKey: ['sharing-statistics', communityId],
    queryFn: async () => {
      const response = await api.get(`/api/cer/communities/${communityId}/sharing/statistics`);
      return response.data as SharingStatistics;
    },
  });

  const columns = [
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Producer',
    },
    {
      id: 'capacity',
      accessorKey: 'capacity',
      header: 'Total Capacity (kW)',
      cell: ({ row }) => formatNumber(row.getValue('capacity')),
    },
    {
      id: 'available_capacity',
      accessorKey: 'available_capacity',
      header: 'Available (kW)',
      cell: ({ row }) => formatNumber(row.getValue('available_capacity')),
    },
    {
      id: 'last_reading_date',
      accessorKey: 'last_reading_date',
      header: 'Last Reading',
      cell: ({ row }) => formatDate(row.getValue('last_reading_date')),
    },
  ];

  if (isLoadingProducers || isLoadingStats) {
    return (
      <div className="flex items-center justify-center h-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!statistics) {
    return (
      <Alert>
        <AlertDescription>Failed to load sharing statistics</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Energy Sharing</h1>
        <Button>Create Share</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Shared</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(statistics.total_shared)} kW</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(statistics.total_available)} kW</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Producers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.total_producers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Consumers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.total_consumers}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Producers</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={producers}
            isLoading={isLoadingProducers}
          />
        </CardContent>
      </Card>
    </div>
  );
} 