import { Calendar, Clock, Plus, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";

const MedBuddy = () => {
  const medications = [
    { id: 1, name: "Vitamin D", dosage: "1000 IU", time: "8:00 AM", taken: true, frequency: "Daily" },
    { id: 2, name: "Paracetamol", dosage: "500mg", time: "2:00 PM", taken: false, frequency: "As needed" },
    { id: 3, name: "Eye Drops", dosage: "2 drops", time: "9:00 PM", taken: false, frequency: "Twice daily" },
  ];

  const upcomingAppointments = [
    { date: "Dec 15, 2025", doctor: "Dr. Okonkwo", specialty: "Optometrist", time: "10:00 AM" },
    { date: "Dec 22, 2025", doctor: "Dr. Adebayo", specialty: "General Physician", time: "3:30 PM" },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="text-primary hover:underline text-sm mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-foreground">MedBuddy</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Today's Medications */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Today's Medications
                  </CardTitle>
                  <CardDescription>Track your daily medication schedule</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Medication
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medications.map((med) => (
                  <div
                    key={med.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={med.taken}
                        className="h-5 w-5"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{med.name}</p>
                          <Badge variant="outline" className="text-xs">
                            {med.frequency}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {med.dosage} at {med.time}
                        </p>
                      </div>
                    </div>
                    {med.taken && (
                      <Badge className="status-success">
                        <Check className="h-3 w-3 mr-1" />
                        Taken
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Adherence Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Adherence</CardTitle>
              <CardDescription>Your medication compliance over the past 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-secondary">85%</span>
                  <Badge className="status-success">Good Progress</Badge>
                </div>
                <div className="flex gap-2">
                  {[100, 100, 80, 100, 100, 60, 75].map((value, i) => (
                    <div key={i} className="flex-1">
                      <div className="h-24 bg-muted rounded-t-lg flex items-end overflow-hidden">
                        <div
                          className={`w-full rounded-t-lg transition-all ${
                            value === 100
                              ? "bg-secondary"
                              : value >= 75
                              ? "bg-accent"
                              : "bg-destructive"
                          }`}
                          style={{ height: `${value}%` }}
                        />
                      </div>
                      <p className="text-xs text-center mt-2 text-muted-foreground">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Appointments
              </CardTitle>
              <CardDescription>Don't miss your scheduled checkups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{appointment.doctor}</p>
                      <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {appointment.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {appointment.time}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Reschedule
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MedBuddy;
