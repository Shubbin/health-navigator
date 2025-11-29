import { useState, useRef, useEffect } from "react";
import { Camera, AlertCircle, CheckCircle, Info, Sparkles, Eye, Smile, Scan as ScanIcon, ArrowLeft, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";

import api from "@/lib/api";
import { toast } from "sonner";

const Scanner = () => {
  const [scanType, setScanType] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [scanResult, setScanResult] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const scanTypes = [
    {
      id: "eyes",
      name: "Eye Scan",
      description: "Detect redness, dryness, or irritation",
      icon: Eye,
      gradient: "from-blue-500 to-cyan-500",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
    },
    {
      id: "teeth",
      name: "Dental Scan",
      description: "Check for plaque, discoloration, or cavities",
      icon: Smile,
      gradient: "from-purple-500 to-pink-500",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-500",
    },
    {
      id: "skin",
      name: "Skin Scan",
      description: "Analyze skin health and detect anomalies",
      icon: ScanIcon,
      gradient: "from-green-500 to-emerald-500",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-500",
    },
  ];

  // Start camera when scan type is selected
  useEffect(() => {
    if (scanType && !scanComplete) {
      startCamera();
    }

    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanType, scanComplete]);

  const startCamera = async () => {
    try {
      // Check if browser supports mediaDevices
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not supported in this browser");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Wait for video to load
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(e => console.error("Error playing video:", e));
          setCameraActive(true);
          setCameraError(null);
        };
        streamRef.current = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      let errorMessage = "Unable to access camera.";
      if (error.name === 'NotAllowedError') {
        errorMessage = "Camera permission denied. Please allow access.";
      } else if (error.name === 'NotFoundError') {
        errorMessage = "No camera found on this device.";
      } else if (error.name === 'NotReadableError') {
        errorMessage = "Camera is in use by another application.";
      }
      setCameraError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, "image/jpeg");
      });
    }
    return null;
  };

  const startScan = async () => {
    setIsScanning(true);
    setScanComplete(false);
    setConfidence(0);

    // Simulate scanning progress for UI feedback
    const interval = setInterval(() => {
      setConfidence((prev) => {
        if (prev >= 90) return 90; // Hold at 90% until response
        return prev + 10;
      });
    }, 200);

    try {
      const imageBlob = await captureImage();
      if (!imageBlob) {
        throw new Error("Failed to capture image");
      }

      const formData = new FormData();
      formData.append("image", imageBlob);
      formData.append("scanType", scanType);

      // Call ML endpoint
      const response = await api.post("/ml/analyze-face", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        clearInterval(interval);
        setConfidence(100);
        setScanResult(response.data.data);

        // Save scan result to history (already done in backend, just need to update UI)

        setScanComplete(true);
        toast.success("Scan completed successfully");
      }
    } catch (error) {
      clearInterval(interval);
      console.error("Error performing scan:", error);
      toast.error("Scan failed. Please try again.");
      setIsScanning(false);
    }
  };

  const selectedScanType = scanTypes.find((t) => t.id === scanType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                AI Health Scanner
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">Get instant AI-powered health insights</p>
            </div>
          </div>
        </div>

        {/* Scan Type Selection */}
        {!scanType && (
          <div className="max-w-4xl mx-auto animate-slide-in">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold mb-2">Choose Your Scan Type</h2>
              <p className="text-sm sm:text-base text-muted-foreground">Select the area you'd like to analyze</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {scanTypes.map((type, index) => (
                <Card
                  key={type.id}
                  className="border-none shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2 group bg-card/50 backdrop-blur overflow-hidden relative"
                  onClick={() => setScanType(type.id)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${type.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  <CardHeader className="relative z-10 p-4 sm:p-6">
                    <div className={`h-12 w-12 sm:h-14 sm:w-14 rounded-2xl ${type.iconBg} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 mx-auto`}>
                      <type.icon className={`h-6 w-6 sm:h-7 sm:w-7 ${type.iconColor}`} />
                    </div>
                    <CardTitle className="text-center group-hover:text-primary transition-colors text-lg sm:text-xl">{type.name}</CardTitle>
                    <CardDescription className="text-center text-xs sm:text-sm">{type.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10 p-4 sm:p-6 pt-0">
                    <Button className={`w-full bg-gradient-to-r ${type.gradient} hover:opacity-90 transition-opacity text-sm sm:text-base`}>
                      Select Scan
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Scanning Interface */}
        {scanType && !scanComplete && (
          <div className="max-w-3xl mx-auto animate-slide-in">
            <Card className="border-none shadow-2xl bg-card/50 backdrop-blur overflow-hidden">
              <CardHeader className={`bg-gradient-to-r ${selectedScanType?.gradient} text-white p-4 sm:p-6`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                      {selectedScanType && <selectedScanType.icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />}
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg sm:text-xl">{selectedScanType?.name}</CardTitle>
                      <CardDescription className="text-white/80 text-xs sm:text-sm">Position yourself in the camera frame</CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { stopCamera(); setScanType(null); }}
                    className="text-white hover:bg-white/20 text-xs sm:text-sm w-full sm:w-auto"
                  >
                    <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Back
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Camera View */}
                <div className="relative aspect-video bg-muted rounded-xl sm:rounded-2xl overflow-hidden shadow-inner">
                  {cameraActive ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : cameraError ? (
                    <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-8">
                      <div className="text-center">
                        <AlertCircle className="h-12 w-12 sm:h-16 sm:w-16 text-destructive mx-auto mb-3 sm:mb-4" />
                        <p className="text-base sm:text-lg font-medium mb-2">Camera Access Required</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">{cameraError}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-pulse">
                          <Camera className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                        </div>
                        <p className="text-base sm:text-lg font-medium">Initializing camera...</p>
                      </div>
                    </div>
                  )}

                  {/* Scanning Overlay */}
                  {isScanning && (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center">
                        <div className="relative mb-4 sm:mb-6">
                          <div className="h-16 w-16 sm:h-20 sm:w-20 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-primary animate-pulse" />
                          </div>
                        </div>
                        <p className="text-lg sm:text-xl font-semibold text-white drop-shadow-lg">Analyzing...</p>
                        <p className="text-xs sm:text-sm text-white/80 mt-2">Please hold still</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Guidance */}
                {!isScanning && cameraActive && (
                  <Alert className="border-primary/20 bg-primary/5">
                    <Info className="h-4 w-4 text-primary" />
                    <AlertDescription className="text-xs sm:text-sm">
                      <ul className="list-disc list-inside space-y-1">
                        <li>Ensure good lighting for best results</li>
                        <li>Keep your device steady</li>
                        <li>Position the target area in the center</li>
                        <li>Move closer if the image is unclear</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Confidence Meter */}
                {isScanning && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-medium flex items-center gap-2">
                        <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                        Analysis Progress
                      </span>
                      <span className="text-base sm:text-lg font-bold text-primary">{confidence}%</span>
                    </div>
                    <Progress value={confidence} className="h-2 sm:h-3" />
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  {!isScanning ? (
                    <Button
                      onClick={startScan}
                      className={`flex-1 bg-gradient-to-r ${selectedScanType?.gradient} hover:opacity-90 text-white shadow-lg text-sm sm:text-base`}
                      disabled={!cameraActive}
                      size="lg"
                    >
                      {cameraActive ? (
                        <>
                          <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                          Start Analysis
                        </>
                      ) : (
                        "Waiting for camera..."
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        setIsScanning(false);
                        setConfidence(0);
                      }}
                      variant="destructive"
                      className="flex-1 text-sm sm:text-base"
                      size="lg"
                    >
                      Stop Scan
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results */}
        {scanComplete && (
          <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6 animate-slide-in">
            <Card className="border-none shadow-2xl bg-card/50 backdrop-blur overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-xl sm:text-2xl">Scan Complete!</CardTitle>
                    <CardDescription className="text-white/80 text-xs sm:text-sm">Your results are ready</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Overall Status */}
                <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 p-4 sm:p-6 rounded-xl sm:rounded-2xl border ${scanResult?.result === 'Healthy' ? 'bg-green-500/10 border-green-500/20' : 'bg-yellow-500/10 border-yellow-500/20'}`}>
                  <div>
                    <p className="text-base sm:text-lg font-semibold mb-1">Overall Health Status</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Based on AI analysis</p>
                  </div>
                  <Badge className={`${scanResult?.result === 'Healthy' ? 'bg-green-500' : 'bg-yellow-500'} text-white text-sm sm:text-base lg:text-lg px-3 sm:px-4 py-1.5 sm:py-2 shadow-lg`}>
                    {scanResult?.result === 'Healthy' ? <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2" /> : <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />}
                    {scanResult?.result || 'Analysis Complete'}
                  </Badge>
                </div>

                {/* Insights */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2">
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    Detected Insights
                  </h3>
                  <Alert className="border-blue-500/20 bg-blue-500/5">
                    <Info className="h-4 w-4 text-blue-500" />
                    <AlertDescription className="text-xs sm:text-sm">
                      {scanResult?.notes}
                    </AlertDescription>
                  </Alert>
                </div>

                {/* Recommendations */}
                {scanResult?.recommendations && scanResult.recommendations.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-base sm:text-lg">Recommended Actions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {scanResult.recommendations.map((tip, i) => (
                        <div key={i} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-muted/50 rounded-lg">
                          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-xs sm:text-sm">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2 sm:pt-4">
                  <Button
                    onClick={() => { stopCamera(); setScanComplete(false); setScanType(null); }}
                    className="flex-1 bg-gradient-to-r from-primary to-primary/80 text-sm sm:text-base"
                    size="lg"
                  >
                    <ScanIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Start New Scan
                  </Button>
                  <Button variant="outline" asChild size="lg" className="text-sm sm:text-base">
                    <Link to="/blog">
                      Related Articles
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
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
