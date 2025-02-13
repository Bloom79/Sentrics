import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLoadProfiles } from '@/hooks/use-load-profiles';
import { LoadProfile } from '@/lib/api/cer';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Upload, Search, Trash2, Edit2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LoadProfilesProps {
  onSelect?: (profile: LoadProfile) => void;
  type?: string;
  visibility?: string;
}

export function LoadProfiles({ onSelect, type, visibility }: LoadProfilesProps) {
  const [search, setSearch] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    profiles,
    isLoading,
    error,
    createProfile,
    deleteProfile,
    downloadTemplate,
    isCreating,
    isDeleting
  } = useLoadProfiles({ type, visibility, search });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const profile = {
      name: formData.get('name') as string,
      type: formData.get('type') as string,
      visibility: formData.get('visibility') as string,
      data_source: selectedFile ? 'file' : 'template',
      description: formData.get('description') as string,
    };
    createProfile({ profile, file: selectedFile || undefined });
    setShowCreateDialog(false);
    setSelectedFile(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search profiles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={downloadTemplate}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Template
          </Button>
          <Button
            size="sm"
            onClick={() => setShowCreateDialog(true)}
          >
            <Upload className="w-4 h-4 mr-2" />
            Create Profile
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {profiles?.map((profile) => (
          <Card key={profile.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{profile.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {profile.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {profile.type}
                </Badge>
                <Badge variant="secondary">
                  {profile.visibility}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSelect?.(profile)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteProfile(profile.id)}
                  disabled={isDeleting}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}

        {isLoading && (
          <div className="text-center py-8">
            Loading profiles...
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-red-500">
            Error loading profiles
          </div>
        )}

        {!isLoading && !error && (!profiles || profiles.length === 0) && (
          <div className="text-center py-8 text-muted-foreground">
            No profiles found
          </div>
        )}
      </div>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Load Profile</DialogTitle>
            <DialogDescription>
              Create a new load profile from a template or upload your own data.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Name</Label>
                <Input
                  name="name"
                  placeholder="Enter profile name"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Type</Label>
                <Select name="type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Visibility</Label>
                <Select name="visibility" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Description</Label>
                <Input
                  name="description"
                  placeholder="Enter description"
                />
              </div>

              <div className="grid gap-2">
                <Label>Data Source</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={downloadTemplate}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Template
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Upload a CSV file or use a template based on the selected type
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? 'Creating...' : 'Create Profile'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 