import { useState, useRef, useEffect, createContext, useContext } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { CustomCursor } from './components/CustomCursor';
import { useStore, products, Product, CartItem, collections } from './store/useStore';

// Social links configuration
const socialLinks = {
  instagram: 'https://instagram.com/litxtra',
  tiktok: 'https://tiktok.com/@litxtra',
  twitter: 'https://twitter.com/litxtra',
  whatsappChannel: 'https://whatsapp.com/channel/litxtra', // WhatsApp Channel for new drop notifications
  whatsappContact: 'https://wa.me/1234567890', // WhatsApp direct contact
};

// ===== SOCIAL MEDIA ICONS =====
const InstagramIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
  </svg>
);

// Store Context
const StoreContext = createContext<ReturnType<typeof useStore> | null>(null);
const useStoreContext = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStoreContext must be used within StoreProvider');
  return context;
};

// Page types
type PageType = 'home' | 'collections' | 'new' | 'archive' | 'about' | 'checkout' | 'order-success';

// ===== HERO SECTION =====
const HeroSection = ({ onShopDrop, onEnterCulture }: { onShopDrop: () => void; onEnterCulture: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section ref={ref} className="relative h-screen overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-void-black/50 to-void-black z-10" />
        <img
          src="https://res.cloudinary.com/drefcs4o2/image/upload/v1772654455/IMG_1705_urmpna.jpg"
          alt="Editorial Fashion"
          className="w-full h-full object-cover"
        />
        {/* Scanline overlay */}
        <div className="absolute inset-0 scanlines opacity-30" />
        {/* Glitch overlay */}
        <div className="absolute inset-0 bg-void-accent/5 mix-blend-overlay animate-pulse" />
      </motion.div>

      {/* Hero Content */}
      <motion.div
        className="relative z-20 flex flex-col items-center justify-center h-full px-4"
        style={{ opacity, y: textY }}
      >
        <motion.p
          className="font-mono text-xs tracking-[0.5em] text-void-accent mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          DROP_001 // NOW LIVE
        </motion.p>

        <motion.h1
          className="glitch-text font-serif text-6xl md:text-9xl font-bold text-center leading-none"
          data-text="LITXTRA"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          LITXTRA
        </motion.h1>

        <motion.p
          className="font-serif text-xl md:text-3xl italic mt-4 text-void-white/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Where Culture Becomes Cloth
        </motion.p>

        <motion.div
          className="mt-12 flex gap-6 flex-wrap justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <button 
            onClick={onShopDrop}
            className="group relative px-8 py-4 bg-void-white text-void-black font-mono text-sm tracking-wider overflow-hidden jitter" 
            data-cursor="pointer"
          >
            <span className="relative z-10">SHOP THE DROP</span>
            <div className="absolute inset-0 bg-void-accent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </button>
          <button 
            onClick={onEnterCulture}
            className="px-8 py-4 border border-void-white/50 text-void-white font-mono text-sm tracking-wider hover:bg-void-white/10 transition-colors" 
            data-cursor="pointer"
          >
            ENTER THE CULTURE
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border border-void-white/50 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-void-white rounded-full mt-2"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
};

// ===== VIDEO SECTION =====
const VideoSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.95, 1, 1, 0.95]);

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      <motion.div 
        className="max-w-6xl mx-auto px-4"
        style={{ opacity, scale }}
      >
        <div className="text-center mb-12">
          <p className="font-mono text-xs tracking-[0.5em] text-void-accent mb-4">THE VISION</p>
          <h2 className="font-serif text-4xl md:text-6xl">
            More than <span className="italic">clothes</span>
          </h2>
        </div>

        {/* Video Container */}
        <motion.div 
          className="relative aspect-video overflow-hidden bg-void-gray"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Video Element - Using a fashion/lifestyle video */}
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80"
          >
            {/* Using a sample video - in production, replace with your brand video */}
            <source 
              src="https://res.cloudinary.com/drefcs4o2/video/upload/v1772656975/3753696-uhd_3840_2160_25fps_pzx3qx.mp4" 
              type="video/mp4" 
            />
            {/* Fallback video */}
            <source 
              src="https://res.cloudinary.com/drefcs4o2/video/upload/v1772500030/8558879-uhd_4096_2160_25fps_xsnkpm.mp4" 
              type="video/mp4" 
            />
            Your browser does not support the video tag.
          </video>

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-void-black/60 via-transparent to-void-black/30 pointer-events-none" />
          
          {/* Scanline effect */}
          <div className="absolute inset-0 scanlines opacity-20 pointer-events-none" />

          {/* Video overlay text */}
          <motion.div 
            className="absolute bottom-8 left-8 right-8 flex justify-between items-end"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <div>
              <p className="font-mono text-xs text-void-accent mb-2">CAMPAIGN 2024</p>
              <h3 className="font-serif text-2xl md:text-3xl">Signal Collection</h3>
            </div>
            <div className="hidden md:block">
              <p className="font-mono text-xs text-void-white/60">00:10 / LOOP</p>
            </div>
          </motion.div>

          {/* Play indicator */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <motion.div 
              className="w-16 h-16 rounded-full border border-void-white/30 flex items-center justify-center"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-void-white/50 border-b-8 border-b-transparent ml-1" />
            </motion.div>
          </div>
        </motion.div>

        {/* Video caption */}
        <motion.p 
          className="text-center mt-8 font-sans text-void-white/50 text-sm max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          Every piece tells a story. Every drop starts a conversation. 
          This is LITXTRA — where culture becomes cloth.
        </motion.p>
      </motion.div>
    </section>
  );
};

// ===== CONCEPT SECTION =====
const ConceptSection = ({ onJoinCommunity }: { onJoinCommunity: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const leftX = useTransform(scrollYProgress, [0, 0.5], ['-100%', '0%']);
  const rightX = useTransform(scrollYProgress, [0, 0.5], ['100%', '0%']);
  const centerScale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const textOpacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);

  return (
    <section ref={ref} className="relative min-h-screen py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <motion.div style={{ opacity: textOpacity }} className="mb-24">
          <p className="font-mono text-xs tracking-[0.5em] text-void-accent mb-4">001 // THE CONCEPT</p>
          <h2 className="font-serif text-5xl md:text-7xl leading-tight">
            Fashion is a<br />
            <span className="italic text-void-accent">cultural</span> conversation.
          </h2>
        </motion.div>

        {/* Collage Grid */}
        <div className="grid grid-cols-12 gap-4 md:gap-8">
          <motion.div
            className="col-span-12 md:col-span-5 relative"
            style={{ x: leftX }}
          >
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80"
                alt="Editorial"
                className="w-full h-full object-cover distort-hover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 glass px-6 py-4">
              <p className="font-mono text-xs text-void-accent">COMMUNITY-LED</p>
              <p className="font-serif text-lg mt-1">Built by the culture</p>
            </div>
          </motion.div>

          <motion.div
            className="col-span-12 md:col-span-7 flex flex-col justify-center"
            style={{ scale: centerScale }}
          >
            <div className="space-y-8 pl-0 md:pl-16">
              <p className="font-sans text-lg md:text-xl text-void-white/70 leading-relaxed">
                LITXTRA exists at the intersection of high fashion and street culture. 
                We don't follow trends — we create movements. Each piece is a statement, 
                a disruption, a signal to those who understand.
              </p>
              <p className="font-sans text-lg md:text-xl text-void-white/70 leading-relaxed">
                Our collections are born from late-night conversations, underground scenes, 
                and the raw energy of a generation refusing to be defined.
              </p>
              <div className="flex gap-4 flex-wrap">
                {['DISRUPTION', 'IDENTITY', 'CULTURE', 'XTRA'].map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 border border-void-white/30 font-mono text-xs tracking-wider hover:bg-void-white hover:text-void-black transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="col-span-6 md:col-span-4 mt-8"
            style={{ x: leftX }}
          >
            <div className="aspect-square overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80"
                alt="Style"
                className="w-full h-full object-cover distort-hover"
              />
            </div>
          </motion.div>

          <motion.div
            className="col-span-6 md:col-span-4 mt-16"
            style={{ x: rightX }}
          >
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80"
                alt="Expression"
                className="w-full h-full object-cover distort-hover"
              />
            </div>
          </motion.div>

          <motion.div
            className="col-span-12 md:col-span-4 flex items-end mt-8"
          >
            <div className="glass p-8 w-full">
              <p className="font-mono text-6xl font-bold text-void-accent">47K</p>
              <p className="font-sans text-sm text-void-white/60 mt-2">Community Members</p>
              <div className="mt-4 flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-void-gray-light border-2 border-void-black" />
                ))}
                <button 
                  onClick={onJoinCommunity}
                  className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center text-xs font-mono hover:scale-110 transition-transform"
                  data-cursor="pointer"
                  title="Join WhatsApp Channel"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ===== PRODUCT CARD =====
