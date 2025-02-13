import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MemberCount {
  producers: number;
  consumers: number;
  prosumers: number;
}

interface MemberStatsProps {
  memberCount: MemberCount;
}

export function MemberStats({ memberCount }: MemberStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Members</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Producers</div>
            <div className="text-2xl font-bold">{memberCount.producers}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Consumers</div>
            <div className="text-2xl font-bold">{memberCount.consumers}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Prosumers</div>
            <div className="text-2xl font-bold">{memberCount.prosumers}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 