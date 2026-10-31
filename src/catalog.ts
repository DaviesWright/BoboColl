import {useEffect, useState} from 'react';
import {products as placeholders, type Product} from '../content';

/** Loads the saved product list from /api/products, or the built-in placeholders if none is saved yet. */
export function useCatalog(): {items: Product[]; loading: boolean} {
  const [items, setItems] = useState<Product[]>(placeholders);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/products')
      .then((r) => (r.ok ? r.json() : null))
      .then((data: {products?: Product[]} | null) => {
        if (cancelled || !data || !Array.isArray(data.products)) return;
        if (data.products.length > 0) setItems(data.products);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return {items, loading};
}