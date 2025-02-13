import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  asset_type: z.enum(["SOLAR", "WIND", "STORAGE", "BIOMASS", "HYDRO"]),
  capacity: z.number().min(0.1).max(100),
  gse_registration_id: z.string().optional(),
  metadata: z.object({
    panel_type: z.string().optional(),
    inverter_model: z.string().optional(),
    orientation: z.string().optional(),
    tilt_angle: z.number().optional(),
  }).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface Member {
  id: string;
  member_type: string;
  pod_id: string;
}

interface AddAssetDialogProps {
  member: Member;
  children: ReactNode;
}

export function AddAssetDialog({ member, children }: AddAssetDialogProps) {
  const queryClient = useQueryClient();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      asset_type: "SOLAR",
      capacity: 0,
      gse_registration_id: "",
      metadata: {
        panel_type: "",
        inverter_model: "",
        orientation: "south",
        tilt_angle: 30,
      },
    },
  });

  const { mutate: addAsset, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch(`/api/cer/members/${member.id}/assets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          installation_date: new Date().toISOString(),
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to add asset");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-members"] });
      toast.success("Asset added successfully");
      form.reset();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  function onSubmit(data: FormData) {
    addAsset(data);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Asset</DialogTitle>
          <DialogDescription>
            Add a new energy asset for {member.pod_id}. Fill in the required information below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="asset_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select asset type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SOLAR">Solar PV</SelectItem>
                      <SelectItem value="WIND">Wind Turbine</SelectItem>
                      <SelectItem value="STORAGE">Energy Storage</SelectItem>
                      <SelectItem value="BIOMASS">Biomass Plant</SelectItem>
                      <SelectItem value="HYDRO">Hydroelectric</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacity (kW)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter capacity"
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gse_registration_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GSE Registration ID (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter GSE ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch("asset_type") === "SOLAR" && (
              <>
                <FormField
                  control={form.control}
                  name="metadata.panel_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Panel Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select panel type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="monocrystalline">Monocrystalline</SelectItem>
                          <SelectItem value="polycrystalline">Polycrystalline</SelectItem>
                          <SelectItem value="thin_film">Thin Film</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="metadata.orientation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Orientation</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select orientation" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="north">North</SelectItem>
                          <SelectItem value="south">South</SelectItem>
                          <SelectItem value="east">East</SelectItem>
                          <SelectItem value="west">West</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="metadata.tilt_angle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tilt Angle (degrees)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter tilt angle"
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Adding..." : "Add Asset"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 