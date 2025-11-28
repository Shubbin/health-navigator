import { useState, useEffect } from "react";
import { Bell, Lock, Palette, Shield, Database, Download, Trash2, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import api from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/components/theme-provider";

const Settings = () => {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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

    // Password change dialog
    const [passwordDialog, setPasswordDialog] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [changingPassword, setChangingPassword] = useState(false);

    // Delete account dialog
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");
    const [deleting, setDeleting] = useState(false);

    // Load settings on mount
    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const response = await api.get("/settings");
            if (response.data.success) {
                setSettings(response.data.settings);
            }
        } catch (error) {
            console.error("Error loading settings:", error);
            toast.error("Failed to load settings");
        } finally {
            setLoading(false);
        }
    };

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

        // Apply theme immediately
        if (category === "appearance" && key === "theme") {
            setTheme(value);
        }
    };

    const saveSettings = async () => {
        setSaving(true);
        try {
            const response = await api.put("/settings", { settings });
            if (response.data.success) {
                toast.success("Settings saved successfully");
            }
        } catch (error) {
            console.error("Error saving settings:", error);
            toast.error("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setChangingPassword(true);
        try {
            const response = await api.post("/settings/change-password", {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });

            if (response.data.success) {
                toast.success("Password changed successfully");
                setPasswordDialog(false);
                setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            }
        } catch (error) {
            console.error("Error changing password:", error);
            toast.error(error.response?.data?.message || "Failed to change password");
        } finally {
            setChangingPassword(false);
        }
    };

    const handleExportData = async () => {
        try {
            toast.info("Preparing your data export...");
            const response = await api.get("/settings/export-data");

            if (response.data.success) {
                // Create and download JSON file
                const dataStr = JSON.stringify(response.data.data, null, 2);
                const dataBlob = new Blob([dataStr], { type: "application/json" });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `healscope-data-${new Date().toISOString().split("T")[0]}.json`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);

                toast.success("Data exported successfully");
            }
        } catch (error) {
            console.error("Error exporting data:", error);
            toast.error("Failed to export data");
        }
    };

    const handleClearCache = async () => {
        try {
            const response = await api.post("/settings/clear-cache");
            if (response.data.success) {
                toast.success("Cache cleared successfully");
            }
        } catch (error) {
            console.error("Error clearing cache:", error);
            toast.error("Failed to clear cache");
        }
    };

    const handleDeleteAccount = async () => {
        if (!deletePassword) {
            toast.error("Please enter your password");
            return;
        }

        setDeleting(true);
        try {
            const response = await api.delete("/settings/delete-account", {
                data: { password: deletePassword },
            });

            if (response.data.success) {
                toast.success("Account deleted successfully");
                localStorage.removeItem("isAuthenticated");
                localStorage.removeItem("user");
                setTimeout(() => {
                    navigate("/login");
                }, 1000);
            }
        } catch (error) {
            console.error("Error deleting account:", error);
            toast.error(error.response?.data?.message || "Failed to delete account");
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

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
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => setPasswordDialog(true)}
                                >
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
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={handleExportData}
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download Data
                                </Button>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <Label>Clear Cache</Label>
                                <p className="text-sm text-muted-foreground mb-2">Clear cached data to free up space</p>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={handleClearCache}
                                >
                                    Clear Cache
                                </Button>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <Label className="text-destructive">Danger Zone</Label>
                                <p className="text-sm text-muted-foreground mb-2">Permanently delete your account and all data</p>
                                <Button
                                    variant="destructive"
                                    className="w-full justify-start"
                                    onClick={() => setDeleteDialog(true)}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Account
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Save Button */}
                    <div className="flex justify-end gap-4">
                        <Button variant="outline" onClick={loadSettings}>Cancel</Button>
                        <Button onClick={saveSettings} disabled={saving}>
                            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                            Save Changes
                        </Button>
                    </div>
                </div>
            </div>

            {/* Change Password Dialog */}
            <Dialog open={passwordDialog} onOpenChange={setPasswordDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>
                            Enter your current password and choose a new one
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Current Password</Label>
                            <Input
                                type="password"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>New Password</Label>
                            <Input
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Confirm New Password</Label>
                            <Input
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setPasswordDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleChangePassword} disabled={changingPassword}>
                            {changingPassword ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                            Change Password
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Account Dialog */}
            <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-destructive">Delete Account</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. All your data will be permanently deleted.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Enter your password to confirm</Label>
                            <Input
                                type="password"
                                value={deletePassword}
                                onChange={(e) => setDeletePassword(e.target.value)}
                                placeholder="Password"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialog(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleting}>
                            {deleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                            Delete Account
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Settings;
