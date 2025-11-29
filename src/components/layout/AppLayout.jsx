import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    Activity,
    MessageSquare,
    Scan,
    Calendar,
    Newspaper,
    History as HistoryIcon,
    Menu,
    X,
    Settings,
    User,
    Plus,
    Trash2,
    LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";


const AppLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    // Mock chat history - replace with actual data from backend
    const [chatHistory, setChatHistory] = useState([
        { id: "1", title: "Headache and eye strain", date: "Today", preview: "I have a headache and..." },
        { id: "2", title: "Dental care advice", date: "Yesterday", preview: "Tell me about preventive..." },
        { id: "3", title: "Sleep quality tips", date: "2 days ago", preview: "How can I improve my..." },
        { id: "4", title: "Dehydration symptoms", date: "1 week ago", preview: "What are signs of..." },
    ]);

    const navigation = [
        { name: "Home", href: "/", icon: Activity },
        { name: "Chat", href: "/chat", icon: MessageSquare },
        { name: "Health Scanner", href: "/scanner", icon: Scan },
        { name: "MedBuddy", href: "/medbuddy", icon: Calendar },
        { name: "Health Blog", href: "/blog", icon: Newspaper },
        { name: "History", href: "/history", icon: HistoryIcon },
    ];

    const handleNewChat = () => {
        navigate("/");
        window.location.reload(); // Simple refresh for new chat - improve with state management
    };

    const handleDeleteChat = (id) => {
        setChatHistory(chatHistory.filter(chat => chat.id !== id));
    };

    const handleLogout = () => {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Sidebar */}
            <aside
                className={cn(
                    "flex flex-col border-r bg-card transition-all duration-300",
                    sidebarOpen ? "w-64" : "w-0 md:w-16"
                )}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    {sidebarOpen && (
                        <div className="flex items-center gap-2">
                            <Activity className="h-6 w-6 text-primary" />
                            <span className="font-bold text-lg">HealScope NG</span>
                        </div>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className={cn(!sidebarOpen && "mx-auto")}
                    >
                        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>

                {/* New Chat Button */}
                {sidebarOpen && location.pathname === "/" && (
                    <div className="p-2">
                        <Button
                            onClick={handleNewChat}
                            className="w-full justify-start gap-2"
                            variant="outline"
                        >
                            <Plus className="h-4 w-4" />
                            New Chat
                        </Button>
                    </div>
                )}

                {/* Navigation Links */}
                <ScrollArea className="flex-1 py-2">
                    <nav className="space-y-1 px-2">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                    )}
                                    title={!sidebarOpen ? item.name : undefined}
                                >
                                    <item.icon className="h-5 w-5 shrink-0" />
                                    {sidebarOpen && <span className="font-medium">{item.name}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Chat History */}
                    {sidebarOpen && location.pathname === "/" && chatHistory.length > 0 && (
                        <>
                            <Separator className="my-4" />
                            <div className="px-4 py-2">
                                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                    Recent Chats
                                </h3>
                                <div className="space-y-1">
                                    {chatHistory.map((chat) => (
                                        <div
                                            key={chat.id}
                                            className="group flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted cursor-pointer"
                                        >
                                            <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{chat.title}</p>
                                                <p className="text-xs text-muted-foreground">{chat.date}</p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteChat(chat.id);
                                                }}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </ScrollArea>

                {/* Sidebar Footer */}
                <div className="border-t p-2 space-y-1">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start gap-3",
                            !sidebarOpen && "justify-center"
                        )}
                        title={!sidebarOpen ? "Settings" : undefined}
                        onClick={() => navigate("/settings")}
                    >
                        <Settings className="h-5 w-5 shrink-0" />
                        {sidebarOpen && <span>Settings</span>}
                    </Button>
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start gap-3",
                            !sidebarOpen && "justify-center"
                        )}
                        title={!sidebarOpen ? "Profile" : undefined}
                        onClick={() => navigate("/profile")}
                    >
                        <User className="h-5 w-5 shrink-0" />
                        {sidebarOpen && <span>Profile</span>}
                    </Button>
                    {sidebarOpen && (
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-5 w-5 shrink-0" />
                            <span>Log Out</span>
                        </Button>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>

        </div>
    );
};

export default AppLayout;
