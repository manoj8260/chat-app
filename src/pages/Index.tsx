import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Users, Zap, Shield, Globe, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import heroImage from '@/assets/chat-hero.jpg';

const Index: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/80 to-background/95" />
        
        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="space-y-6">
            {/* Logo & Title */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <MessageCircle className="w-12 h-12 text-primary" />
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                ConnectSphere
              </h1>
            </div>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Connect with friends and communities through real-time messaging. 
              Join conversations that matter.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
              <Button 
                size="lg"
                onClick={() => navigate('/auth')}
                className="h-14 px-8 text-lg font-semibold bg-gradient-primary hover:opacity-90 text-primary-foreground min-w-[200px]"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Get Started
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/chat')}
                className="h-14 px-8 text-lg font-medium border-primary/30 hover:border-primary/50 hover:bg-primary/5 min-w-[200px]"
              >
                <Zap className="w-5 h-5 mr-2" />
                Quick Chat
              </Button>
            </div>
            
            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-3xl mx-auto">
              <Card className="glass border-border/50 text-center p-6">
                <Users className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Multiple Rooms</h3>
                <p className="text-sm text-muted-foreground">Join different chat rooms for various topics and communities</p>
              </Card>
              
              <Card className="glass border-border/50 text-center p-6">
                <Globe className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Real-time</h3>
                <p className="text-sm text-muted-foreground">Instant messaging with WebSocket technology</p>
              </Card>
              
              <Card className="glass border-border/50 text-center p-6">
                <Smartphone className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Responsive</h3>
                <p className="text-sm text-muted-foreground">Works perfectly on desktop, tablet, and mobile devices</p>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose ConnectSphere?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built with modern technologies for a seamless chatting experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="glass border-border/50 p-6 hover:shadow-glow transition-all duration-300">
              <CardHeader className="pb-4">
                <Shield className="w-10 h-10 text-primary mb-2" />
                <CardTitle className="text-xl">Secure & Private</CardTitle>
                <CardDescription>Your conversations are protected with modern security practices</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="glass border-border/50 p-6 hover:shadow-glow transition-all duration-300">
              <CardHeader className="pb-4">
                <Zap className="w-10 h-10 text-primary mb-2" />
                <CardTitle className="text-xl">Lightning Fast</CardTitle>
                <CardDescription>Real-time messaging with instant delivery and minimal latency</CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="glass border-border/50 p-6 hover:shadow-glow transition-all duration-300">
              <CardHeader className="pb-4">
                <Users className="w-10 h-10 text-primary mb-2" />
                <CardTitle className="text-xl">Community Focused</CardTitle>
                <CardDescription>Create and join communities around your interests</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-24 px-4 bg-gradient-to-r from-primary/10 via-transparent to-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Start Chatting?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users already connecting on ConnectSphere. 
            Create an account or jump right into a quick chat session.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              onClick={() => navigate('/auth')}
              className="h-14 px-8 text-lg font-semibold bg-gradient-primary hover:opacity-90 text-primary-foreground min-w-[200px]"
            >
              Create Account
            </Button>
            
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/chat')}
              className="h-14 px-8 text-lg font-medium border-primary/30 hover:border-primary/50 hover:bg-primary/5 min-w-[200px]"
            >
              Try as Guest
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;