import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Factory, Power, Phone, Mail, MapPin, Calendar } from "lucide-react";
import { Consumer } from "@/types/consumer";
import { format } from "date-fns";
import { EditConsumerDialog } from "./EditConsumerDialog";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { ConsumptionGraphs } from "./ConsumerOverview/ConsumptionGraphs";
import { supabase } from "@/integrations/supabase/client";
import { POD } from "@/types/pod";

interface ConsumerOverviewProps {
  consumer?: Consumer;
}

const ConsumerOverview: React.FC<ConsumerOverviewProps> = ({ consumer }) => {
  const queryClient = useQueryClient();

  const { data: pods } = useQuery({
    queryKey: ['pods', consumer?.id],
    queryFn: async () => {
      if (!consumer?.id) return [];
      
      const { data, error } = await supabase
        .from('pods')
        .select('*')
        .eq('consumer_id', consumer.id);
      
      if (error) throw error;
      return data as POD[];
    },
    enabled: Boolean(consumer?.id),
  });

  const handleConsumerUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ['consumer', consumer?.id] });
  };

  if (!consumer) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">No Consumer Selected</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Please select a consumer to view details</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Basic Information Section */}
      <BasicInformationSection consumer={consumer} onUpdate={handleConsumerUpdate} />

      {/* Contact and Location Information */}
      <ContactLocationSection consumer={consumer} />

      {/* Technical Information */}
      <TechnicalSection consumer={consumer} />

      {/* Consumption Graphs Section */}
      {consumer.id && pods && pods.length > 0 && (
        <ConsumptionGraphs 
          consumerId={consumer.id} 
          pods={pods}
        />
      )}
    </div>
  );
};

export default ConsumerOverview;

// Create separate components for each section
const BasicInformationSection: React.FC<{ consumer: Consumer; onUpdate: () => void }> = ({ consumer, onUpdate }) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Basic Information</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Name:</span>
            <span className="text-sm font-medium">{consumer.full_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Type:</span>
            <span className="text-sm font-medium capitalize">{consumer.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Status:</span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
              ${consumer.status === 'active' 
                ? 'bg-green-100 text-green-800'
                : consumer.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
              }`}>
              {consumer.status}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Created:</span>
            <span className="text-sm font-medium">{format(new Date(consumer.created_at), 'PP')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

const ContactLocationSection: React.FC<{ consumer: Consumer }> = ({ consumer }) => (
  <div className="grid gap-4 md:grid-cols-2">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Contact Information</CardTitle>
        <Phone className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Contact Person:</span>
            <span className="text-sm font-medium">{consumer.contact_person || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Phone:</span>
            <span className="text-sm font-medium">{consumer.phone || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Email:</span>
            <span className="text-sm font-medium">{consumer.email || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">VAT Number:</span>
            <span className="text-sm font-medium">{consumer.vat_number || 'N/A'}</span>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Location</CardTitle>
        <MapPin className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Address:</span>
            <span className="text-sm font-medium">{consumer.address || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">City:</span>
            <span className="text-sm font-medium">{consumer.city || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Postal Code:</span>
            <span className="text-sm font-medium">{consumer.postal_code || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Country:</span>
            <span className="text-sm font-medium">{consumer.country || 'N/A'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

const TechnicalSection: React.FC<{ consumer: Consumer }> = ({ consumer }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Technical Specifications</CardTitle>
      <Power className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Peak Demand:</span>
          <span className="text-sm font-medium">{consumer.specs?.peakDemand || 0} kW</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Daily Usage:</span>
          <span className="text-sm font-medium">{consumer.specs?.dailyUsage || 0} kWh</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Power Factor:</span>
          <span className="text-sm font-medium">{consumer.specs?.powerFactor || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Connection Type:</span>
          <span className="text-sm font-medium capitalize">{consumer.specs?.connectionType || 'N/A'}</span>
        </div>
      </div>
    </CardContent>
  </Card>
);