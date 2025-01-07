import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Consumer, ConsumerSpecs } from "@/types/site";
import { AddConsumerDialog } from "./AddConsumerDialog";

interface ConsumerManagementProps {
  onSuccess?: () => void;
}

const ConsumerManagement: React.FC<ConsumerManagementProps> = ({ onSuccess }) => {
  const { data: consumers, isLoading } = useQuery({
    queryKey: ['consumers'],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) throw new Error(error.message);
      
      // Transform the data to match the Consumer type
      return data.map(profile => ({
        ...profile,
        specs: profile.specs as ConsumerSpecs // Type assertion for specs
      })) as Consumer[];
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <AddConsumerDialog onSuccess={onSuccess} />
      <div>
        {consumers?.map((consumer) => (
          <div key={consumer.id}>
            <h3>{consumer.full_name}</h3>
            <p>{consumer.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConsumerManagement;