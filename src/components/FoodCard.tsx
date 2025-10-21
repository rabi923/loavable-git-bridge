import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { LocationCoords } from '@/utils/geolocation';
import { getDistance } from 'geolib';

interface FoodCardProps {
  listing: any;
  isOwner?: boolean;
  showContact?: boolean;
  onUpdate?: () => void;
  userLocation?: LocationCoords | null;
  onMessageClick?: (giverId: string) => void;
}

const FoodCard = ({ listing, isOwner, showContact, onUpdate, userLocation, onMessageClick }: FoodCardProps) => {
  const distance = userLocation && listing.latitude && listing.longitude
    ? (getDistance(
        { latitude: userLocation.lat, longitude: userLocation.lng },
        { latitude: listing.latitude, longitude: listing.longitude }
      ) / 1000).toFixed(1)
    : null;

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{listing.food_type}</CardTitle>
            {listing.giver && (
              <p className="text-sm text-muted-foreground mt-1">
                by {listing.giver.organization_name || listing.giver.full_name}
              </p>
            )}
          </div>
          <Badge variant={listing.is_available ? 'default' : 'secondary'}>
            {listing.is_available ? 'Available' : 'Unavailable'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm">{listing.description}</p>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {distance && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{distance} km away</span>
            </div>
          )}
          <span>{formatDistanceToNow(new Date(listing.created_at), { addSuffix: true })}</span>
        </div>

        {listing.quantity && (
          <p className="text-sm">
            <span className="font-medium">Quantity:</span> {listing.quantity}
          </p>
        )}

        {showContact && listing.giver && !isOwner && (
          <Button 
            className="w-full" 
            onClick={() => onMessageClick && onMessageClick(listing.giver_id)}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Contact Giver
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default FoodCard;
