import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Scan, Calendar, Newspaper, Eye, Filter, Download } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import api from "@/lib/api";
import { toast } from "sonner";

const History = () => {
    const [activeTab, setActiveTab] = useState("scans");
    const [scanHistory, setScanHistory] = useState([]);
    const [medicationHistory, setMedicationHistory] = useState([]);
    const [readingHistory, setReadingHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [scansRes, medsRes, readingRes] = await Promise.all([
                    api.get("/health-scans"),
                    api.get("/medications"),
                    api.get("/reading-history")
                ]);

                if (scansRes.data.success) {
                    setScanHistory(scansRes.data.scans.map(scan => ({
                        id: scan._id,
                        type: scan.scanType === 'eyes' ? 'Eye Scan' : scan.scanType === 'teeth' ? 'Dental Scan' : 'Skin Scan',
                        date: new Date(scan.createdAt).toLocaleDateString(),
                        time: new Date(scan.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        result: scan.result,
                        status: scan.status,
                        notes: scan.notes
                    })));
                }

                if (medsRes.data.success) {
                    setMedicationHistory(medsRes.data.medications.map(med => ({
                        id: med._id,
                        medication: med.name,
                        dosage: med.dosage,
                        frequency: med.frequency,
                        startDate: new Date(med.startDate).toLocaleDateString(),
                        endDate: med.endDate ? new Date(med.endDate).toLocaleDateString() : null,
                        status: med.status || "Active", // Default to Active if not present
                        adherence: med.adherence || 0 // Default to 0 if not present
                    })));
                }

                if (readingRes.data.success) {
                    setReadingHistory(readingRes.data.history.map(item => ({
                        id: item._id,
                        title: item.title,
                        category: item.category,
                        dateRead: new Date(item.dateRead).toLocaleDateString(),
                        readTime: item.readTime
                    })));
                }
            } catch (error) {
                console.error("Error fetching history:", error);
                toast.error("Failed to load history");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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