const ProductCard = ({ product, onQuickAdd }: { product: Product; onQuickAdd: (product: Product) => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useStoreContext();
  const inWishlist = isInWishlist(product.id);

  return (
    <motion.div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Product Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-void-gray">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          animate={{
            scale: isHovered ? 1.05 : 1,
            filter: isHovered ? 'saturate(1.2) contrast(1.1)' : 'saturate(1) contrast(1)',
          }}
          transition={{ duration: 0.4 }}
        />
        
        {/* Glitch overlay on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute inset-0 bg-void-accent/10 mix-blend-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.5, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>

        {/* Tags */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.new && (
            <span className="px-2 py-1 bg-void-accent text-void-black font-mono text-[10px] tracking-wider">
              NEW
            </span>
          )}
          {product.limited && (
            <span className="px-2 py-1 bg-void-white text-void-black font-mono text-[10px] tracking-wider">
              LIMITED
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => inWishlist ? removeFromWishlist(product.id) : addToWishlist(product)}
          className="absolute top-4 right-4 w-10 h-10 glass rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          data-cursor="pointer"
        >
          <svg
            className={`w-5 h-5 ${inWishlist ? 'fill-void-accent text-void-accent' : 'text-void-white'}`}
            fill={inWishlist ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Quick Add Button */}
        <motion.button
          className="absolute bottom-4 left-4 right-4 py-3 bg-void-white text-void-black font-mono text-xs tracking-wider opacity-0 group-hover:opacity-100 transition-opacity jitter"
          onClick={() => onQuickAdd(product)}
          whileTap={{ scale: 0.95 }}
          data-cursor="pointer"
        >
          QUICK ADD +
        </motion.button>
      </div>

      {/* Product Info */}
      <div className="mt-4 space-y-2">
        <p className="font-mono text-[10px] text-void-muted tracking-wider">{product.category}</p>
        <h3 className="font-sans text-sm font-medium tracking-wide">{product.name}</h3>
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm">${product.price}</span>
          {product.originalPrice && (
            <span className="font-mono text-sm text-void-muted line-through">${product.originalPrice}</span>
          )}
        </div>
        
        {/* Color Swatches - Now showing all colors */}
        <div className="flex gap-2 mt-2 flex-wrap">
          {product.colors.slice(0, 6).map((color, index) => (
            <button
              key={color.name}
              className={`w-5 h-5 rounded-full border-2 transition-all ${
                selectedColor === index ? 'border-void-white scale-125' : 'border-void-gray-light hover:border-void-white/50'
              }`}
              style={{ backgroundColor: color.hex }}
              onClick={() => setSelectedColor(index)}
              title={color.name}
              data-cursor="pointer"
            />
          ))}
          {product.colors.length > 6 && (
            <span className="text-xs text-void-muted font-mono self-center">+{product.colors.length - 6}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ===== FEATURED DROP SECTION =====
const FeaturedDropSection = ({ onQuickAdd }: { onQuickAdd: (product: Product) => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const headerY = useTransform(scrollYProgress, [0, 0.3], [100, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <section ref={ref} id="featured-drop" className="relative py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 text-[20vw] font-serif font-bold text-void-gray-light/10 leading-none"
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, 100]) }}
        >
          DROP
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div className="mb-16" style={{ y: headerY, opacity: headerOpacity }}>
          <p className="font-mono text-xs tracking-[0.5em] text-void-accent mb-4">002 // FEATURED DROP</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2 className="font-serif text-5xl md:text-7xl">
              The <span className="italic">Signal</span> Collection
            </h2>
            <button className="animated-underline font-mono text-sm tracking-wider text-void-white/70 hover:text-void-white transition-colors" data-cursor="pointer">
              VIEW ALL →
            </button>
          </div>
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {products.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} onQuickAdd={onQuickAdd} />
          ))}
        </div>
      </div>
    </section>
  );
};

// ===== COMMUNITY SECTION - CLEANED UP =====
const lookbookImages = [
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
  'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80',
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80',
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80',
  'https://images.unsplash.com/photo-1485968579169-a6b577d30057?w=600&q=80',
];

const CommunitySection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <section className="relative py-32 overflow-hidden bg-void-gray">
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <p className="font-mono text-xs tracking-[0.5em] text-void-accent mb-4">003 // COMMUNITY</p>
        <h2 className="font-serif text-5xl md:text-7xl">
          Worn by the <span className="italic text-void-accent">culture</span>
        </h2>
      </div>

      {/* Draggable Lookbook - Clean, no overlays */}
      <div className="mt-12">
        <p className="font-mono text-xs text-center text-void-muted/50 mb-6 tracking-widest">← DRAG TO EXPLORE →</p>
        <div
          ref={scrollRef}
          className="horizontal-scroll flex gap-6 px-4 pb-8 cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {lookbookImages.map((img, index) => (
            <motion.div
              key={index}
              className="flex-shrink-0 w-[300px] md:w-[400px] aspect-[3/4] overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={img}
                alt={`Lookbook ${index + 1}`}
                className="w-full h-full object-cover pointer-events-none"
                draggable={false}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Testimonials Section - Clean Layout Below Gallery */}
      <div className="max-w-7xl mx-auto px-4 mt-24">
        <h3 className="font-mono text-xs tracking-[0.5em] text-void-accent mb-8">WHAT THEY'RE SAYING</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Alex M.', text: 'The quality is unmatched. Every piece feels like an investment.', role: 'Creative Director' },
            { name: 'Jordan K.', text: 'Finally a brand that understands street culture meets high fashion.', role: 'Photographer' },
            { name: 'Sam T.', text: 'Copped the jacket - best purchase of the year, no cap.', role: 'Artist' },
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              className="border-l border-void-white/20 pl-6 py-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <p className="font-sans text-lg text-void-white/80 mb-4 italic">"{testimonial.text}"</p>
              <p className="font-mono text-sm text-void-accent">{testimonial.name}</p>
              <p className="font-mono text-xs text-void-muted">{testimonial.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ===== COUNTDOWN SECTION =====
const CountdownSection = ({ onNotify }: { onNotify: (email: string) => void }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 14,
    minutes: 27,
    seconds: 45,
  });
  const [email, setEmail] = useState('');
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
          if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) {
              hours = 23;
              days--;
              if (days < 0) {
                return { days: 0, hours: 0, minutes: 0, seconds: 0 };
              }
            }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleNotify = () => {
    if (email && email.includes('@')) {
      onNotify(email);
      setNotified(true);
      setEmail('');
      setTimeout(() => setNotified(false), 3000);
    }
  };

  const timeBlocks = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HRS', value: timeLeft.hours },
    { label: 'MIN', value: timeLeft.minutes },
    { label: 'SEC', value: timeLeft.seconds },
  ];

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80"
          alt="Next Drop"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-void-black via-void-black/80 to-void-black" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.p
          className="font-mono text-xs tracking-[0.5em] text-void-accent mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          004 // NEXT DROP
        </motion.p>

        <motion.h2
          className="font-serif text-5xl md:text-8xl mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="italic">Lit</span> Protocol
        </motion.h2>

        <motion.p
          className="font-sans text-lg text-void-white/60 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Limited to 100 pieces worldwide. No restocks. Ever.
        </motion.p>

        {/* Countdown Timer */}
        <motion.div
          className="flex justify-center gap-4 md:gap-8 mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {timeBlocks.map((block) => (
            <div key={block.label} className="pulse-glow glass p-4 md:p-6 rounded-lg min-w-[70px] md:min-w-[100px]">
              <motion.p
                className="font-mono text-3xl md:text-5xl font-bold text-void-accent"
                key={block.value}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {String(block.value).padStart(2, '0')}
              </motion.p>
              <p className="font-mono text-[10px] text-void-muted mt-2">{block.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Notification Form */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 px-6 py-4 bg-void-gray border border-void-white/20 font-mono text-sm focus:outline-none focus:border-void-accent transition-colors"
          />
          <button 
            onClick={handleNotify}
            className={`px-8 py-4 font-mono text-sm tracking-wider transition-colors jitter ${
              notified 
                ? 'bg-green-500 text-void-black' 
                : 'bg-void-accent text-void-black hover:bg-void-white'
            }`} 
            data-cursor="pointer"
          >
            {notified ? '✓ NOTIFIED!' : 'NOTIFY ME'}
          </button>
        </motion.div>
      </div>
    </section>
  );
};

