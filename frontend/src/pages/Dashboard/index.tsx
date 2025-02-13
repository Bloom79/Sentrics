import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Activity, Bitcoin } from 'lucide-react';

export function Dashboard() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">SentricS Dashboard</h1>
      <h2 className="text-xl font-semibold mb-4">Asset Management</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/sites">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader>
              <Building2 className="h-8 w-8 mb-2" />
              <CardTitle>Sites2</CardTitle>
              <CardDescription>
                Manage and monitor a all energy production sites and their components.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/grid">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader>
              <Activity className="h-8 w-8 mb-2" />
              <CardTitle>Energy Grid</CardTitle>
              <CardDescription>
                Monitor grid connections, power flow, and system health.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/simulation/crypto-mining">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader>
              <Bitcoin className="h-8 w-8 mb-2" />
              <CardTitle>Crypto Mining</CardTitle>
              <CardDescription>
                Simulate and optimize crypto mining operations using renewable energy.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        {/* Add other cards as needed */}
      </div>
    </div>
  );
} 