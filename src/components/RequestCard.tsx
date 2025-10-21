import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface RequestCardProps {
  request: any;
  isOwner?: boolean;
  showContact?: boolean;
  onUpdate?: () => void;
  onMessageClick?: (receiverId: string) => void;
}

const RequestCard = ({ request, isOwner, showContact, onUpdate, onMessageClick }: RequestCardProps) => {
  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{request.food_type_needed}</CardTitle>
            {request.receiver && (
              <p className="text-sm text-muted-foreground mt-1">
                by {request.receiver.full_name}
              </p>
            )}
          </div>
          <Badge variant={request.status === 'active' ? 'default' : 'secondary'}>
            {request.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm">{request.description}</p>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}</span>
        </div>

        {request.urgency_level && (
          <p className="text-sm">
            <span className="font-medium">Urgency:</span> {request.urgency_level}
          </p>
        )}

        {showContact && request.receiver && !isOwner && (
          <Button 
            className="w-full" 
            onClick={() => onMessageClick && onMessageClick(request.receiver_id)}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Contact Receiver
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default RequestCard;