// ===== COLLECTIONS PAGE =====
const CollectionsPage = ({ 
  onQuickAdd, 
  onBack 
}: { 
  onQuickAdd: (product: Product) => void;
  onBack: () => void;
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'clothes' | 'joggers' | 'caps'>('all');
  
  const filteredProducts = activeCategory === 'all' ? collections.all : collections[activeCategory];

  return (
    <section className="min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <button 
            onClick={onBack}
            className="font-mono text-sm text-void-muted hover:text-void-white mb-6 flex items-center gap-2 transition-colors"
            data-cursor="pointer"
          >
            ← BACK TO HOME
          </button>
          <motion.h1 
            className="font-serif text-5xl md:text-7xl mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            The <span className="italic text-void-accent">Culture</span> Collection
          </motion.h1>
          <motion.p 
            className="font-sans text-lg text-void-white/60 max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Explore our full range of culture-driven pieces. From statement outerwear to essential joggers and signature caps.
          </motion.p>
        </div>

        {/* Category Filters */}
        <motion.div 
          className="flex gap-4 flex-wrap mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {[
            { key: 'all', label: 'ALL PIECES' },
            { key: 'clothes', label: 'CLOTHES' },
            { key: 'joggers', label: 'JOGGERS' },
            { key: 'caps', label: 'CAPS & HATS' },
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key as typeof activeCategory)}
              className={`px-6 py-3 font-mono text-sm tracking-wider border transition-all ${
                activeCategory === cat.key
                  ? 'bg-void-white text-void-black border-void-white'
                  : 'border-void-white/30 hover:border-void-white'
              }`}
              data-cursor="pointer"
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Products Grid */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onQuickAdd={onQuickAdd} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ===== CHECKOUT PAGE =====
type PaymentMethod = 'card' | 'paypal' | 'crypto' | 'paystack';

const CheckoutPage = ({ onBack, onSuccess }: { onBack: () => void; onSuccess: () => void }) => {
  const { cart, cartTotal, discountCode, discountApplied, discountAmount, shippingCost, grandTotal, applyDiscount, clearCart } = useStoreContext();
  const [step, setStep] = useState<'info' | 'payment'>('info');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState('');
  const [processing, setProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
    phone: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cryptoWallet: '',
  });

  const handleApplyCode = () => {
    const success = applyDiscount(codeInput);
    if (!success) {
      setCodeError('Invalid discount code');
    } else {
      setCodeError('');
      setCodeInput('');
    }
  };

  const handlePayment = async () => {
    setProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setProcessing(false);
    clearCart();
    onSuccess();
  };

  if (cart.length === 0) {
    return (
      <section className="min-h-screen pt-24 pb-32 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-3xl mb-4">Your cart is empty</h2>
          <button
            onClick={onBack}
            className="px-8 py-4 bg-void-white text-void-black font-mono text-sm tracking-wider hover:bg-void-accent transition-colors"
            data-cursor="pointer"
          >
            CONTINUE SHOPPING
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen pt-24 pb-32">
      <div className="max-w-6xl mx-auto px-4">
        <button 
          onClick={onBack}
          className="font-mono text-sm text-void-muted hover:text-void-white mb-6 flex items-center gap-2 transition-colors"
          data-cursor="pointer"
        >
          ← BACK TO SHOPPING
        </button>

        <motion.h1 
          className="font-serif text-4xl md:text-6xl mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Checkout
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Step Indicator */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => setStep('info')}
                className={`font-mono text-sm ${step === 'info' ? 'text-void-accent' : 'text-void-muted'}`}
              >
                1. INFORMATION
              </button>
              <span className="text-void-muted">/</span>
              <button
                onClick={() => step === 'payment' && setStep('payment')}
                className={`font-mono text-sm ${step === 'payment' ? 'text-void-accent' : 'text-void-muted'}`}
              >
                2. PAYMENT
              </button>
            </div>

            {step === 'info' ? (
              <div className="space-y-6">
                <h3 className="font-mono text-xs tracking-wider text-void-accent mb-4">CONTACT INFORMATION</h3>
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-void-gray border border-void-white/20 font-sans text-sm focus:outline-none focus:border-void-accent transition-colors"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-void-gray border border-void-white/20 font-sans text-sm focus:outline-none focus:border-void-accent transition-colors"
                />

                <h3 className="font-mono text-xs tracking-wider text-void-accent mb-4 mt-8">SHIPPING ADDRESS</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="px-4 py-3 bg-void-gray border border-void-white/20 font-sans text-sm focus:outline-none focus:border-void-accent transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="px-4 py-3 bg-void-gray border border-void-white/20 font-sans text-sm focus:outline-none focus:border-void-accent transition-colors"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 bg-void-gray border border-void-white/20 font-sans text-sm focus:outline-none focus:border-void-accent transition-colors"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="px-4 py-3 bg-void-gray border border-void-white/20 font-sans text-sm focus:outline-none focus:border-void-accent transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="ZIP Code"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    className="px-4 py-3 bg-void-gray border border-void-white/20 font-sans text-sm focus:outline-none focus:border-void-accent transition-colors"
                  />
                </div>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-4 py-3 bg-void-gray border border-void-white/20 font-sans text-sm focus:outline-none focus:border-void-accent transition-colors"
                >
                  <option value="">Select Country</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="NG">Nigeria</option>
                  <option value="GH">Ghana</option>
                  <option value="ZA">South Africa</option>
                </select>

                <button
                  onClick={() => setStep('payment')}
                  className="w-full py-4 bg-void-white text-void-black font-mono text-sm tracking-wider hover:bg-void-accent transition-colors mt-8"
                  data-cursor="pointer"
                >
                  CONTINUE TO PAYMENT
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="font-mono text-xs tracking-wider text-void-accent mb-4">SELECT PAYMENT METHOD</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: 'card', label: 'Credit Card', icon: '💳' },
                    { key: 'paypal', label: 'PayPal', icon: '🅿️' },
                    { key: 'crypto', label: 'Crypto', icon: '₿' },
                    { key: 'paystack', label: 'Paystack', icon: '💰' },
                  ].map((method) => (
                    <button
                      key={method.key}
                      onClick={() => setPaymentMethod(method.key as PaymentMethod)}
                      className={`p-4 border font-mono text-sm flex items-center gap-3 transition-all ${
                        paymentMethod === method.key
                          ? 'border-void-accent bg-void-accent/10'
                          : 'border-void-white/20 hover:border-void-white/50'
                      }`}
                      data-cursor="pointer"
                    >
                      <span className="text-2xl">{method.icon}</span>
                      <span>{method.label}</span>
                    </button>
                  ))}
                </div>

                {/* Payment Details */}
                <div className="mt-8 space-y-4">
                  {paymentMethod === 'card' && (
                    <>
                      <input
                        type="text"
                        placeholder="Card Number"
                        value={formData.cardNumber}
                        onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                        className="w-full px-4 py-3 bg-void-gray border border-void-white/20 font-mono text-sm focus:outline-none focus:border-void-accent transition-colors"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={formData.cardExpiry}
                          onChange={(e) => setFormData({ ...formData, cardExpiry: e.target.value })}
                          className="px-4 py-3 bg-void-gray border border-void-white/20 font-mono text-sm focus:outline-none focus:border-void-accent transition-colors"
                        />
                        <input
                          type="text"
                          placeholder="CVC"
                          value={formData.cardCvc}
                          onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
                          className="px-4 py-3 bg-void-gray border border-void-white/20 font-mono text-sm focus:outline-none focus:border-void-accent transition-colors"
                        />
                      </div>
                    </>
                  )}

                  {paymentMethod === 'paypal' && (
                    <div className="p-8 border border-void-white/20 text-center">
                      <p className="font-sans text-void-white/60 mb-4">You will be redirected to PayPal to complete your purchase</p>
                      <div className="text-4xl">🅿️</div>
                    </div>
                  )}

                  {paymentMethod === 'crypto' && (
                    <div className="space-y-4">
                      <div className="p-4 border border-void-white/20">
                        <p className="font-mono text-xs text-void-muted mb-2">SUPPORTED CURRENCIES</p>
                        <div className="flex gap-4">
                          <span className="px-3 py-1 bg-void-gray-light font-mono text-sm">BTC</span>
                          <span className="px-3 py-1 bg-void-gray-light font-mono text-sm">ETH</span>
                          <span className="px-3 py-1 bg-void-gray-light font-mono text-sm">USDT</span>
                          <span className="px-3 py-1 bg-void-gray-light font-mono text-sm">SOL</span>
                        </div>
                      </div>
                      <input
                        type="text"
                        placeholder="Your Wallet Address (for refunds)"
                        value={formData.cryptoWallet}
                        onChange={(e) => setFormData({ ...formData, cryptoWallet: e.target.value })}
                        className="w-full px-4 py-3 bg-void-gray border border-void-white/20 font-mono text-sm focus:outline-none focus:border-void-accent transition-colors"
                      />
                    </div>
                  )}

                  {paymentMethod === 'paystack' && (
                    <div className="p-8 border border-void-white/20 text-center">
                      <p className="font-sans text-void-white/60 mb-4">Pay with Paystack - Supports Nigerian banks, cards, and mobile money</p>
                      <div className="text-4xl">💰</div>
                      <p className="font-mono text-xs text-void-muted mt-4">Secure payment powered by Paystack</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setStep('info')}
                    className="px-8 py-4 border border-void-white/30 font-mono text-sm tracking-wider hover:bg-void-white/10 transition-colors"
                    data-cursor="pointer"
                  >
                    BACK
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={processing}
                    className={`flex-1 py-4 font-mono text-sm tracking-wider transition-colors ${
                      processing
                        ? 'bg-void-gray text-void-muted cursor-wait'
                        : 'bg-void-accent text-void-black hover:bg-void-white'
                    }`}
                    data-cursor="pointer"
                  >
                    {processing ? 'PROCESSING...' : `PAY $${grandTotal.toFixed(2)}`}
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Right Column - Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:pl-8 lg:border-l border-void-white/10"
          >
            <h3 className="font-mono text-xs tracking-wider text-void-accent mb-6">ORDER SUMMARY</h3>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {cart.map((item) => (
                <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-4">
                  <div className="w-20 h-24 bg-void-gray-light overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-sans text-sm font-medium">{item.name}</h4>
                    <p className="font-mono text-xs text-void-muted mt-1">
                      {item.selectedSize} / {item.selectedColor}
                    </p>
                    <p className="font-mono text-xs text-void-muted">Qty: {item.quantity}</p>
                    <p className="font-mono text-sm mt-2">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Discount Code */}
            <div className="mt-8 pt-6 border-t border-void-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  placeholder="Discount code"
                  className="flex-1 px-4 py-2 bg-void-gray border border-void-white/20 font-mono text-sm focus:outline-none focus:border-void-accent"
                />
                <button
                  onClick={handleApplyCode}
                  className="px-4 py-2 border border-void-white/30 font-mono text-xs hover:bg-void-white hover:text-void-black transition-colors"
                  data-cursor="pointer"
                >
                  APPLY
                </button>
              </div>
              {codeError && <p className="font-mono text-xs text-red-500 mt-2">{codeError}</p>}
              {discountCode && (
                <p className="font-mono text-xs text-green-500 mt-2">
                  {discountCode} applied: {discountApplied}% off
                </p>
              )}
            </div>

            {/* Totals */}
            <div className="mt-6 space-y-3">
              <div className="flex justify-between font-mono text-sm">
                <span className="text-void-muted">Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between font-mono text-sm text-green-500">
                  <span>Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-mono text-sm">
                <span className="text-void-muted">Shipping</span>
                <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-mono text-lg pt-3 border-t border-void-white/10">
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {cartTotal < 300 && (
              <p className="font-mono text-xs text-void-muted mt-4">
                Add ${(300 - cartTotal).toFixed(2)} more for FREE shipping
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ===== ORDER SUCCESS PAGE =====
const OrderSuccessPage = ({ onBack }: { onBack: () => void }) => {
  const orderNumber = `LX${Date.now().toString().slice(-8)}`;

  return (
    <section className="min-h-screen pt-24 pb-32 flex items-center justify-center">
      <motion.div 
        className="text-center max-w-lg mx-auto px-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="w-24 h-24 mx-auto mb-8 rounded-full bg-void-accent flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
        >
          <svg className="w-12 h-12 text-void-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>

        <h1 className="font-serif text-4xl md:text-5xl mb-4">Order Confirmed</h1>
        <p className="font-sans text-void-white/60 mb-8">
          Thank you for joining the culture. Your order is being prepared with care.
        </p>

        <div className="glass p-6 mb-8">
          <p className="font-mono text-xs text-void-muted mb-2">ORDER NUMBER</p>
          <p className="font-mono text-2xl text-void-accent">{orderNumber}</p>
        </div>

        <p className="font-sans text-sm text-void-white/60 mb-8">
          You'll receive a confirmation email with tracking information shortly.
        </p>

        <button
          onClick={onBack}
          className="px-8 py-4 bg-void-white text-void-black font-mono text-sm tracking-wider hover:bg-void-accent transition-colors"
          data-cursor="pointer"
        >
          CONTINUE SHOPPING
        </button>
      </motion.div>
    </section>
  );
};

// ===== NEW ARRIVALS PAGE =====
const NewArrivalsPage = ({ 
  onQuickAdd, 
  onBack 
}: { 
  onQuickAdd: (product: Product) => void;
  onBack: () => void;
}) => {
  // Filter only new products
  const newProducts = collections.all.filter(p => p.new);

  return (
    <section className="min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <button 
            onClick={onBack}
            className="font-mono text-sm text-void-muted hover:text-void-white mb-6 flex items-center gap-2 transition-colors"
            data-cursor="pointer"
          >
            ← BACK TO HOME
          </button>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="font-mono text-xs tracking-[0.5em] text-void-accent mb-4">FRESH DROPS</p>
            <h1 className="font-serif text-5xl md:text-7xl mb-4">
              New <span className="italic text-void-accent">Arrivals</span>
            </h1>
            <p className="font-sans text-lg text-void-white/60 max-w-2xl">
              The latest additions to our culture-driven collection. Fresh off the design floor, ready to make a statement.
            </p>
          </motion.div>
        </div>

        {/* Featured New Drop Banner */}
        <motion.div 
          className="relative mb-16 overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="aspect-[21/9] md:aspect-[3/1] relative">
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80"
              alt="New Collection"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-void-black via-void-black/50 to-transparent" />
            <div className="absolute inset-0 flex items-center p-8 md:p-16">
              <div>
                <p className="font-mono text-xs text-void-accent mb-2">DROP_002</p>
                <h2 className="font-serif text-3xl md:text-5xl mb-4">Signal Collection</h2>
                <p className="font-sans text-void-white/70 max-w-md mb-6">
                  Disruption meets design. Limited quantities, unlimited impact.
                </p>
                <button 
                  className="px-6 py-3 bg-void-white text-void-black font-mono text-sm tracking-wider hover:bg-void-accent transition-colors"
                  data-cursor="pointer"
                >
                  EXPLORE NOW
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* New Products Grid */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {newProducts.length > 0 ? (
            newProducts.map((product) => (
              <ProductCard key={product.id} product={product} onQuickAdd={onQuickAdd} />
            ))
          ) : (
            collections.all.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} onQuickAdd={onQuickAdd} />
            ))
          )}
        </motion.div>

        {/* Coming Soon Section */}
        <motion.div 
          className="mt-24 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <p className="font-mono text-xs tracking-[0.5em] text-void-accent mb-4">COMING SOON</p>
          <h3 className="font-serif text-3xl md:text-4xl mb-4">More drops loading...</h3>
          <p className="font-sans text-void-white/60 mb-8">
            Sign up to be the first to know when new pieces drop.
          </p>
          <div className="flex justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-6 py-3 bg-void-gray border border-void-white/20 font-mono text-sm focus:outline-none focus:border-void-accent"
            />
            <button className="px-6 py-3 bg-void-accent text-void-black font-mono text-sm tracking-wider hover:bg-void-white transition-colors" data-cursor="pointer">
              NOTIFY ME
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ===== ARCHIVE PAGE =====
const ArchivePage = ({ 
  onQuickAdd, 
  onBack 
}: { 
  onQuickAdd: (product: Product) => void;
  onBack: () => void;
}) => {
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  
  const seasons = [
    { key: 'all', label: 'ALL ARCHIVES', year: '' },
    { key: 'fw24', label: 'FW24', year: '2024' },
    { key: 'ss24', label: 'SS24', year: '2024' },
    { key: 'fw23', label: 'FW23', year: '2023' },
    { key: 'ss23', label: 'SS23', year: '2023' },
  ];

  // For demo, using all products
  const archiveProducts = collections.all;

  return (
    <section className="min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <button 
            onClick={onBack}
            className="font-mono text-sm text-void-muted hover:text-void-white mb-6 flex items-center gap-2 transition-colors"
            data-cursor="pointer"
          >
            ← BACK TO HOME
          </button>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="font-mono text-xs tracking-[0.5em] text-void-accent mb-4">PAST COLLECTIONS</p>
            <h1 className="font-serif text-5xl md:text-7xl mb-4">
              The <span className="italic text-void-accent">Archive</span>
            </h1>
            <p className="font-sans text-lg text-void-white/60 max-w-2xl">
              Explore our journey through past collections. Some pieces are gone forever, but the culture remains.
            </p>
          </motion.div>
        </div>

        {/* Season Timeline */}
        <motion.div 
          className="mb-12 overflow-x-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex gap-4 pb-4">
            {seasons.map((season) => (
              <button
                key={season.key}
                onClick={() => setSelectedSeason(season.key)}
                className={`px-6 py-3 font-mono text-sm tracking-wider border whitespace-nowrap transition-all ${
                  selectedSeason === season.key
                    ? 'bg-void-white text-void-black border-void-white'
                    : 'border-void-white/30 hover:border-void-white'
                }`}
                data-cursor="pointer"
              >
                {season.label}
                {season.year && <span className="ml-2 text-xs opacity-60">{season.year}</span>}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Archive Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Featured Archive Piece */}
          <motion.div 
            className="aspect-[3/4] relative group overflow-hidden"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80"
              alt="Archive Feature"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void-black via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <p className="font-mono text-xs text-void-accent mb-2">FW24 // SOLD OUT</p>
              <h3 className="font-serif text-2xl md:text-3xl mb-2">Signal Overcoat</h3>
              <p className="font-sans text-void-white/60 text-sm">Limited to 50 pieces worldwide</p>
            </div>
          </motion.div>

          {/* Archive Story */}
          <motion.div 
            className="flex flex-col justify-center"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p className="font-mono text-xs tracking-[0.5em] text-void-accent mb-4">THE STORY</p>
            <h2 className="font-serif text-3xl md:text-4xl mb-6">
              Every piece tells a story of disruption and identity.
            </h2>
            <p className="font-sans text-void-white/60 mb-6 leading-relaxed">
              Our archive represents the evolution of LITXTRA — from underground beginnings to cultural phenomenon. 
              Each collection was designed to challenge norms and celebrate authenticity.
            </p>
            <p className="font-sans text-void-white/60 mb-8 leading-relaxed">
              While many pieces are no longer available, they live on through the community who wears them. 
              The archive is not just about clothes — it's about moments, movements, and memories.
            </p>
            <div className="flex gap-8">
              <div>
                <p className="font-mono text-3xl text-void-accent">12</p>
                <p className="font-mono text-xs text-void-muted mt-1">COLLECTIONS</p>
              </div>
              <div>
                <p className="font-mono text-3xl text-void-accent">150+</p>
                <p className="font-mono text-xs text-void-muted mt-1">PIECES</p>
              </div>
              <div>
                <p className="font-mono text-3xl text-void-accent">47K</p>
                <p className="font-mono text-xs text-void-muted mt-1">COMMUNITY</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Archive Products */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="font-mono text-xs tracking-[0.5em] text-void-accent mb-8">AVAILABLE ARCHIVE PIECES</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {archiveProducts.map((product) => (
              <ProductCard key={product.id} product={product} onQuickAdd={onQuickAdd} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ===== ABOUT PAGE =====
const AboutPage = ({ onBack }: { onBack: () => void }) => {
  return (
    <section className="min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-16">
          <button 
            onClick={onBack}
            className="font-mono text-sm text-void-muted hover:text-void-white mb-6 flex items-center gap-2 transition-colors"
            data-cursor="pointer"
          >
            ← BACK TO HOME
          </button>
        </div>

        {/* Hero */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div>
            <p className="font-mono text-xs tracking-[0.5em] text-void-accent mb-4">ABOUT</p>
            <h1 className="font-serif text-5xl md:text-7xl mb-8">
              We are <span className="italic text-void-accent">LITXTRA</span>
            </h1>
            <p className="font-sans text-xl text-void-white/70 leading-relaxed mb-8">
              Born from late-night conversations and underground scenes. We exist at the intersection of 
              high fashion and street culture, creating pieces for those who refuse to be defined.
            </p>
            <p className="font-sans text-lg text-void-white/60 leading-relaxed">
              LITXTRA is more than a brand — it's a signal. A way for the culture to recognize itself. 
              We don't follow trends. We don't chase algorithms. We create for the community that raised us.
            </p>
          </div>
          <motion.div 
            className="aspect-square overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <img
              src="https://res.cloudinary.com/drefcs4o2/image/upload/v1772657745/IMG_1716_b4axfz.jpg"
              alt="LITXTRA Culture"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </motion.div>

        {/* Values */}
        <motion.div 
          className="mb-24"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className="font-mono text-xs tracking-[0.5em] text-void-accent mb-8">OUR VALUES</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Culture First',
                description: 'Every piece is born from genuine cultural moments. We create for the community, not the market.',
              },
              {
                title: 'Quality Over Quantity',
                description: 'Limited drops mean limited pieces. We prioritize craftsmanship over mass production.',
              },
              {
                title: 'Community Led',
                description: 'Our community shapes our direction. The culture speaks, and we listen.',
              },
            ].map((value, index) => (
              <div key={value.title} className="border-l border-void-white/20 pl-6 py-4">
                <span className="font-mono text-xs text-void-accent">0{index + 1}</span>
                <h3 className="font-serif text-2xl mt-2 mb-4">{value.title}</h3>
                <p className="font-sans text-void-white/60">{value.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Team / Studio */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src="https://res.cloudinary.com/drefcs4o2/image/upload/v1772657736/IMG_1776_rykbwu.jpg"
              alt="LITXTRA Studio"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <p className="font-mono text-xs tracking-[0.5em] text-void-accent mb-4">THE STUDIO</p>
            <h2 className="font-serif text-3xl md:text-4xl mb-6">Based in the culture, distributed globally.</h2>
            <p className="font-sans text-void-white/60 mb-6 leading-relaxed">
              Our studio operates at the speed of culture. From concept to creation, every piece goes through 
              rigorous design and quality processes. We work with select manufacturers who share our values.
            </p>
            <p className="font-sans text-void-white/60 leading-relaxed">
              Sustainability isn't a marketing term for us — it's how we operate. Limited quantities mean 
              less waste. Quality materials mean longer life. We're building for the future.
            </p>
          </div>
        </motion.div>

        {/* Connect */}
        <motion.div 
          className="text-center glass p-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <p className="font-mono text-xs tracking-[0.5em] text-void-accent mb-4">CONNECT</p>
          <h2 className="font-serif text-3xl md:text-4xl mb-6">Join the culture</h2>
          <p className="font-sans text-void-white/60 mb-8 max-w-xl mx-auto">
            Follow our journey. Join the community. Be part of something that matters.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a 
              href={socialLinks.instagram} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-3 px-6 py-4 border border-void-white/30 font-mono text-sm tracking-wider hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-500 hover:to-orange-400 hover:border-transparent hover:text-white transition-all duration-300"
              data-cursor="pointer"
            >
              <InstagramIcon />
              INSTAGRAM
            </a>
            <a 
              href={socialLinks.tiktok} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-3 px-6 py-4 border border-void-white/30 font-mono text-sm tracking-wider hover:bg-void-black hover:border-void-white transition-all duration-300"
              data-cursor="pointer"
            >
              <TikTokIcon />
              TIKTOK
            </a>
            <a 
              href={socialLinks.twitter} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-3 px-6 py-4 border border-void-white/30 font-mono text-sm tracking-wider hover:bg-void-black hover:border-void-white transition-all duration-300"
              data-cursor="pointer"
            >
              <TwitterIcon />
              X / TWITTER
            </a>
            <a 
              href={socialLinks.whatsappChannel} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-3 px-6 py-4 bg-[#25D366] text-white font-mono text-sm tracking-wider hover:bg-[#128C7E] transition-all duration-300"
              data-cursor="pointer"
            >
              <WhatsAppIcon />
              JOIN CHANNEL
            </a>
            <a 
              href={socialLinks.whatsappContact} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-3 px-6 py-4 border border-void-white/30 font-mono text-sm tracking-wider hover:bg-[#25D366] hover:border-transparent hover:text-white transition-all duration-300"
              data-cursor="pointer"
            >
              <PhoneIcon />
              CONTACT US
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Social links and icons are defined at the top of the file

// ===== FOOTER =====
const Footer = () => {
  return (
    <footer className="relative py-24 border-t border-void-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="font-serif text-4xl mb-4">LITXTRA</h3>
            <p className="font-sans text-void-white/60 max-w-md mb-6">
              Culture-driven, community-led fashion for a generation that refuses to be defined.
            </p>
            {/* Social Media Buttons with Icons */}
            <div className="flex gap-3">
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full border border-void-white/30 flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-500 hover:to-orange-400 hover:border-transparent hover:text-white transition-all duration-300 group"
                data-cursor="pointer"
                title="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href={socialLinks.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full border border-void-white/30 flex items-center justify-center hover:bg-void-black hover:border-void-white hover:text-white transition-all duration-300"
                data-cursor="pointer"
                title="TikTok"
              >
                <TikTokIcon />
              </a>
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full border border-void-white/30 flex items-center justify-center hover:bg-void-black hover:border-void-white hover:text-white transition-all duration-300"
                data-cursor="pointer"
                title="X (Twitter)"
              >
                <TwitterIcon />
              </a>
              <a
                href={socialLinks.whatsappChannel}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full border border-void-white/30 flex items-center justify-center hover:bg-[#25D366] hover:border-transparent hover:text-white transition-all duration-300"
                data-cursor="pointer"
                title="WhatsApp Channel - New Drop Alerts"
              >
                <WhatsAppIcon />
              </a>
              <a
                href={socialLinks.whatsappContact}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full border border-void-white/30 flex items-center justify-center hover:bg-[#25D366] hover:border-transparent hover:text-white transition-all duration-300"
                data-cursor="pointer"
                title="Contact Us on WhatsApp"
              >
                <PhoneIcon />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-mono text-xs tracking-wider mb-6 text-void-accent">SHOP</h4>
            <ul className="space-y-3">
              {['New Arrivals', 'Collections', 'Outerwear', 'Tops', 'Bottoms', 'Accessories'].map((link) => (
                <li key={link}>
                  <a href="#" className="font-sans text-sm text-void-white/60 hover:text-void-white animated-underline" data-cursor="pointer">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs tracking-wider mb-6 text-void-accent">INFO</h4>
            <ul className="space-y-3">
              {['About', 'Contact', 'Shipping', 'Returns', 'Size Guide', 'FAQ'].map((link) => (
                <li key={link}>
                  <a href="#" className="font-sans text-sm text-void-white/60 hover:text-void-white animated-underline" data-cursor="pointer">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-void-white/10 pt-12 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h4 className="font-serif text-2xl mb-2">Join the culture</h4>
              <p className="font-sans text-sm text-void-white/60">Early access. Exclusive drops. No spam.</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 md:w-64 px-6 py-3 bg-transparent border border-void-white/30 border-r-0 font-mono text-sm focus:outline-none focus:border-void-accent transition-colors"
              />
              <button className="px-6 py-3 bg-void-white text-void-black font-mono text-sm tracking-wider hover:bg-void-accent transition-colors" data-cursor="pointer">
                →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-void-white/40 font-mono text-xs">
          <p>© 2024 LITXTRA. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-void-white" data-cursor="pointer">Privacy</a>
            <a href="#" className="hover:text-void-white" data-cursor="pointer">Terms</a>
            <a href="#" className="hover:text-void-white" data-cursor="pointer">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ===== CART SIDEBAR =====
const CartSidebar = ({ isOpen, onClose, onCheckout }: { isOpen: boolean; onClose: () => void; onCheckout: () => void }) => {
  const { cart, cartTotal, discountCode, discountApplied, discountAmount, removeFromCart, updateQuantity, applyDiscount } = useStoreContext();
  const finalTotal = cartTotal - discountAmount;
  const [codeInput, setCodeInput] = useState('');
  const [codeError, setCodeError] = useState('');

  const handleApplyCode = () => {
    const success = applyDiscount(codeInput);
    if (!success) {
      setCodeError('Invalid code');
    } else {
      setCodeError('');
      setCodeInput('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-void-black/80 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-void-gray z-50 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-void-white/10">
              <h2 className="font-serif text-2xl">Your Cart</h2>
              <button onClick={onClose} className="w-10 h-10 flex items-center justify-center hover:bg-void-white/10 transition-colors" data-cursor="pointer">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <p className="font-mono text-sm text-void-muted">Your cart is empty</p>
                  <button
                    onClick={onClose}
                    className="mt-4 px-6 py-2 border border-void-white/30 font-mono text-sm hover:bg-void-white hover:text-void-black transition-colors"
                    data-cursor="pointer"
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item) => (
                    <CartItemCard key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} item={item} onRemove={removeFromCart} onUpdateQuantity={updateQuantity} />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-void-white/10 space-y-4">
                {/* Discount Code */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    placeholder="Discount code"
                    className="flex-1 px-4 py-2 bg-void-black border border-void-white/20 font-mono text-sm focus:outline-none focus:border-void-accent"
                  />
                  <button
                    onClick={handleApplyCode}
                    className="px-4 py-2 border border-void-white/30 font-mono text-xs hover:bg-void-white hover:text-void-black transition-colors"
                    data-cursor="pointer"
                  >
                    APPLY
                  </button>
                </div>
                {codeError && <p className="font-mono text-xs text-red-500">{codeError}</p>}
                {discountCode && (
                  <p className="font-mono text-xs text-green-500">
                    {discountCode} applied: -{discountApplied}%
                  </p>
                )}

                {/* Totals */}
                <div className="space-y-2 pt-4">
                  <div className="flex justify-between font-mono text-sm">
                    <span className="text-void-muted">Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between font-mono text-sm text-green-500">
                      <span>Discount</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-mono text-lg pt-2 border-t border-void-white/10">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => {
                    onClose();
                    onCheckout();
                  }}
                  className="w-full py-4 bg-void-white text-void-black font-mono text-sm tracking-wider hover:bg-void-accent transition-colors jitter"
                  data-cursor="pointer"
                >
                  CHECKOUT
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const CartItemCard = ({ item, onRemove, onUpdateQuantity }: { item: CartItem; onRemove: (id: string, size: string, color: string) => void; onUpdateQuantity: (id: string, size: string, color: string, qty: number) => void }) => {
  return (
    <div className="flex gap-4">
      <div className="w-20 h-24 bg-void-gray-light overflow-hidden flex-shrink-0">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1">
        <h4 className="font-sans text-sm font-medium">{item.name}</h4>
        <p className="font-mono text-xs text-void-muted mt-1">
          {item.selectedSize} / {item.selectedColor}
        </p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
              className="w-6 h-6 border border-void-white/30 flex items-center justify-center font-mono text-xs hover:bg-void-white/10"
              data-cursor="pointer"
            >
              -
            </button>
            <span className="font-mono text-sm w-8 text-center">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
              className="w-6 h-6 border border-void-white/30 flex items-center justify-center font-mono text-xs hover:bg-void-white/10"
              data-cursor="pointer"
            >
              +
            </button>
          </div>
          <span className="font-mono text-sm">${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      </div>
      <button
        onClick={() => onRemove(item.id, item.selectedSize, item.selectedColor)}
        className="text-void-muted hover:text-void-white transition-colors"
        data-cursor="pointer"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

// ===== QUICK ADD MODAL =====
const QuickAddModal = ({ product, isOpen, onClose }: { product: Product | null; isOpen: boolean; onClose: () => void }) => {
  const { addToCart } = useStoreContext();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0]);
      setSelectedColor(product.colors[0].name);
      setAdded(false);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (product && selectedSize && selectedColor) {
      addToCart(product, selectedSize, selectedColor);
      setAdded(true);
      setTimeout(() => {
        onClose();
        setAdded(false);
      }, 1000);
    }
  };

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-void-black/80 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-void-gray z-50 p-6 max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center hover:bg-void-white/10"
              data-cursor="pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex gap-6">
              <div className="w-32 h-40 bg-void-gray-light overflow-hidden flex-shrink-0">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="font-mono text-xs text-void-muted">{product.category}</p>
                <h3 className="font-serif text-xl mt-1">{product.name}</h3>
                <p className="font-mono text-lg mt-2">${product.price}</p>
              </div>
            </div>

            {/* Size Selection */}
            <div className="mt-6">
              <p className="font-mono text-xs text-void-muted mb-3">SIZE</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border font-mono text-sm transition-colors ${
                      selectedSize === size
                        ? 'border-void-white bg-void-white text-void-black'
                        : 'border-void-white/30 hover:border-void-white'
                    }`}
                    data-cursor="pointer"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection - Now showing ALL colors */}
            <div className="mt-6">
              <p className="font-mono text-xs text-void-muted mb-3">COLOR: <span className="text-void-white">{selectedColor}</span></p>
              <div className="flex gap-3 flex-wrap">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${
                      selectedColor === color.name ? 'border-void-white scale-110' : 'border-transparent hover:border-void-white/50'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                    data-cursor="pointer"
                  >
                    {selectedColor === color.name && (
                      <svg className={`w-4 h-4 ${color.hex === '#FFFFFF' || color.hex === '#f5f5f0' || color.hex === '#e8e4de' || color.hex === '#FFFDD0' || color.hex === '#f0ebe3' ? 'text-void-black' : 'text-void-white'}`} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart */}
            <motion.button
              onClick={handleAddToCart}
              className={`w-full mt-8 py-4 font-mono text-sm tracking-wider transition-colors ${
                added
                  ? 'bg-green-500 text-void-black'
                  : 'bg-void-white text-void-black hover:bg-void-accent'
              }`}
              whileTap={{ scale: 0.98 }}
              data-cursor="pointer"
            >
              {added ? '✓ ADDED TO CART' : 'ADD TO CART'}
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ===== NAVIGATION =====
const Navigation = ({ 
  onCartOpen, 
  onWishlistOpen, 
  onLogoClick,
  onNavigate,
  currentPage
}: { 
  onCartOpen: () => void; 
  onWishlistOpen: () => void;
  onLogoClick: () => void;
  onNavigate: (page: PageType) => void;
  currentPage: PageType;
}) => {
  const { cartCount, wishlist } = useStoreContext();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { label: string; page: PageType }[] = [
    { label: 'Collections', page: 'collections' },
    { label: 'New', page: 'new' },
    { label: 'Archive', page: 'archive' },
    { label: 'About', page: 'about' },
  ];

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ${
          scrolled || currentPage !== 'home' ? 'glass' : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <button onClick={onLogoClick} className="font-serif text-2xl tracking-wider" data-cursor="pointer">
            LITXTRA
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => onNavigate(item.page)}
                className={`font-sans text-sm animated-underline transition-colors ${
                  currentPage === item.page ? 'text-void-accent' : 'text-void-white/70 hover:text-void-white'
                }`}
                data-cursor="pointer"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={onWishlistOpen}
              className="relative p-2 hover:bg-void-white/10 transition-colors"
              data-cursor="pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-void-accent text-void-black font-mono text-[10px] rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>
            
            <button
              onClick={onCartOpen}
              className="relative p-2 hover:bg-void-white/10 transition-colors"
              data-cursor="pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-void-accent text-void-black font-mono text-[10px] rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden p-2 hover:bg-void-white/10 transition-colors"
              data-cursor="pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-void-black/90 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              className="fixed left-0 top-0 h-full w-3/4 max-w-sm bg-void-gray z-50 p-8"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <button
                onClick={() => setMenuOpen(false)}
                className="absolute top-4 right-4 p-2"
                data-cursor="pointer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="mt-16 space-y-6">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.label}
                    onClick={() => {
                      onNavigate(item.page);
                      setMenuOpen(false);
                    }}
                    className={`block font-serif text-3xl transition-colors ${
                      currentPage === item.page ? 'text-void-accent' : 'hover:text-void-accent'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    data-cursor="pointer"
                  >
                    {item.label}
                  </motion.button>
                ))}
              </div>

              {/* Social Links in Mobile Menu */}
              <div className="mt-12 pt-8 border-t border-void-white/10">
                <p className="font-mono text-xs text-void-muted mb-4">FOLLOW US</p>
                <div className="flex gap-3">
                  <a 
                    href={socialLinks.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-10 h-10 rounded-full border border-void-white/30 flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-500 hover:to-orange-400 hover:border-transparent transition-all"
                    title="Instagram"
                  >
                    <InstagramIcon />
                  </a>
                  <a 
                    href={socialLinks.tiktok} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-10 h-10 rounded-full border border-void-white/30 flex items-center justify-center hover:bg-void-black hover:border-void-white transition-all"
                    title="TikTok"
                  >
                    <TikTokIcon />
                  </a>
                  <a 
                    href={socialLinks.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-10 h-10 rounded-full border border-void-white/30 flex items-center justify-center hover:bg-void-black hover:border-void-white transition-all"
                    title="X (Twitter)"
                  >
                    <TwitterIcon />
                  </a>
                  <a 
                    href={socialLinks.whatsappChannel} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-10 h-10 rounded-full border border-void-white/30 flex items-center justify-center hover:bg-[#25D366] hover:border-transparent transition-all"
                    title="WhatsApp Channel"
                  >
                    <WhatsAppIcon />
                  </a>
                  <a 
                    href={socialLinks.whatsappContact} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-10 h-10 rounded-full border border-void-white/30 flex items-center justify-center hover:bg-[#25D366] hover:border-transparent transition-all"
                    title="Contact Us"
                  >
                    <PhoneIcon />
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// ===== WISHLIST SIDEBAR =====
const WishlistSidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { wishlist, removeFromWishlist, addToCart } = useStoreContext();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-void-black/80 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-void-gray z-50 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="flex items-center justify-between p-6 border-b border-void-white/10">
              <h2 className="font-serif text-2xl">Wishlist</h2>
              <button onClick={onClose} className="w-10 h-10 flex items-center justify-center hover:bg-void-white/10" data-cursor="pointer">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {wishlist.length === 0 ? (
                <div className="text-center py-12">
                  <p className="font-mono text-sm text-void-muted">Your wishlist is empty</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {wishlist.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-24 bg-void-gray-light overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-sans text-sm font-medium">{item.name}</h4>
                        <p className="font-mono text-sm mt-1">${item.price}</p>
                        <button
                          onClick={() => {
                            addToCart(item, item.sizes[0], item.colors[0].name);
                            removeFromWishlist(item.id);
                          }}
                          className="mt-2 px-4 py-1 border border-void-white/30 font-mono text-xs hover:bg-void-white hover:text-void-black transition-colors"
                          data-cursor="pointer"
                        >
                          ADD TO CART
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="text-void-muted hover:text-void-white"
                        data-cursor="pointer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ===== MAIN APP =====
export default function App() {
  const store = useStore();
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageType>('home');

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const handleQuickAdd = (product: Product) => {
    setQuickAddProduct(product);
    setQuickAddOpen(true);
  };

  const scrollToFeaturedDrop = () => {
    const element = document.getElementById('featured-drop');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleEnterCulture = () => {
    setCurrentPage('collections');
    window.scrollTo(0, 0);
  };

  const handleJoinCommunity = () => {
    window.open(socialLinks.whatsappChannel, '_blank');
  };

  const handleNotify = (email: string) => {
    store.addNotifyEmail(email);
    console.log('Notification email saved:', email);
  };

  const handleCheckout = () => {
    setCurrentPage('checkout');
    window.scrollTo(0, 0);
  };

  const handleOrderSuccess = () => {
    setCurrentPage('order-success');
    window.scrollTo(0, 0);
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    window.scrollTo(0, 0);
  };

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <StoreContext.Provider value={store}>
      {/* Grain Overlay */}
      <div className="grain-overlay" />
      
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-void-accent origin-left z-50"
        style={{ scaleX }}
      />

      {/* Navigation */}
      <Navigation 
        onCartOpen={() => setCartOpen(true)} 
        onWishlistOpen={() => setWishlistOpen(true)} 
        onLogoClick={handleBackToHome}
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />

      {/* Main Content */}
      <main>
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <HeroSection onShopDrop={scrollToFeaturedDrop} onEnterCulture={handleEnterCulture} />
              <VideoSection />
              <ConceptSection onJoinCommunity={handleJoinCommunity} />
              <FeaturedDropSection onQuickAdd={handleQuickAdd} />
              <CommunitySection />
              <CountdownSection onNotify={handleNotify} />
              <Footer />
            </motion.div>
          )}

          {currentPage === 'collections' && (
            <motion.div
              key="collections"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CollectionsPage onQuickAdd={handleQuickAdd} onBack={handleBackToHome} />
              <Footer />
            </motion.div>
          )}

          {currentPage === 'new' && (
            <motion.div
              key="new"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <NewArrivalsPage onQuickAdd={handleQuickAdd} onBack={handleBackToHome} />
              <Footer />
            </motion.div>
          )}

          {currentPage === 'archive' && (
            <motion.div
              key="archive"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ArchivePage onQuickAdd={handleQuickAdd} onBack={handleBackToHome} />
              <Footer />
            </motion.div>
          )}

          {currentPage === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AboutPage onBack={handleBackToHome} />
              <Footer />
            </motion.div>
          )}

          {currentPage === 'checkout' && (
            <motion.div
              key="checkout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CheckoutPage onBack={handleBackToHome} onSuccess={handleOrderSuccess} />
            </motion.div>
          )}

          {currentPage === 'order-success' && (
            <motion.div
              key="order-success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <OrderSuccessPage onBack={handleBackToHome} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} onCheckout={handleCheckout} />

      {/* Wishlist Sidebar */}
      <WishlistSidebar isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} />

      {/* Quick Add Modal */}
      <QuickAddModal
        product={quickAddProduct}
        isOpen={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
      />
    </StoreContext.Provider>
  );
}
