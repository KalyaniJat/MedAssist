import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  MessageCircle, 
  Heart, 
  Calendar, 
  User, 
  Activity, 
  Clock, 
  AlertTriangle, 
  Plus,
  TrendingUp,
  Shield,
  Phone,
  MapPin
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (section: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const quickStats = [
    {
      title: 'Health Score',
      value: '8.5/10',
      change: '+0.5',
      trend: 'up',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      icon: <Activity className="w-5 h-5 text-green-600" />
    },
  
    {
      title: 'Active Medications',
      value: '3',
      change: 'No changes',
      trend: 'neutral',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      icon: <Shield className="w-5 h-5 text-purple-600" />
    },
    {
      title: 'Emergency Contacts',
      value: '2',
      change: 'Ready',
      trend: 'up',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      icon: <Phone className="w-5 h-5 text-orange-600" />
    }
  ];

  const quickActions = [
    {
      title: 'Check Symptoms',
      description: 'Get AI-powered symptom analysis and health guidance',
      icon: <MessageCircle className="w-8 h-8 text-blue-600" />,
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      action: () => onNavigate('symptom-checker')
    },
    {
      title: 'Emergency First Aid',
      description: 'Quick access to life-saving procedures and guides',
      icon: <Heart className="w-8 h-8 text-red-600" />,
      color: 'bg-red-50 hover:bg-red-100 border-red-200',
      action: () => onNavigate('first-aid')
    },
   
    {
      title: 'Manage Profile',
      description: 'Update your medical information and preferences',
      icon: <User className="w-8 h-8 text-purple-600" />,
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
      action: () => onNavigate('profile')
    }
  ];

  const recentActivity = [
    {/*
      type: 'appointment',
      title: 'Appointment Confirmed',
      description: 'Annual checkup with Dr. Sarah Johnson',
      time: '2 hours ago',
      icon: <Calendar className="w-4 h-4 text-blue-600" />,
      color: 'bg-blue-50'
    */},
    {
      type: 'symptom',
      title: 'Symptom Check Completed',
      description: 'General health assessment',
      time: '1 day ago',
      icon: <MessageCircle className="w-4 h-4 text-green-600" />,
      color: 'bg-green-50'
    },
    {
      type: 'profile',
      title: 'Profile Updated',
      description: 'Added new emergency contact',
      time: '3 days ago',
      icon: <User className="w-4 h-4 text-purple-600" />,
      color: 'bg-purple-50'
    }
  ];

  const upcomingAppointments = [
    {
      title: 'Annual Checkup',
      doctor: 'Dr. Sarah Johnson',
      date: 'Aug 26, 2025',
      time: '10:00 AM',
      location: 'Main Clinic',
      status: 'confirmed'
    },
    {
      title: 'Blood Pressure Follow-up',
      doctor: 'Dr. Michael Chen',
      date: 'Sep 2, 2025',
      time: '2:30 PM',
      location: 'Cardiology Wing',
      status: 'scheduled'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold mb-2">Welcome back, John!</h1>
            <p className="text-blue-100">
              Your health dashboard is ready. Stay on top of your wellness journey.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 rounded-lg p-4">
              <Activity className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                  <p className={`text-sm mt-1 ${stat.color}`}>
                    {stat.trend === 'up' && <TrendingUp className="w-3 h-3 inline mr-1" />}
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Card 
              key={index} 
              className={`cursor-pointer transition-all duration-200 ${action.color}`}
              onClick={action.action}
            >
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  {action.icon}
                </div>
                <h3 className="font-semibold mb-2">{action.title}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Appointments */}
        {/*<div>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Upcoming Appointments
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => onNavigate('appointments')}>
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingAppointments.map((appointment, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{appointment.title}</h4>
                    <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}>
                      {appointment.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{appointment.doctor}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {appointment.date} at {appointment.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {appointment.location}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </div>*/}

        {/* Recent Activity */}
       <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${activity.color}`}>
                  {activity.icon}
                </div>
                <div className="flex-1">
                 <h4 className="font-medium">{activity.title}</h4>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Emergency Information */}
      <Card className="border-red-200 bg-red-50/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 mb-2">Emergency Information</h3>
              <p className="text-sm text-red-800 mb-3">
                In case of emergency, call 108 immediately. For quick first aid guidance, use our emergency procedures.
              </p>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => onNavigate('first-aid')}
                className="bg-red-600 hover:bg-red-700"
              >
                <Heart className="w-4 h-4 mr-2" />
                Access First Aid Guide
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}