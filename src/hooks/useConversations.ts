import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

export type ConversationDetails = {
  id: string; other_user_id: string; other_user_name: string | null;
  other_user_avatar: string | null; last_message_text: string | null;
  last_message_at: string | null; unread_count: number;
};

export const useConversations = () => {
  const [conversations, setConversations] = useState<ConversationDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const fetchUserAndConversations = async (currentUser: User) => {
      // Fetch conversations for the current user
      const { data: convos, error: convosError } = await supabase
        .from('conversations')
        .select('*')
        .or(`user1_id.eq.${currentUser.id},user2_id.eq.${currentUser.id}`)
        .order('last_message_at', { ascending: false });
      
      if (convosError) {
        console.error("Failed to fetch conversations:", convosError);
        setLoading(false);
        return;
      }

      // For each conversation, get the other user's profile and last message
      const conversationsWithDetails = await Promise.all(
        (convos || []).map(async (convo) => {
          const otherUserId = convo.user1_id === currentUser.id ? convo.user2_id : convo.user1_id;
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, full_name, profile_picture_url')
            .eq('id', otherUserId)
            .single();

          const { data: lastMsg } = await supabase
            .from('messages')
            .select('message_text, created_at')
            .eq('conversation_id', convo.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', convo.id)
            .neq('sender_id', currentUser.id)
            .is('read_at', null);

          return {
            id: convo.id,
            other_user_id: otherUserId,
            other_user_name: profile?.full_name || null,
            other_user_avatar: profile?.profile_picture_url || null,
            last_message_text: lastMsg?.message_text || null,
            last_message_at: lastMsg?.created_at || convo.last_message_at || null,
            unread_count: unreadCount || 0,
          };
        })
      );

      setConversations(conversationsWithDetails);
      setLoading(false);
  };
  
  useEffect(() => {
    let currentUserRef: User | null = null;

    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      currentUserRef = user;
      setUser(user);
      if (user) await fetchUserAndConversations(user); else setLoading(false);
    };
    init();

    const channel = supabase.channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' },
        () => { if(currentUserRef) fetchUserAndConversations(currentUserRef); }
      ).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { conversations, loading, user };
};
