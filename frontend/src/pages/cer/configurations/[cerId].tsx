import React from 'react';
import { useParams } from 'react-router-dom';
import { CERDetails } from '@/components/cer/CERDetails';

export default function CERConfigurationsPage() {
  const { cerId } = useParams<{ cerId: string }>();

  if (!cerId) {
    return <div>Error: CER ID is required</div>;
  }

  return <CERDetails cerId={cerId} />;
} 