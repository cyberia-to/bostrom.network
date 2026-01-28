import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BootPriceData {
  price: number | null;
  priceChange24h: number | null;
  marketCap: number | null;
  fullyDilutedValuation: number | null;
  volume24h: number | null;
  circulatingSupply: number | null;
  totalSupply: number | null;
  isLoading: boolean;
  error: string | null;
}

export const useBootPrice = (): BootPriceData => {
  const [data, setData] = useState<Omit<BootPriceData, 'isLoading' | 'error'>>({
    price: null,
    priceChange24h: null,
    marketCap: null,
    fullyDilutedValuation: null,
    volume24h: null,
    circulatingSupply: null,
    totalSupply: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data: responseData, error: fnError } = await supabase.functions.invoke('get-boot-price');

        if (fnError) {
          throw new Error(fnError.message);
        }

        if (responseData?.success) {
          setData({
            price: responseData.price,
            priceChange24h: responseData.priceChange24h,
            marketCap: responseData.marketCap,
            fullyDilutedValuation: responseData.fullyDilutedValuation,
            volume24h: responseData.volume24h,
            circulatingSupply: responseData.circulatingSupply,
            totalSupply: responseData.totalSupply,
          });
        } else {
          throw new Error(responseData?.error || 'Failed to fetch price');
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

  return { ...data, isLoading, error };
};
