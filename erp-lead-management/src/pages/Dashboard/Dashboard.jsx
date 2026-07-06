import React, { useEffect, useState } from 'react';
import { Users, TrendingUp, DollarSign, Activity } from 'lucide-react';
import { getLeads } from '../../services/api';
import Loader from '../../components/Loader/Loader';

const DashboardCard = ({ title, value, icon: Icon, trend }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      {trend && (
        <p className={`text-xs mt-2 font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {trend.isPositive ? '+' : '-'}{trend.value}% from last month
        </p>
      )}
    </div>
    <div className="p-4 bg-primary/10 rounded-full text-primary">
      <Icon size={24} />
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ totalLeads: 0, newLeads: 0, contacted: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await getLeads();
        setStats({
          totalLeads: data.length,
          newLeads: data.filter(l => l.status === 'New').length,
          contacted: data.filter(l => l.status === 'Contacted').length,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader size={48} className="h-64" />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back to your ERP Lead Management System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="Total Leads" 
          value={stats.totalLeads} 
          icon={Users} 
          trend={{ value: 12, isPositive: true }} 
        />
        <DashboardCard 
          title="New Leads" 
          value={stats.newLeads} 
          icon={Activity} 
          trend={{ value: 8, isPositive: true }} 
        />
        <DashboardCard 
          title="Contacted" 
          value={stats.contacted} 
          icon={TrendingUp} 
          trend={{ value: 4, isPositive: false }} 
        />
        <DashboardCard 
          title="Revenue Pipeline" 
          value="$45,200" 
          icon={DollarSign} 
          trend={{ value: 24, isPositive: true }} 
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <p className="text-sm text-gray-500 italic">No recent activity to show.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
