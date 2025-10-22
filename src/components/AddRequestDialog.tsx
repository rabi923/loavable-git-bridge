import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useUserLocation } from '@/hooks/useUserLocation';

interface AddRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddRequestDialog = ({ open, onOpenChange, onSuccess }: AddRequestDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [foodType, setFoodType] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('medium');
  const { location } = useUserLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('food_requests').insert({
        receiver_id: user.id,
        food_preference: foodType,
        notes: description,
        urgency_level: urgency,
        latitude: location?.lat || 0,
        longitude: location?.lng || 0,
        location_address: 'Current Location',
        needed_by: new Date(Date.now() + 86400000).toISOString(),
        people_count: 1,
        status: 'active',
      });

      if (error) throw error;

      toast.success('Food request added successfully!');
      setFoodType('');
      setDescription('');
      setUrgency('medium');
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Food Request</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="foodType">Food Type Needed</Label>
            <Input
              id="foodType"
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
              required
              placeholder="e.g., Rice, Vegetables"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Describe your needs..."
            />
          </div>
          <div>
            <Label htmlFor="urgency">Urgency Level</Label>
            <Select value={urgency} onValueChange={(value: any) => setUrgency(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              'Add Request'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRequestDialog;
