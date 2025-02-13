import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LoadProfile, LoadProfileCreate, loadProfilesApi } from '@/lib/api/cer';
import { useToast } from '@/components/ui/use-toast';

interface UseLoadProfilesProps {
  type?: string;
  visibility?: string;
  search?: string;
}

export function useLoadProfiles({
  type,
  visibility,
  search
}: UseLoadProfilesProps = {}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedProfile, setSelectedProfile] = useState<LoadProfile | null>(null);

  // Query for fetching profiles
  const {
    data: profiles,
    isLoading,
    error
  } = useQuery({
    queryKey: ['load-profiles', { type, visibility, search }],
    queryFn: () => loadProfilesApi.list({ type, visibility, search }),
  });

  // Mutation for creating profiles
  const createMutation = useMutation({
    mutationFn: async ({ profile, file }: { profile: LoadProfileCreate, file?: File }) => {
      return loadProfilesApi.create(profile, file);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['load-profiles'] });
      toast({
        title: 'Success',
        description: 'Load profile created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create load profile',
        variant: 'destructive',
      });
    },
  });

  // Mutation for updating profiles
  const updateMutation = useMutation({
    mutationFn: async ({ id, profile }: { id: string, profile: LoadProfileCreate }) => {
      return loadProfilesApi.update(id, profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['load-profiles'] });
      toast({
        title: 'Success',
        description: 'Load profile updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update load profile',
        variant: 'destructive',
      });
    },
  });

  // Mutation for deleting profiles
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return loadProfilesApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['load-profiles'] });
      toast({
        title: 'Success',
        description: 'Load profile deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete load profile',
        variant: 'destructive',
      });
    },
  });

  // Helper function to download template
  const downloadTemplate = useCallback(() => {
    loadProfilesApi.downloadTemplate();
  }, []);

  return {
    profiles,
    isLoading,
    error,
    selectedProfile,
    setSelectedProfile,
    createProfile: createMutation.mutate,
    updateProfile: updateMutation.mutate,
    deleteProfile: deleteMutation.mutate,
    downloadTemplate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
} 