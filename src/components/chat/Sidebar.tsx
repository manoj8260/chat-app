import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useChatContext } from '@/contexts/ChatContext';
import { Plus, LogOut, Users, Hash, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const SidebarContent: React.FC = () => {
  const [newRoomName, setNewRoomName] = useState('');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  
  const {
    username,
    currentRoom,
    roomHistories,
    availableRooms,
    switchRoom,
    createOrJoinRoom,
    logout
  } = useChatContext();

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newRoomName.trim()) {
      toast({
        title: "Room Name Required",
        description: "Please enter a room name",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingRoom(true);
    try {
      await createOrJoinRoom(newRoomName);
      setNewRoomName('');
      toast({
        title: "Room Joined",
        description: `Successfully joined room #${newRoomName}`,
      });
    } catch (error) {
      toast({
        title: "Failed to Join Room",
        description: error instanceof Error ? error.message : "Could not join room",
        variant: "destructive",
      });
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const handleRoomSwitch = (roomId: string) => {
    if (roomId !== currentRoom) {
      switchRoom(roomId);
    }
  };

  const roomsToDisplay = availableRooms.length > 0 
    ? availableRooms 
    : Object.keys(roomHistories).map(roomId => ({
        room_id: roomId,
        users: []
      }));

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Hash className="h-5 w-5 text-accent" />
          Chat Rooms
        </h2>
      </div>

      {/* Room List */}
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-2">
          {roomsToDisplay.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No active rooms
            </div>
          ) : (
            roomsToDisplay.map((room) => {
              const unreadCount = roomHistories[room.room_id]?.unread || 0;
              const isActive = room.room_id === currentRoom;
              
              return (
                <button
                  key={room.room_id}
                  onClick={() => handleRoomSwitch(room.room_id)}
                  className={cn(
                    "w-full p-3 rounded-lg text-left transition-all duration-200 group",
                    "hover:bg-hover hover:transform hover:translate-x-1",
                    isActive 
                      ? "bg-accent text-accent-foreground shadow-glow font-semibold" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate font-medium">
                          {room.room_id}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-xs opacity-70">
                        <Users className="h-3 w-3" />
                        <span>
                          {room.users.length} user{room.users.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    {unreadCount > 0 && (
                      <Badge variant="destructive" className="ml-2 h-5 min-w-[20px] text-xs">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </Badge>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* Create Room Form */}
      <div className="p-4 border-t border-border/50 space-y-4">
        <form onSubmit={handleCreateRoom} className="flex gap-2">
          <Input
            type="text"
            placeholder="Create or join room..."
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            maxLength={20}
            className="flex-1 h-10 bg-input/50 border-border/50 focus:border-accent"
            disabled={isCreatingRoom}
          />
          <Button
            type="submit"
            size="sm"
            className="h-10 w-10 p-0 bg-accent hover:bg-accent/90 hover:shadow-glow transition-all"
            disabled={isCreatingRoom || !newRoomName.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </form>

        {/* User Profile */}
        <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border/50">
          <div className="flex-1 min-w-0">
            <div className="font-medium text-foreground truncate">
              {username}
            </div>
            <div className="text-xs text-muted-foreground">
              Online
            </div>
          </div>
          <Button
            onClick={logout}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export const Sidebar: React.FC = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm border border-border/50"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0 bg-chat-sidebar">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="w-80 bg-chat-sidebar border-r border-border/50">
      <SidebarContent />
    </div>
  );
};