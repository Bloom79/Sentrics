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
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import React from "react";

const baseFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  user_type: z.enum(["RESIDENTIAL", "COMMERCIAL", "INDUSTRIAL"]),
  consumption_class: z.string().min(1, "Consumption class is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

const productionFormSchema = z.object({
  plant_type: z.enum(["PHOTOVOLTAIC", "WIND", "HYDRO", "BIOMASS"]),
  plant_capacity: z.number().min(0, "Capacity must be positive"),
  commissioning_date: z.date(),
  is_incentivized: z.boolean(),
  capital_contribution: z.number().min(0).max(100, "Contribution must be between 0 and 100"),
  has_storage: z.boolean(),
  storage_capacity: z.number().optional(),
});

const formSchema = z.discriminatedUnion("member_type", [
  z.object({
    member_type: z.literal("CONSUMER"),
    ...baseFormSchema.shape,
  }),
  z.object({
    member_type: z.literal("PRODUCER"),
    ...baseFormSchema.shape,
    ...productionFormSchema.shape,
  }),
  z.object({
    member_type: z.literal("PROSUMER"),
    ...baseFormSchema.shape,
    ...productionFormSchema.shape,
  }),
]);

type FormData = z.infer<typeof formSchema>;

interface AddMemberDialogProps {
  children: ReactNode;
  communityId: string;
}

export function AddMemberDialog({ children, communityId }: AddMemberDialogProps) {
  const queryClient = useQueryClient();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      member_type: "CONSUMER",
      name: "",
      user_type: "RESIDENTIAL",
      consumption_class: "",
      quantity: 1,
    } as { 
      member_type: "CONSUMER";
      name: string;
      user_type: "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL";
      consumption_class: string;
      quantity: number;
    },
  });

  const memberType = form.watch("member_type");
  const hasStorage = form.watch("has_storage");
  const showProductionFields = memberType === "PRODUCER" || memberType === "PROSUMER";

  // When member type changes, set production field defaults if needed
  React.useEffect(() => {
    if (showProductionFields) {
      form.setValue("plant_type", "PHOTOVOLTAIC", { shouldValidate: true });
      form.setValue("plant_capacity", 0, { shouldValidate: true });
      form.setValue("commissioning_date", new Date(), { shouldValidate: true });
      form.setValue("is_incentivized", false, { shouldValidate: true });
      form.setValue("capital_contribution", 0, { shouldValidate: true });
      form.setValue("has_storage", false, { shouldValidate: true });
      form.setValue("storage_capacity", 0, { shouldValidate: true });
    }
  }, [showProductionFields, form]);

  const { mutate: addMember, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch(`/api/cer/communities/${communityId}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Failed to add member");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-members", communityId] });
      toast.success("Member added successfully");
      form.reset();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  function onSubmit(data: FormData) {
    addMember(data);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Member</DialogTitle>
          <DialogDescription>
            Add a new member to your energy community. Fill in the required information below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter member name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="member_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Member Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select member type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CONSUMER">Consumer</SelectItem>
                        <SelectItem value="PRODUCER">Producer</SelectItem>
                        <SelectItem value="PROSUMER">Prosumer</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="user_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select user type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="RESIDENTIAL">Residential</SelectItem>
                        <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                        <SelectItem value="INDUSTRIAL">Industrial</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="consumption_class"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Consumption Class</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select consumption class" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CLASS_1">Class 1 (≤ 2,000 kWh/year)</SelectItem>
                      <SelectItem value="CLASS_2">Class 2 (2,001-3,000 kWh/year)</SelectItem>
                      <SelectItem value="CLASS_3">Class 3 (3,001-4,000 kWh/year)</SelectItem>
                      <SelectItem value="CLASS_4">Class 4 (4,001-6,000 kWh/year)</SelectItem>
                      <SelectItem value="CLASS_5">Class 5 (&gt; 6,000 kWh/year)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1}
                      placeholder="Enter number of entries"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    If greater than 1, multiple entries will be created with sequential numbering (e.g., "Name 1", "Name 2", etc.)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showProductionFields && (
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-medium">Production Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="plant_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Plant Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select plant type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="PHOTOVOLTAIC">Photovoltaic</SelectItem>
                            <SelectItem value="WIND">Wind</SelectItem>
                            <SelectItem value="HYDRO">Hydro</SelectItem>
                            <SelectItem value="BIOMASS">Biomass</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="plant_capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Plant Capacity (kW)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Enter capacity"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="commissioning_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Commissioning Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="is_incentivized"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Incentivized Plant</FormLabel>
                        <FormDescription>
                          Check if the plant is eligible for incentives
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="capital_contribution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capital Contribution (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter contribution percentage"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the percentage of capital contribution (0-100)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="has_storage"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Has Storage</FormLabel>
                          <FormDescription>
                            Check if the plant has energy storage capabilities
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  {hasStorage && (
                    <FormField
                      control={form.control}
                      name="storage_capacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Storage Capacity (kWh)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter storage capacity"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Adding..." : "Add Member"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 