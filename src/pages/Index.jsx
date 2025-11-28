import { Activity, Calendar, MessageSquare, Newspaper, Scan, ArrowRight, Sparkles, Heart, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Index = () => {
  const [greeting, setGreeting] = useState("");
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    // Get user name from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.name || user.fullName || "User");
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const quickActions = [
    {
      title: "Start Health Scan",
      description: "AI-powered analysis of your eyes, teeth, or skin",
      icon: Scan,
      link: "/scanner",
      gradient: "from-blue-500 to-cyan-500",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
      primary: true,
    },
    {
      title: "Chat with AI",
      description: "Get instant health guidance and answers",
      icon: MessageSquare,
      link: "/chat",
      gradient: "from-purple-500 to-pink-500",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-500",
    },
    {
      title: "Track Medications",
      description: "Never miss a dose with MedBuddy",
      icon: Calendar,
      link: "/medbuddy",
      gradient: "from-green-500 to-emerald-500",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-500",
    },
    {
      title: "Health Articles",
      description: "Read expert tips and wellness guides",
      icon: Newspaper,
      link: "/blog",
      gradient: "from-orange-500 to-amber-500",
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-500",
    },
  ];

  const stats = [
    { label: "Health Score", value: "92%", icon: Heart, color: "text-green-500" },
    { label: "Scans Completed", value: "12", icon: Scan, color: "text-blue-500" },
    { label: "Streak Days", value: "7", icon: TrendingUp, color: "text-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="mb-8 sm:mb-12 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {greeting}, {userName}!
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">Let's take care of your health today</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8 animate-slide-in">
          {stats.map((stat, index) => (
            <Card key={index} className="border-none shadow-md hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br ${stat.color}/10 flex items-center justify-center`}>
                    <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Primary Action - Health Scan */}
        <Card className="mb-6 sm:mb-8 border-none shadow-xl bg-gradient-to-br from-primary/10 via-primary/5 to-background overflow-hidden relative group hover:shadow-2xl transition-all duration-500 animate-slide-in">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardContent className="p-4 sm:p-6 lg:p-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 w-full lg:w-auto">
                <div className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Scan className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold mb-2">AI Health Scanner</h2>
                  <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                    Get instant AI-powered insights about your eyes, teeth, and skin health.
                    Early detection can make all the difference.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-xs sm:text-sm">
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI Powered
                    </Badge>
                    <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-none text-xs sm:text-sm">
                      Instant Results
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-none text-xs sm:text-sm">
                      Free to Use
                    </Badge>
                  </div>
                </div>
              </div>
              <Link to="/scanner" className="w-full lg:w-auto">
                <Button size="lg" className="w-full lg:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 group/btn">
                  Start Scan
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Grid */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.link}>
                <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group bg-card/50 backdrop-blur h-full animate-slide-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardContent className="p-4 sm:p-6">
                    <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl ${action.iconBg} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <action.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${action.iconColor}`} />
                    </div>
                    <h4 className="text-base sm:text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {action.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                      {action.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Today's Progress */}
        <Card className="border-none shadow-lg bg-card/50 backdrop-blur animate-slide-in" style={{ animationDelay: "400ms" }}>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Today's Progress
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Keep up the great work!</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="space-y-4 sm:space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-medium">Medication Adherence</span>
                  <span className="text-xs sm:text-sm font-medium text-primary">3/4 taken</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-medium">Daily Health Goals</span>
                  <span className="text-xs sm:text-sm font-medium text-primary">2/3 completed</span>
                </div>
                <Progress value={66} className="h-2" />
              </div>
              <div className="pt-3 sm:pt-4 border-t">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                  <div>
                    <p className="text-sm sm:text-base font-medium">Last Health Scan</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">2 days ago - All clear ✓</p>
                  </div>
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-xs sm:text-sm">
                    Healthy
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
