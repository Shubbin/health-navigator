import { Activity, Calendar, MessageSquare, Newspaper, Scan } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

const Index = () => {
  const modules = [
    {
      title: "AI Health Scanner",
      description: "Scan your eyes, teeth, or skin for early health insights",
      icon: Scan,
      color: "primary",
      link: "/scanner",
      status: "Ready",
    },
    {
      title: "MedBuddy",
      description: "Track medications and never miss a dose",
      icon: Calendar,
      color: "secondary",
      link: "/medbuddy",
      status: "3 doses today",
    },
    {
      title: "Health Blog",
      description: "Read articles about preventive care and wellness",
      icon: Newspaper,
      color: "accent",
      link: "/blog",
      status: "5 new articles",
    },
    {
      title: "AI Chat Assistant",
      description: "Get instant guidance for symptoms and health questions",
      icon: MessageSquare,
      color: "info",
      link: "/chat",
      status: "Available 24/7",
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">HealScope NG</h1>
            </div>
            <Button variant="outline" size="sm">
              Profile
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back, User!</h2>
          <p className="text-muted-foreground">Monitor your health proactively with AI-powered insights</p>
        </div>

        {/* Today's Summary */}
        <Card className="mb-8 animate-slide-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Today's Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Medication Adherence</p>
                <div className="flex items-center gap-3">
                  <Progress value={75} className="flex-1" />
                  <span className="text-sm font-medium">75%</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Last Scan</p>
                <Badge className="status-success">Completed 2 days ago</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Health Status</p>
                <Badge className="status-info">All systems normal</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Module Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((module, index) => (
            <Card 
              key={module.title} 
              className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group animate-slide-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg bg-${module.color}/10 group-hover:bg-${module.color}/20 transition-colors`}>
                    <module.icon className={`h-6 w-6 text-${module.color}`} />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {module.status}
                  </Badge>
                </div>
                <CardTitle className="mt-4">{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to={module.link}>
                  <Button className="w-full" variant="outline">
                    Open {module.title}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mt-8 animate-slide-in" style={{ animationDelay: "400ms" }}>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you might want to do</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button variant="default" className="bg-primary hover:bg-primary/90">
              Start New Scan
            </Button>
            <Button variant="outline">Log Medication</Button>
            <Button variant="outline">Read Latest Article</Button>
            <Button variant="outline">Chat with AI</Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;
