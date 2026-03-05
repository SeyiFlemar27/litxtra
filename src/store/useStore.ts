import { useState, useCallback } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  subcategory?: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  description: string;
  limited?: boolean;
  new?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface WishlistItem extends Product {}

export interface OrderInfo {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface NotifyEmail {
  email: string;
  timestamp: Date;
}

// Sample products with more colors and categories
export const products: Product[] = [
  {
    id: '1',
    name: 'DECONSTRUCTED VOID JACKET',
    price: 489,
    originalPrice: 650,
    image: 'https://res.cloudinary.com/drefcs4o2/image/upload/v1772654452/photo_2026-03-04_20-57-57_qdsljn.jpg',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80',
    ],
    category: 'OUTERWEAR',
    subcategory: 'clothes',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Void Black', hex: '#0a0a0a' },
      { name: 'Bone', hex: '#e8e4de' },
      { name: 'Olive Drab', hex: '#556B2F' },
      { name: 'Burgundy', hex: '#800020' },
      { name: 'Navy Storm', hex: '#1a1a3a' },
    ],
    description: 'Oversized deconstructed jacket with raw edge detailing.',
    limited: true,
    new: true,
  },
  {
    id: '2',
    name: 'CULTURE OVERSIZED TEE',
    price: 145,
    image: 'https://res.cloudinary.com/drefcs4o2/image/upload/v1772654451/photo_2026-03-04_20-58-02_iitnfp.jpg',
    category: 'TOPS',
    subcategory: 'clothes',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Washed Black', hex: '#1a1a1a' },
      { name: 'Storm Grey', hex: '#4a4a4a' },
      { name: 'Off White', hex: '#f5f5f0' },
      { name: 'Rust', hex: '#b7410e' },
      { name: 'Forest Green', hex: '#228B22' },
      { name: 'Vintage Navy', hex: '#2a3a5a' },
    ],
    description: 'Premium heavyweight cotton with vintage wash finish.',
    new: true,
  },
  {
    id: '3',
    name: 'DISRUPTION CARGO PANTS',
    price: 289,
    image: 'https://res.cloudinary.com/drefcs4o2/image/upload/v1772654452/photo_2026-03-04_20-57-52_t6ntf9.jpg',
    category: 'BOTTOMS',
    subcategory: 'clothes',
    sizes: ['28', '30', '32', '34', '36'],
    colors: [
      { name: 'Tactical Black', hex: '#0f0f0f' },
      { name: 'Sand', hex: '#c4b8a5' },
      { name: 'Army Olive', hex: '#4b5320' },
      { name: 'Slate', hex: '#708090' },
    ],
    description: 'Utilitarian cargo with articulated knees and hidden pockets.',
  },
  {
    id: '4',
    name: 'SIGNAL HOODIE',
    price: 225,
    image: 'https://res.cloudinary.com/drefcs4o2/image/upload/v1772731131/photo_2026-03-05_18-18-36_iswa1n.jpg',
    category: 'TOPS',
    subcategory: 'clothes',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Deep Black', hex: '#0a0a0a' },
      { name: 'Faded Navy', hex: '#1a1a3a' },
      { name: 'Charcoal', hex: '#36454F' },
      { name: 'Heather Grey', hex: '#9AA5B1' },
      { name: 'Burgundy Wine', hex: '#722F37' },
    ],
    description: 'Heavyweight French terry with embroidered signal graphics.',
    limited: true,
  },
  {
    id: '5',
    name: 'GLITCH KNIT SWEATER',
    price: 345,
    originalPrice: 420,
    image: 'https://res.cloudinary.com/drefcs4o2/image/upload/v1772731236/photo_2026-03-05_18-20-21_flsfwv.jpg',
    category: 'TOPS',
    subcategory: 'clothes',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Static', hex: '#2a2a2a' },
      { name: 'Cream', hex: '#f0ebe3' },
      { name: 'Moss', hex: '#8B8B00' },
      { name: 'Terracotta', hex: '#E2725B' },
    ],
    description: 'Distorted pattern knit with intentional imperfections.',
    new: true,
  },
  {
    id: '6',
    name: 'VOID ESSENTIAL SHORTS',
    price: 165,
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80',
    category: 'BOTTOMS',
    subcategory: 'clothes',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Obsidian', hex: '#0d0d0d' },
      { name: 'Concrete', hex: '#7a7a7a' },
      { name: 'Stone Wash', hex: '#8B8378' },
      { name: 'Indigo', hex: '#4B0082' },
    ],
    description: 'Relaxed fit shorts with hidden zip pocket.',
  },
  // JOGGERS
  {
    id: '7',
    name: 'CULTURE TECH JOGGERS',
    price: 195,
    image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=80',
    category: 'BOTTOMS',
    subcategory: 'joggers',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Night Black', hex: '#0a0a0a' },
      { name: 'Cement', hex: '#a0a0a0' },
      { name: 'Olive', hex: '#556B2F' },
      { name: 'Navy', hex: '#000080' },
      { name: 'Maroon', hex: '#800000' },
    ],
    description: 'Technical performance joggers with tapered fit and zip pockets.',
    new: true,
  },
  {
    id: '8',
    name: 'DISRUPTION SWEAT JOGGERS',
    price: 175,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
    category: 'BOTTOMS',
    subcategory: 'joggers',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Washed Black', hex: '#1a1a1a' },
      { name: 'Heather', hex: '#B6B6B4' },
      { name: 'Sage', hex: '#9DC183' },
    ],
    description: 'Heavyweight fleece joggers with raw edge hem details.',
    limited: true,
  },
  {
    id: '9',
    name: 'VOID TRACK PANTS',
    price: 210,
    originalPrice: 280,
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80',
    category: 'BOTTOMS',
    subcategory: 'joggers',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Triple Black', hex: '#0d0d0d' },
      { name: 'White Smoke', hex: '#F5F5F5' },
      { name: 'Royal Blue', hex: '#4169E1' },
    ],
    description: 'Retro-inspired track pants with side stripe detailing.',
  },
  // CAPS
  {
    id: '10',
    name: 'SIGNAL SNAPBACK CAP',
    price: 65,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80',
    category: 'ACCESSORIES',
    subcategory: 'caps',
    sizes: ['ONE SIZE'],
    colors: [
      { name: 'Pitch Black', hex: '#0a0a0a' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Desert Tan', hex: '#C19A6B' },
      { name: 'Olive Drab', hex: '#6B8E23' },
      { name: 'Blood Red', hex: '#8B0000' },
    ],
    description: 'Structured snapback with embroidered LITXTRA logo.',
    new: true,
  },
  {
    id: '11',
    name: 'CULTURE DAD HAT',
    price: 55,
    image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80',
    category: 'ACCESSORIES',
    subcategory: 'caps',
    sizes: ['ONE SIZE'],
    colors: [
      { name: 'Vintage Black', hex: '#1a1a1a' },
      { name: 'Stone', hex: '#928E85' },
      { name: 'Washed Navy', hex: '#2C3E50' },
      { name: 'Forest', hex: '#228B22' },
    ],
    description: 'Relaxed fit dad hat with distressed embroidery.',
  },
  {
    id: '12',
    name: 'GLITCH BEANIE',
    price: 45,
    image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&q=80',
    category: 'ACCESSORIES',
    subcategory: 'caps',
    sizes: ['ONE SIZE'],
    colors: [
      { name: 'Void Black', hex: '#0d0d0d' },
      { name: 'Cream', hex: '#FFFDD0' },
      { name: 'Burgundy', hex: '#800020' },
      { name: 'Grey Marl', hex: '#8B8B8B' },
    ],
    description: 'Ribbed knit beanie with woven label.',
    limited: true,
  },
  // More Clothes
  {
    id: '13',
    name: 'LITXTRA BOMBER JACKET',
    price: 425,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
    category: 'OUTERWEAR',
    subcategory: 'clothes',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Jet Black', hex: '#0a0a0a' },
      { name: 'Olive', hex: '#556B2F' },
      { name: 'Tan', hex: '#D2B48C' },
    ],
    description: 'Classic MA-1 bomber with embroidered back panel.',
    new: true,
  },
  {
    id: '14',
    name: 'VOID GRAPHIC TEE',
    price: 95,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    category: 'TOPS',
    subcategory: 'clothes',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Black', hex: '#0a0a0a' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Grey', hex: '#808080' },
    ],
    description: 'Premium cotton tee with front and back graphic prints.',
  },
];

