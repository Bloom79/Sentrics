import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus, Pencil, Trash2, Mail } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { InviteUserForm } from "@/components/UserManagement/InviteUserForm";
import { CreateUserForm } from "@/components/UserManagement/CreateUserForm";
import { EditUserForm } from "@/components/UserManagement/EditUserForm";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
  username: string | null;
  invitation_token: string | null;
  invitation_sent_at: string | null;
  invited_by: string | null;
};

export default function UserManagement() {
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = React.useState<Profile | null>(null);

  const { data: profiles, refetch } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      return profilesData as Profile[];
    },
  });

  const handleDeleteUser = async (userId: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ status: "inactive" })
      .eq("id", userId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete user. Please try again.",
      });
    } else {
      toast({
        title: "Success",
        description: "User has been deleted successfully.",
      });
      refetch();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="create" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="create">Create User</TabsTrigger>
                <TabsTrigger value="invite">Send Invitation</TabsTrigger>
              </TabsList>
              <TabsContent value="create">
                <CreateUserForm onSuccess={() => refetch()} />
              </TabsContent>
              <TabsContent value="invite">
                <InviteUserForm onSuccess={() => refetch()} />
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles?.map((profile) => (
              <TableRow key={profile.id}>
                <TableCell>{profile.full_name || "N/A"}</TableCell>
                <TableCell>{profile.email || "N/A"}</TableCell>
                <TableCell className="capitalize">{profile.role}</TableCell>
                <TableCell className="capitalize">{profile.status}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedUser(profile)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit User</DialogTitle>
                        </DialogHeader>
                        <EditUserForm
                          user={selectedUser}
                          onSuccess={() => refetch()}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteUser(profile.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}