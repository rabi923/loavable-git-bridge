import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { LocationCoords } from '@/utils/geolocation';

export type MapDataItem = {
  id: string; latitude: number; longitude: number; [key: string]: any;
};

export const useMapData = (
  userRole: 'food_giver' | 'food_receiver',
  userLocation: LocationCoords | null
) => {
  const [data, setData] = useState<MapDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const refetch = async () => {
    setLoading(true); setError(null);
    try {
      if (userRole === 'food_receiver') {
        // --- THIS IS THE FIX: Restoring the correct, explicit query ---
        const { data: listings, error: fetchError } = await supabase.from('food_listings')
          .select(`*, giver:profiles!giver_id (id, full_name, profile_picture_url, organization_name)`)
          .eq('is_available', true).not('latitude', 'is', null).not('longitude', 'is', null)
          .order('created_at', { ascending: false });
        if (fetchError) throw fetchError;
        setData(Array.isArray(listings) ? listings : []);
      } else {
        // Fetch food requests with receiver profile info for givers
        const { data: requests, error: fetchError } = await supabase
          .from('food_requests')
          .select('*')
          .eq('status', 'active')
          .not('latitude', 'is', null)
          .not('longitude', 'is', null)
          .order('created_at', { ascending: false });
        
        if (fetchError) throw fetchError;
        
        // Fetch receiver profiles separately and merge
        if (requests && requests.length > 0) {
          const receiverIds = [...new Set(requests.map(r => r.receiver_id))];
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, full_name, profile_picture_url, organization_name')
            .in('id', receiverIds);
          
          const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
          const enrichedRequests = requests.map(request => ({
            ...request,
            receiver: profileMap.get(request.receiver_id)
          }));
          setData(enrichedRequests);
        } else {
          setData([]);
        }
      }
    } catch (err) { setError(err); } finally { setLoading(false); }
  };

  useEffect(() => {
    refetch();
  }, [userRole, userLocation?.lat, userLocation?.lng]);

  return { data, loading, error, refetch };
};
