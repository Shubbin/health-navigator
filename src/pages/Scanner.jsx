import { useState } from "react";
import { Camera, AlertCircle, CheckCircle, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";

const Scanner = () => {
  const [scanType, setScanType] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [confidence, setConfidence] = useState(0);

  const scanTypes = [
    { id: "eyes", name: "Eye Scan", description: "Detect redness, dryness, or irritation" },
    { id: "teeth", name: "Dental Scan", description: "Check for plaque, discoloration, or cavities" },
    { id: "skin", name: "Skin Scan", description: "Analyze skin health and detect anomalies" },
  ];

  const startScan = () => {
    setIsScanning(true);
    setScanComplete(false);
    setConfidence(0);

    // Simulate scanning progress
    const interval = setInterval(() => {
      setConfidence((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setScanComplete(true);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="h-screen overflow-y-auto bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Health Scanner</h1>
          <p className="text-muted-foreground">Scan your eyes, teeth, or skin for early health insights</p>
        </div>

        {!scanType && (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {scanTypes.map((type) => (
                <Card
                  key={type.id}
                  className="hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1"
                  onClick={() => setScanType(type.id)}
                >
                  <CardHeader>
                    <CardTitle>{type.name}</CardTitle>
                    <CardDescription>{type.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">Select</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {scanType && !scanComplete && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  {scanTypes.find((t) => t.id === scanType)?.name}
                </CardTitle>
                <CardDescription>Position your camera and follow the guidance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Camera Placeholder */}
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                  <Camera className="h-16 w-16 text-muted-foreground" />
                  {isScanning && (
                    <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-pulse mb-4">
                          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                        </div>
                        <p className="text-sm font-medium">Scanning...</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Live Guidance */}
                {!isScanning && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Hold your device steady</li>
                        <li>Ensure good lighting</li>
                        <li>Keep the target in frame</li>
                        <li>Move closer if needed</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Confidence Meter */}
                {isScanning && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Scan Confidence</span>
                      <span className="text-sm font-medium">{confidence}%</span>
                    </div>
                    <Progress value={confidence} className="h-3" />
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  {!isScanning && (
                    <>
                      <Button onClick={startScan} className="flex-1">
                        Start Scan
                      </Button>
                      <Button variant="outline" onClick={() => setScanType(null)}>
                        Change Type
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {scanComplete && (
          <div className="max-w-2xl mx-auto space-y-6 animate-slide-in">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-secondary" />
                  <CardTitle>Scan Complete</CardTitle>
                </div>
                <CardDescription>Your results are ready</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                  <div>
                    <p className="font-medium">Overall Health Status</p>
                    <p className="text-sm text-muted-foreground">Based on AI analysis</p>
                  </div>
                  <Badge className="status-success text-base">Healthy</Badge>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold">Detected Insights</h3>
                  <div className="space-y-2">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Minor redness detected:</strong> Consider using eye drops and reducing screen time.
                        Consult an optometrist if symptoms persist.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Recommended Actions</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Rest your eyes every 20 minutes during screen use</li>
                    <li>Stay hydrated throughout the day</li>
                    <li>Consider using lubricating eye drops</li>
                    <li>Schedule a checkup if symptoms worsen</li>
                  </ul>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={() => { setScanComplete(false); setScanType(null); }} className="flex-1">
                    Start New Scan
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/blog">Related Articles</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scanner;
