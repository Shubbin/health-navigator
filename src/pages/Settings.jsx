import { useState } from "react";
import { Bell, Lock, Palette, Globe, Database, Shield, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
    const [settings, setSettings] = useState({
        notifications: {
            email: true,
            push: true,
            medicationReminders: true,
            healthTips: false,
            scanReminders: true,
        },
        privacy: {
            shareData: false,
            analytics: true,
            crashReports: true,
        },
        appearance: {
            theme: "system",
            language: "en",
        },
    });

    const handleToggle = (category, key) => {
        setSettings({
            ...settings,
            [category]: {
                ...settings[category],
                [key]: !settings[category][key],
            },
        });
    };

    const handleSelect = (category, key, value) => {
        setSettings({
            ...settings,
            [category]: {
                ...settings[category],
                [key]: value,
            },
        });
    };

    return (
        <div className="h-screen overflow-y-auto bg-muted/30">
            <div className="container max-w-4xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Settings</h1>
                    <p className="text-muted-foreground">Manage your account settings and preferences</p>
                </div>

                <div className="space-y-6">
                    {/* Notifications */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5" />
                                Notifications
                            </CardTitle>
                            <CardDescription>Configure how you receive notifications</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Email Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                                </div>
                                <Switch
                                    checked={settings.notifications.email}
                                    onCheckedChange={() => handleToggle("notifications", "email")}
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Push Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
                                </div>
                                <Switch
                                    checked={settings.notifications.push}
                                    onCheckedChange={() => handleToggle("notifications", "push")}
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Medication Reminders</Label>
                                    <p className="text-sm text-muted-foreground">Get reminded to take your medications</p>
                                </div>
                                <Switch
                                    checked={settings.notifications.medicationReminders}
                                    onCheckedChange={() => handleToggle("notifications", "medicationReminders")}
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Health Tips</Label>
                                    <p className="text-sm text-muted-foreground">Receive daily health tips and advice</p>
                                </div>
                                <Switch
                                    checked={settings.notifications.healthTips}
                                    onCheckedChange={() => handleToggle("notifications", "healthTips")}
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Scan Reminders</Label>
                                    <p className="text-sm text-muted-foreground">Reminders for regular health scans</p>
                                </div>
                                <Switch
                                    checked={settings.notifications.scanReminders}
                                    onCheckedChange={() => handleToggle("notifications", "scanReminders")}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Appearance */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Palette className="h-5 w-5" />
                                Appearance
                            </CardTitle>
                            <CardDescription>Customize how the app looks</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Theme</Label>
                                <Select
                                    value={settings.appearance.theme}
                                    onValueChange={(value) => handleSelect("appearance", "theme", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="light">Light</SelectItem>
                                        <SelectItem value="dark">Dark</SelectItem>
                                        <SelectItem value="system">System</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <Label>Language</Label>
                                <Select
                                    value={settings.appearance.language}
                                    onValueChange={(value) => handleSelect("appearance", "language", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">English</SelectItem>
                                        <SelectItem value="yo">Yoruba</SelectItem>
                                        <SelectItem value="ig">Igbo</SelectItem>
                                        <SelectItem value="ha">Hausa</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Privacy & Security */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Privacy & Security
                            </CardTitle>
                            <CardDescription>Manage your privacy and security settings</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Share Anonymous Data</Label>
                                    <p className="text-sm text-muted-foreground">Help improve our services with anonymous usage data</p>
                                </div>
                                <Switch
                                    checked={settings.privacy.shareData}
                                    onCheckedChange={() => handleToggle("privacy", "shareData")}
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Analytics</Label>
                                    <p className="text-sm text-muted-foreground">Allow us to collect analytics data</p>
                                </div>
                                <Switch
                                    checked={settings.privacy.analytics}
                                    onCheckedChange={() => handleToggle("privacy", "analytics")}
                                />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Crash Reports</Label>
                                    <p className="text-sm text-muted-foreground">Send crash reports to help us fix bugs</p>
                                </div>
                                <Switch
                                    checked={settings.privacy.crashReports}
                                    onCheckedChange={() => handleToggle("privacy", "crashReports")}
                                />
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <Label>Account Security</Label>
                                <Button variant="outline" className="w-full justify-start">
                                    <Lock className="h-4 w-4 mr-2" />
                                    Change Password
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Data Management */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="h-5 w-5" />
                                Data Management
                            </CardTitle>
                            <CardDescription>Manage your data and storage</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Export Data</Label>
                                <p className="text-sm text-muted-foreground mb-2">Download all your health data</p>
                                <Button variant="outline" className="w-full justify-start">
                                    Download Data
                                </Button>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <Label>Clear Cache</Label>
                                <p className="text-sm text-muted-foreground mb-2">Clear cached data to free up space</p>
                                <Button variant="outline" className="w-full justify-start">
                                    Clear Cache
                                </Button>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <Label className="text-destructive">Danger Zone</Label>
                                <p className="text-sm text-muted-foreground mb-2">Permanently delete your account and all data</p>
                                <Button variant="destructive" className="w-full justify-start">
                                    Delete Account
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Save Button */}
                    <div className="flex justify-end gap-4">
                        <Button variant="outline">Cancel</Button>
                        <Button>Save Changes</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
