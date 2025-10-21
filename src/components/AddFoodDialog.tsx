import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useUserLocation } from '@/hooks/useUserLocation';

interface AddFoodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddFoodDialog = ({ open, onOpenChange, onSuccess }: AddFoodDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [foodType, setFoodType] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const { location } = useUserLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('food_listings').insert({
        giver_id: user.id,
        food_type: foodType,
        description,
        quantity: quantity || '1 serving',
        title: foodType,
        location: 'Current Location',
        pickup_time: new Date().toISOString(),
        latitude: location?.lat,
        longitude: location?.lng,
        is_available: true,
      });

      if (error) throw error;

      toast.success('Food listing added successfully!');
      setFoodType('');
      setDescription('');
      setQuantity('');
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Food Listing</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="foodType">Food Type</Label>
            <Input
              id="foodType"
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
              required
              placeholder="e.g., Fresh vegetables"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Describe the food items..."
            />
          </div>
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g., 5 kg"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              'Add Listing'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFoodDialog;
