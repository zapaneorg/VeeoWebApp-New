import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, TrendingUp, Users, Car, DollarSign, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const MetricCard = ({ title, value, icon: Icon, trend, description }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {trend && (
        <p className={`text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
          <TrendingUp className="h-3 w-3 mr-1" />
          {trend > 0 ? '+' : ''}{trend}% vs période précédente
        </p>
      )}
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </CardContent>
  </Card>
);

const AdminAnalytics = () => {
  const [metrics, setMetrics] = useState({
    totalBookings: 0,
    activeDrivers: 0,
    totalRevenue: 0,
    avgRating: 0,
    completionRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [bookingsRes, driversRes] = await Promise.all([
          supabase.from('bookings').select('status, estimated_price, rating').neq('status', 'cancelled'),
          supabase.from('profiles').select('status').eq('role', 'driver').eq('status', 'active'),
        ]);

        const bookings = bookingsRes.data || [];
        const drivers = driversRes.data || [];

        const completedBookings = bookings.filter(b => b.status === 'completed');
        const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.estimated_price || 0), 0);
        const ratingsSum = completedBookings.reduce((sum, b) => sum + (b.rating || 0), 0);
        const avgRating = ratingsSum / completedBookings.length || 0;
        const completionRate = (completedBookings.length / bookings.length) * 100 || 0;

        setMetrics({
          totalBookings: bookings.length,
          activeDrivers: drivers.length,
          totalRevenue,
          avgRating,
          completionRate,
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return <div className="flex justify-center p-8"><Clock className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total des courses"
          value={metrics.totalBookings}
          icon={Car}
          description="Toutes les courses (hors annulées)"
        />
        <MetricCard
          title="Chauffeurs actifs"
          value={metrics.activeDrivers}
          icon={Users}
          description="Chauffeurs disponibles"
        />
        <MetricCard
          title="Chiffre d'affaires"
          value={`${metrics.totalRevenue.toFixed(2)}€`}
          icon={DollarSign}
          description="Courses terminées"
        />
        <MetricCard
          title="Note moyenne"
          value={metrics.avgRating.toFixed(1)}
          icon={TrendingUp}
          description="Satisfaction client"
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="bookings">Réservations</TabsTrigger>
          <TabsTrigger value="drivers">Chauffeurs</TabsTrigger>
          <TabsTrigger value="revenue">Revenus</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Taux de completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {metrics.completionRate.toFixed(1)}%
              </div>
              <p className="text-sm text-muted-foreground">
                Pourcentage de courses menées à terme
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Analyse des réservations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Graphiques détaillés des réservations à venir...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="drivers">
          <Card>
            <CardHeader>
              <CardTitle>Performance des chauffeurs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Statistiques des chauffeurs à venir...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Analyse des revenus</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Graphiques de revenus à venir...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAnalytics;