import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BootPriceData {
  price: number | null;
  priceChange24h: number | null;
  isLoading: boolean;
  error: string | null;
}

export const useBootPrice = (): BootPriceData => {
  const [price, setPrice] = useState<number | null>(null);
  const [priceChange24h, setPriceChange24h] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error: fnError } = await supabase.functions.invoke('get-boot-price');

        if (fnError) {
          throw new Error(fnError.message);
        }

        if (data?.success) {
          setPrice(data.price);
          setPriceChange24h(data.priceChange24h);
        } else {
          throw new Error(data?.error || 'Failed to fetch price');
        }
      } catch (err) {
        console.error('Error fetching BOOT price:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch price');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrice();

    // Refresh price every 60 seconds
    const interval = setInterval(fetchPrice, 60000);
    return () => clearInterval(interval);
  }, []);

  return { price, priceChange24h, isLoading, error };
};
