import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Consumer } from "@/types/site";
import AddConsumerDialog from "./AddConsumerDialog";

interface ConsumerManagementProps {
  onSuccess?: () => void;
}

const ConsumerManagement: React.FC<ConsumerManagementProps> = ({ onSuccess }) => {
  const { data: consumers, isLoading } = useQuery<Consumer[]>(["consumers"], async () => {
    const { data, error } = await supabase.from("profiles").select("*");
    if (error) throw new Error(error.message);
    return data as Consumer[];
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
