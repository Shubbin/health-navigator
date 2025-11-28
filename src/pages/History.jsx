import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Scan, Calendar, Newspaper, Eye, Filter, Download } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const History = () => {
    const [activeTab, setActiveTab] = useState("scans");

    // Mock data - replace with real data from backend
    const scanHistory = [
        {
            id: 1,
            type: "Eye Scan",
            date: "2024-01-25",
            time: "10:30 AM",
            result: "Healthy",
            status: "success",
            notes: "Minor eye strain detected. Consider reducing screen time.",
        },
        {
            id: 2,
            type: "Dental Scan",
            date: "2024-01-20",
            time: "2:15 PM",
            result: "Minor Issues",
            status: "warning",
            notes: "Slight discoloration on molars. Schedule dental checkup.",
        },
        {
            id: 3,
            type: "Skin Scan",
            date: "2024-01-15",
            time: "4:45 PM",
            result: "Healthy",
            status: "success",
            notes: "No anomalies detected. Maintain current skincare routine.",
        },
    ];

    const medicationHistory = [
        {
            id: 1,
            medication: "Vitamin D",
            dosage: "1000 IU",
            frequency: "Daily",
            startDate: "2024-01-01",
            status: "Active",
            adherence: 95,
        },
        {
            id: 2,
            medication: "Paracetamol",
            dosage: "500mg",
            frequency: "As needed",
            startDate: "2024-01-20",
            endDate: "2024-01-27",
            status: "Completed",
            adherence: 100,
        },
        {
            id: 3,
            medication: "Eye Drops",
            dosage: "2 drops",
            frequency: "Twice daily",
            startDate: "2024-01-10",
            status: "Active",
            adherence: 88,
        },
    ];

    const readingHistory = [
        {
            id: 1,
            title: "Understanding Eye Health: Common Signs of Strain",
            category: "Eye Health",
            dateRead: "2024-01-25",
            readTime: "5 min",
        },
        {
            id: 2,
            title: "Medication Adherence: Why It Matters",
            category: "Wellness",
            dateRead: "2024-01-22",
            readTime: "4 min",
        },
        {
            id: 3,
            title: "Preventive Care for Young Adults in Nigeria",
            category: "Preventive Care",
            dateRead: "2024-01-18",
            readTime: "7 min",
        },
    ];

    return (
        <div className="h-screen overflow-y-auto bg-muted/30">
            <div className="container max-w-6xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">History</h1>
                            <p className="text-muted-foreground">Review your health journey and activities</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                                <Filter className="h-4 w-4 mr-2" />
                                Filter
                            </Button>
                            <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                        </div>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="scans">
                            <Scan className="h-4 w-4 mr-2" />
                            Scans
                        </TabsTrigger>
                        <TabsTrigger value="medications">
                            <Calendar className="h-4 w-4 mr-2" />
                            Medications
                        </TabsTrigger>
                        <TabsTrigger value="reading">
                            <Newspaper className="h-4 w-4 mr-2" />
                            Reading
                        </TabsTrigger>
                    </TabsList>

                    {/* Scan History */}
                    <TabsContent value="scans" className="mt-6">
                        <div className="space-y-4">
                            {scanHistory.map((scan) => (
                                <Card key={scan.id}>
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-4">
                                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <Eye className="h-6 w-6 text-primary" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-lg">{scan.type}</CardTitle>
                                                    <CardDescription>
                                                        {scan.date} at {scan.time}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                            <Badge
                                                className={
                                                    scan.status === "success"
                                                        ? "bg-green-500/10 text-green-700 hover:bg-green-500/20"
                                                        : "bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20"
                                                }
                                            >
                                                {scan.result}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground mb-4">{scan.notes}</p>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm">
                                                View Details
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                Download Report
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Medication History */}
                    <TabsContent value="medications" className="mt-6">
                        <div className="space-y-4">
                            {medicationHistory.map((med) => (
                                <Card key={med.id}>
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-lg">{med.medication}</CardTitle>
                                                <CardDescription>
                                                    {med.dosage} · {med.frequency}
                                                </CardDescription>
                                            </div>
                                            <Badge variant={med.status === "Active" ? "default" : "secondary"}>
                                                {med.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Started</span>
                                                <span className="font-medium">{med.startDate}</span>
                                            </div>
                                            {med.endDate && (
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">Ended</span>
                                                    <span className="font-medium">{med.endDate}</span>
                                                </div>
                                            )}
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">Adherence</span>
                                                    <span className="font-medium">{med.adherence}%</span>
                                                </div>
                                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary transition-all"
                                                        style={{ width: `${med.adherence}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Reading History */}
                    <TabsContent value="reading" className="mt-6">
                        <div className="space-y-4">
                            {readingHistory.map((article) => (
                                <Card key={article.id}>
                                    <CardHeader>
                                        <div className="flex items-start gap-4">
                                            <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                                                <Newspaper className="h-6 w-6 text-accent" />
                                            </div>
                                            <div className="flex-1">
                                                <CardTitle className="text-lg">{article.title}</CardTitle>
                                                <CardDescription className="mt-2 flex items-center gap-3">
                                                    <Badge variant="outline">{article.category}</Badge>
                                                    <span>·</span>
                                                    <span>Read on {article.dateRead}</span>
                                                    <span>·</span>
                                                    <span>{article.readTime}</span>
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <Button variant="outline" size="sm">
                                            Read Again
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default History;