// Collection categories
export const collections = {
  clothes: products.filter(p => p.subcategory === 'clothes'),
  joggers: products.filter(p => p.subcategory === 'joggers'),
  caps: products.filter(p => p.subcategory === 'caps'),
  all: products,
};

export const useStore = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [discountCode, setDiscountCode] = useState<string>('');
  const [discountApplied, setDiscountApplied] = useState<number>(0);
  const [notifyEmails, setNotifyEmails] = useState<NotifyEmail[]>([]);
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);

  const addToCart = useCallback((product: Product, size: string, color: string) => {
    setCart(prev => {
      const existing = prev.find(
        item => item.id === product.id && item.selectedSize === size && item.selectedColor === color
      );
      if (existing) {
        return prev.map(item =>
          item.id === product.id && item.selectedSize === size && item.selectedColor === color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, selectedSize: size, selectedColor: color }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string, size: string, color: string) => {
    setCart(prev => prev.filter(
      item => !(item.id === productId && item.selectedSize === size && item.selectedColor === color)
    ));
  }, []);

  const updateQuantity = useCallback((productId: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId && item.selectedSize === size && item.selectedColor === color
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    setDiscountCode('');
    setDiscountApplied(0);
  }, []);

  const addToWishlist = useCallback((product: Product) => {
    setWishlist(prev => {
      if (prev.find(item => item.id === product.id)) return prev;
      return [...prev, product];
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlist(prev => prev.filter(item => item.id !== productId));
  }, []);

  const isInWishlist = useCallback((productId: string) => {
    return wishlist.some(item => item.id === productId);
  }, [wishlist]);

  const applyDiscount = useCallback((code: string) => {
    const codes: Record<string, number> = {
      'LITXTRA20': 20,
      'CULTURE10': 10,
      'FIRSTDROP': 15,
      'XTRA15': 15,
      'NEWMEMBER': 25,
    };
    if (codes[code.toUpperCase()]) {
      setDiscountCode(code.toUpperCase());
      setDiscountApplied(codes[code.toUpperCase()]);
      return true;
    }
    return false;
  }, []);

  const addNotifyEmail = useCallback((email: string) => {
    setNotifyEmails(prev => [...prev, { email, timestamp: new Date() }]);
    return true;
  }, []);

  const saveOrderInfo = useCallback((info: OrderInfo) => {
    setOrderInfo(info);
  }, []);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const discountAmount = (cartTotal * discountApplied) / 100;
  const finalTotal = cartTotal - discountAmount;
  const shippingCost = cartTotal > 300 ? 0 : 15;
  const grandTotal = finalTotal + shippingCost;

  return {
    cart,
    wishlist,
    cartTotal,
    cartCount,
    finalTotal,
    grandTotal,
    shippingCost,
    discountCode,
    discountApplied,
    discountAmount,
    notifyEmails,
    orderInfo,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    applyDiscount,
    addNotifyEmail,
    saveOrderInfo,
  };
};
