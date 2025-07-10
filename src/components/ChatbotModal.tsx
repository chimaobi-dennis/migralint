import { useState } from "react";
import { MessageSquare, X, Send, User, Bot, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Message {
  id: string;
  type: 'user' | 'ai' | 'officer';
  content: string;
  timestamp: Date;
}

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatbotModal = ({ isOpen, onClose }: ChatbotModalProps) => {
  const [activeChat, setActiveChat] = useState<'ai' | 'officer'>('ai');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m here to help you with your application process. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  if (!isOpen) return null;

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate response
    setTimeout(() => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: activeChat,
        content: activeChat === 'ai' 
          ? 'I understand your question. Let me help you with that...'
          : 'Thank you for contacting us. A case officer will review your query and respond within 24 hours.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, responseMessage]);
    }, 1000);

    setNewMessage('');
  };

  const switchToOfficer = () => {
    setActiveChat('officer');
    const switchMessage: Message = {
      id: Date.now().toString(),
      type: 'officer',
      content: 'You\'ve been connected to a case officer. Please describe your issue and we\'ll assist you promptly.',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, switchMessage]);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md h-[600px] flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <CardTitle className="text-lg">Help Center</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={activeChat === 'ai' ? 'default' : 'outline'}
              size="sm"
              className="flex-1"
              onClick={() => setActiveChat('ai')}
            >
              <Bot className="h-4 w-4 mr-2" />
              AI Assistant
            </Button>
            <Button
              variant={activeChat === 'officer' ? 'default' : 'outline'}
              size="sm"
              className="flex-1"
              onClick={switchToOfficer}
            >
              <Phone className="h-4 w-4 mr-2" />
              Case Officer
            </Button>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.type !== 'user' && (
                    <div className="flex-shrink-0">
                      {message.type === 'ai' ? (
                        <Bot className="h-8 w-8 p-1.5 bg-blue-100 text-blue-600 rounded-full" />
                      ) : (
                        <User className="h-8 w-8 p-1.5 bg-green-100 text-green-600 rounded-full" />
                      )}
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : message.type === 'ai'
                        ? 'bg-blue-50 text-blue-900'
                        : 'bg-green-50 text-green-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>

                  {message.type === 'user' && (
                    <div className="flex-shrink-0">
                      <User className="h-8 w-8 p-1.5 bg-gray-100 text-gray-600 rounded-full" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          <Separator />

          <div className="p-4">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatbotModal;