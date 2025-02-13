import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MapPin, Calendar, Zap, Battery, Gauge, Plug, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate } from "@/lib/utils";

interface MemberCardProps {
  member: {
    id: number;
    name: string;
    type: 'consumer' | 'producer' | 'prosumer';
    user_type: 'real' | 'simulated';
    status: 'active' | 'inactive' | 'pending';
    pod_id: string;
    smart_meter_id?: string;
    address?: string;
    activation_date?: string;
    contracted_power?: number;
    energy_produced?: number;
    energy_consumed?: number;
    energy_shared?: number;
  };
}

export function MemberCard({ member }: MemberCardProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'producer':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'consumer':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'prosumer':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Link to={`/cer/members/${member.id}/edit`} className="block group">
      <Card className="p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1 truncate">
                  POD: {member.pod_id}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Badge className={cn(
                  "rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap",
                  getTypeColor(member.type)
                )}>
                  {member.type}
                </Badge>
                <Badge variant="outline" className={cn(
                  "rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap",
                  getStatusColor(member.status)
                )}>
                  {member.status}
                </Badge>
              </div>
            </div>

            {member.address && (
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                <span className="truncate">{member.address}</span>
              </div>
            )}

            <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <Badge variant="outline">
                  {member.user_type}
                </Badge>
              </div>
              {member.activation_date && (
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
                  <span>Active since {formatDate(member.activation_date)}</span>
                </div>
              )}
            </div>

            {(member.type === 'producer' || member.type === 'prosumer') && (
              <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm text-gray-600 whitespace-nowrap">Production</div>
                    <div className="text-base font-medium text-gray-900">
                      {member.energy_produced || '0'} kWh
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-blue-500 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm text-gray-600 whitespace-nowrap">Consumption</div>
                    <div className="text-base font-medium text-gray-900">
                      {member.energy_consumed || '0'} kWh
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Battery className="h-4 w-4 text-green-500 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm text-gray-600 whitespace-nowrap">Energy Shared</div>
                    <div className="text-base font-medium text-gray-900">
                      {member.energy_shared || '0'} kWh
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Plug className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {member.contracted_power || 0} kW
                    </span>
                  </div>
                  {member.smart_meter_id && (
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Smart Meter: {member.smart_meter_id}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
} 