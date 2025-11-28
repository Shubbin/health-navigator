import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import api from "@/lib/api";

const ChatInterface = ({ className, embedded = false }) => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: "ai",
            text: "Hello! I'm your AI health assistant. How can I help you today? You can ask me about symptoms, health concerns, or general wellness advice.",
            timestamp: new Date().toISOString(),
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [currentChatId, setCurrentChatId] = useState(null);
    const scrollRef = useRef(null);
    const textareaRef = useRef(null);
    const recognitionRef = useRef(null);

    const quickPrompts = [
        "I have a headache and eye strain",
        "Tell me about preventive dental care",
        "How can I improve my sleep quality?",
        "What are signs of dehydration?",
    ];

    // Initialize speech recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInputValue(transcript);
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
                toast.error('Voice input error. Please try again.');
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    // Load chat history on mount
    useEffect(() => {
        const loadChatHistory = async () => {
            try {
                const response = await api.get("/chats");
                if (response.data.success && response.data.chats.length > 0) {
                    // Load the most recent chat
                    const latestChat = response.data.chats[0];
                    // We need to fetch the full details of this chat to get messages
                    const chatDetail = await api.get(`/chats/${latestChat._id}`);
                    if (chatDetail.data.success) {
                        setMessages(chatDetail.data.chat.messages);
                        setCurrentChatId(latestChat._id);
                    }
                }
            } catch (error) {
                console.error("Error loading chat history:", error);
            }
        };
        loadChatHistory();
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const toggleVoiceInput = () => {
        if (!recognitionRef.current) {
            toast.error('Voice input is not supported in your browser');
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            try {
                recognitionRef.current.start();
                setIsListening(true);
                toast.success('Listening... Speak now');
            } catch (error) {
                console.error('Error starting recognition:', error);
                toast.error('Could not start voice input');
            }
        }
    };

    const saveChatToBackend = async (updatedMessages) => {
        try {
            if (currentChatId) {
                await api.put(`/chats/${currentChatId}`, {
                    messages: updatedMessages,
                    title: updatedMessages[1]?.text.substring(0, 30) || "New Chat",
                    preview: updatedMessages[updatedMessages.length - 1]?.text.substring(0, 50)
                });
            } else {
                const response = await api.post("/chats", {
                    title: updatedMessages[1]?.text.substring(0, 30) || "New Chat",
                    messages: updatedMessages,
                    preview: updatedMessages[updatedMessages.length - 1]?.text.substring(0, 50)
                });
                if (response.data.success) {
                    setCurrentChatId(response.data.chat._id);
                }
            }
        } catch (error) {
            console.error("Error saving chat:", error);
        }
    };

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const newMessage = {
            id: Date.now(),
            sender: "user",
            text: inputValue,
            timestamp: new Date().toISOString(),
        };

        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        setInputValue("");
        setIsTyping(true);

        // Save user message immediately
        await saveChatToBackend(updatedMessages);

        // Simulate AI response
        setTimeout(async () => {
            const aiResponse = {
                id: Date.now() + 1,
                sender: "ai",
                text: "Thank you for sharing that. Based on what you've told me, I'd recommend monitoring your symptoms. If they persist or worsen, please consult a healthcare professional. Would you like me to help you find relevant articles or schedule a health scan?",
                timestamp: new Date().toISOString(),
            };

            const finalMessages = [...updatedMessages, aiResponse];
            setMessages(finalMessages);
            setIsTyping(false);

            // Save AI response
            await saveChatToBackend(finalMessages);
        }, 1500);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className={cn("flex flex-col h-full bg-background", className)}>
            {/* Chat Header */}
            <div className="border-b px-6 py-4 bg-card">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold">AI Health Assistant</h1>
                        <p className="text-sm text-muted-foreground">Always here to help</p>
                    </div>
                </div>
            </div>

            {/* Messages Container */}
            <ScrollArea className="flex-1 px-4" ref={scrollRef}>
                <div className={cn("mx-auto py-8 space-y-6", embedded ? "max-w-full" : "max-w-3xl")}>
                    {messages.length === 1 && (
                        <div className="text-center space-y-4 py-12">
                            <div className="inline-flex h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 items-center justify-center mb-4">
                                <Bot className="h-8 w-8 text-primary" />
                            </div>
                            <h2 className="text-2xl font-semibold">How can I assist you today?</h2>
                            <p className="text-muted-foreground">Ask me anything about your health and wellness</p>

                            {/* Quick Prompts */}
                            <div className={cn("grid gap-3 mt-8 mx-auto", embedded ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 max-w-2xl")}>
                                {quickPrompts.map((prompt, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setInputValue(prompt)}
                                        className="p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-accent transition-all text-left group"
                                    >
                                        <p className="text-sm group-hover:text-primary transition-colors">{prompt}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {messages.slice(1).map((message) => (
                        <div
                            key={message.id}
                            className={cn(
                                "flex gap-4 animate-in fade-in-50 slide-in-from-bottom-4",
                                message.sender === "user" && "flex-row-reverse"
                            )}
                        >
                            {/* Avatar */}
                            <div
                                className={cn(
                                    "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center",
                                    message.sender === "ai"
                                        ? "bg-gradient-to-br from-primary to-primary/60"
                                        : "bg-secondary"
                                )}
                            >
                                {message.sender === "ai" ? (
                                    <Bot className="h-4 w-4 text-primary-foreground" />
                                ) : (
                                    <User className="h-4 w-4 text-secondary-foreground" />
                                )}
                            </div>

                            {/* Message Content */}
                            <div className={cn("flex-1", message.sender === "user" && "flex justify-end")}>
                                <div
                                    className={cn(
                                        "rounded-2xl px-5 py-3 max-w-[85%]",
                                        message.sender === "ai"
                                            ? "bg-muted"
                                            : "bg-primary text-primary-foreground"
                                    )}
                                >
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                                    <p
                                        className={cn(
                                            "text-xs mt-2",
                                            message.sender === "ai" ? "text-muted-foreground" : "text-primary-foreground/70"
                                        )}
                                    >
                                        {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <div className="flex gap-4 animate-in fade-in-50">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                                <Bot className="h-4 w-4 text-primary-foreground" />
                            </div>
                            <div className="bg-muted rounded-2xl px-5 py-3">
                                <div className="flex gap-1">
                                    <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" />
                                    <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce delay-100" />
                                    <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce delay-200" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t bg-card px-4 py-4">
                <div className={cn("mx-auto", embedded ? "max-w-full" : "max-w-3xl")}>
                    <div className="flex gap-3 items-end">
                        <div className="flex-1 relative">
                            <Textarea
                                ref={textareaRef}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Message AI..."
                                className="min-h-[52px] max-h-[200px] resize-none pr-12 rounded-2xl"
                                rows={1}
                            />
                        </div>
                        <Button
                            onClick={toggleVoiceInput}
                            disabled={isTyping}
                            size="icon"
                            variant={isListening ? "default" : "outline"}
                            className={cn(
                                "h-[52px] w-[52px] rounded-2xl transition-all",
                                isListening && "animate-pulse"
                            )}
                            title={isListening ? "Stop listening" : "Start voice input"}
                        >
                            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                        </Button>
                        <Button
                            onClick={handleSend}
                            disabled={!inputValue.trim() || isTyping}
                            size="icon"
                            className="h-[52px] w-[52px] rounded-2xl"
                        >
                            <Send className="h-5 w-5" />
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                        AI can make mistakes. Consult a professional.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
