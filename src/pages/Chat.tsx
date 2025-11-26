import { useState } from "react";
import { MessageSquare, Send, Bot, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hello! I'm your AI health assistant. How can I help you today? You can ask me about symptoms, health concerns, or general wellness advice.",
      timestamp: "10:30 AM",
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const quickPrompts = [
    "I have a headache",
    "Experiencing eye strain",
    "Feeling tired lately",
    "Need medication advice",
  ];

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      sender: "user",
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages([...messages, newMessage]);
    setInputValue("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        sender: "ai",
        text: "Thank you for sharing that. Based on what you've told me, I'd recommend monitoring your symptoms. If they persist or worsen, please consult a healthcare professional. Would you like me to help you find relevant articles or schedule a scan?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="text-primary hover:underline text-sm mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">AI Health Assistant</h1>
            <Badge className="status-success">Available 24/7</Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="h-[calc(100vh-250px)] flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Chat with AI
              </CardTitle>
            </CardHeader>

            {/* Messages Area */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.sender === "user" ? "flex-row-reverse" : "flex-row"} animate-slide-in`}
                >
                  <div
                    className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                      message.sender === "ai" ? "bg-primary/10" : "bg-secondary/10"
                    }`}
                  >
                    {message.sender === "ai" ? (
                      <Bot className="h-4 w-4 text-primary" />
                    ) : (
                      <User className="h-4 w-4 text-secondary" />
                    )}
                  </div>
                  <div
                    className={`max-w-[70%] rounded-lg p-4 ${
                      message.sender === "ai"
                        ? "bg-card border border-border"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p
                      className={`text-xs mt-2 ${
                        message.sender === "ai" ? "text-muted-foreground" : "text-primary-foreground/70"
                      }`}
                    >
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>

            {/* Quick Prompts */}
            <div className="border-t p-4">
              <p className="text-sm text-muted-foreground mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {quickPrompts.map((prompt, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setInputValue(prompt)}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>

              {/* Input Area */}
              <div className="flex gap-2">
                <Input
                  placeholder="Describe your symptoms or ask a health question..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1"
                />
                <Button onClick={handleSend} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-xs text-muted-foreground mt-2">
                This AI assistant provides general guidance only. Always consult a healthcare professional for
                medical advice.
              </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Chat;
