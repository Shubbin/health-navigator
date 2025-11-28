import { useState } from "react";
import { User, Mail, Phone, Calendar, MapPin, Edit, Camera, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import api from "@/lib/api";
import { toast } from "sonner";
import { useEffect } from "react";

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        location: "",
        bio: "",
        avatar: null,
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get("/auth/check-auth");
            if (response.data.success) {
                const user = response.data.user;
                setProfile({
                    name: user.name || "",
                    email: user.email || "",
                    phone: user.phoneNumber || "",
                    dateOfBirth: user.dob ? new Date(user.dob).toISOString().split('T')[0] : "",
                    location: user.address || "",
                    bio: user.bio || "", // Assuming bio field exists or we add it to model, otherwise it will just be ignored by backend
                    avatar: null,
                });
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            // toast.error("Failed to load profile"); // Suppress error on initial load if not auth
        }
    };

    const handleSave = async () => {
        try {
            const response = await api.put("/users/profile", {
                name: profile.name,
                phoneNumber: profile.phone,
                dob: profile.dateOfBirth,
                address: profile.location,
                // bio: profile.bio, // Add to model if needed
            });

            toast.success("Profile updated successfully");
            setIsEditing(false);

            // Update local state with returned user data to ensure sync
            const user = response.data.user;
            setProfile(prev => ({
                ...prev,
                name: user.name || prev.name,
                phone: user.phoneNumber || prev.phone,
                dateOfBirth: user.dob ? new Date(user.dob).toISOString().split('T')[0] : prev.dateOfBirth,
                location: user.address || prev.location,
            }));

        } catch (error) {
            console.error("Error saving profile:", error);
            toast.error("Failed to save profile");
        }
    };

    const stats = [
        { label: "Health Scans", value: "12", color: "bg-primary" },
        { label: "Medications Tracked", value: "5", color: "bg-secondary" },
        { label: "Articles Read", value: "28", color: "bg-accent" },
        { label: "Days Active", value: "45", color: "bg-muted" },
    ];

    return (
        <div className="h-screen overflow-y-auto bg-muted/30">
            <div className="container max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">My Profile</h1>
                            <p className="text-muted-foreground">Manage your personal information and health journey</p>
                        </div>
                        {!isEditing ? (
                            <Button onClick={() => setIsEditing(true)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Profile
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => setIsEditing(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSave}>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid gap-6">
                    {/* Profile Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Your basic profile details</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Avatar Section */}
                                <div className="flex flex-col items-center gap-4">
                                    <Avatar className="h-32 w-32">
                                        <AvatarImage src={profile.avatar} />
                                        <AvatarFallback className="text-2xl">
                                            {profile.name?.split(" ").map(n => n[0]).join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    {isEditing && (
                                        <Button variant="outline" size="sm">
                                            <Camera className="h-4 w-4 mr-2" />
                                            Change Photo
                                        </Button>
                                    )}
                                </div>

                                {/* Profile Form */}
                                <div className="flex-1 space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input
                                                id="name"
                                                value={profile.name}
                                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={profile.email}
                                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={profile.phone}
                                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="dob">Date of Birth</Label>
                                            <Input
                                                id="dob"
                                                type="date"
                                                value={profile.dateOfBirth}
                                                onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="location">Location</Label>
                                        <Input
                                            id="location"
                                            value={profile.location}
                                            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="bio">Bio</Label>
                                        <Textarea
                                            id="bio"
                                            value={profile.bio}
                                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                            disabled={!isEditing}
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Health Journey</CardTitle>
                            <CardDescription>Track your progress and activities</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {stats.map((stat, index) => (
                                    <div key={index} className="text-center p-4 rounded-lg border">
                                        <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activity Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>Your latest health activities</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="font-medium">Eye Scan Completed</p>
                                            <span className="text-xs text-muted-foreground">2 days ago</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Scan showed healthy results with minor eye strain detected
                                        </p>
                                    </div>
                                </div>
                                <Separator />
                                <div className="flex items-start gap-4">
                                    <div className="h-2 w-2 mt-2 rounded-full bg-secondary" />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="font-medium">Medication Logged</p>
                                            <span className="text-xs text-muted-foreground">1 week ago</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Added Vitamin D to daily medication schedule
                                        </p>
                                    </div>
                                </div>
                                <Separator />
                                <div className="flex items-start gap-4">
                                    <div className="h-2 w-2 mt-2 rounded-full bg-accent" />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="font-medium">Article Read</p>
                                            <span className="text-xs text-muted-foreground">1 week ago</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            "Understanding Eye Health: Common Signs of Strain"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Account Settings Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Settings</CardTitle>
                            <CardDescription>Manage your account and preferences</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Account Type</Label>
                                    <p className="text-sm text-muted-foreground">Free Plan</p>
                                </div>
                                <Button variant="outline">Upgrade to Pro</Button>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Member Since</Label>
                                    <p className="text-sm text-muted-foreground">January 2024</p>
                                </div>
                                <Badge>Active</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Profile;
