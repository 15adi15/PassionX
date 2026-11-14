import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const TESTIMONIALS_ROW1 = [
  {
    name: 'Tanvi Rao',
    city: 'Mumbai',
    passion: 'Jazz & Guitar',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    quote: 'Found my weekend jazz trio in Bandra within 48 hours. PassionX completely transformed my Mumbai life!',
    tagBg: 'rgba(56, 189, 248, 0.15)',
    tagColor: '#0284c7',
  },
  {
    name: 'Arjun Kulkarni',
    city: 'Bengaluru',
    passion: 'Philosophy & Ethics',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    quote: 'Late night philosophy debates over chai in Koramangala. Finally found people who care about life’s deepest questions.',
    tagBg: 'rgba(253, 186, 116, 0.2)',
    tagColor: '#c2410c',
  },
  {
    name: 'Siddharth Verma',
    city: 'Delhi',
    passion: 'Hip-Hop & Dance',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop',
    quote: 'From practicing alone in my room to performing at cyphers across Hauz Khas. The energy here is infectious!',
    tagBg: 'rgba(134, 239, 172, 0.2)',
    tagColor: '#15803d',
  },
  {
    name: 'Rhea Merchant',
    city: 'Pune',
    passion: 'Astronomy & Physics',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    quote: 'Pawna lake stargazing trips with fellow telescope nerds. We saw Saturn’s rings together last Saturday!',
    tagBg: 'rgba(196, 181, 253, 0.2)',
    tagColor: '#7c3aed',
  },
];

const TESTIMONIALS_ROW2 = [
  {
    name: 'Sanya Kapoor',
    city: 'Mumbai',
    passion: 'Pottery & Acrylics',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=200&auto=format&fit=crop',
    quote: 'Sunday ceramic workshops and acrylic art walks. Our group of 8 creators meets up every single weekend now.',
    tagBg: 'rgba(252, 165, 165, 0.2)',
    tagColor: '#dc2626',
  },
  {
    name: 'Diya Sen',
    city: 'Bengaluru',
    passion: 'AI & Neuroscience',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
    quote: 'Connecting with machine learning researchers who also love classical piano. Best intellectual spark ever.',
    tagBg: 'rgba(167, 243, 208, 0.2)',
    tagColor: '#059669',
  },
  {
    name: 'Kabir Mehta',
    city: 'Bengaluru',
    passion: 'Indie Songwriting',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    quote: 'Moved to a new city without a single friend. In two weeks, I had a band and a community of acoustic musicians.',
    tagBg: 'rgba(253, 224, 71, 0.22)',
    tagColor: '#a16207',
  },
  {
    name: 'Aarav Sharma',
    city: 'Mumbai',
    passion: 'Acoustic & Philosophy',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop',
    quote: 'No vanity metrics, no endless doom-scrolling. Just genuine souls sharing genuine passion. Highly recommended!',
    tagBg: 'rgba(147, 197, 253, 0.2)',
    tagColor: '#2563eb',
  },
];

const HAPPY_GALLERY = [
  {
    url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop',
    title: 'Acoustic Sunset Jam',
    location: 'Bandra, Mumbai',
    passion: 'Music',
    aspect: 'wide',
  },
  {
    url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop',
    title: 'Laughs & Deep Talks',
    location: 'Indiranagar, Bengaluru',
    passion: 'Philosophy & Books',
    aspect: 'portrait',
  },
  {
    url: 'https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=1200&auto=format&fit=crop',
    title: 'Freestyle Dance Cypher',
    location: 'Hauz Khas, Delhi',
    passion: 'Dance',
    aspect: 'portrait',
  },
  {
    url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1200&auto=format&fit=crop',
    title: 'Ceramic & Canvas Workshop',
    location: 'Koregaon Park, Pune',
    passion: 'Fine Arts',
    aspect: 'wide',
  },
  {
    url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1200&auto=format&fit=crop',
    title: 'Community Table & Stories',
    location: 'Colaba, Mumbai',
    passion: 'Culinary & Culture',
    aspect: 'wide',
  },
  {
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
    title: 'Night Sky Stargazing Camp',
    location: 'Pawna Lake, Maharashtra',
    passion: 'Astronomy',
    aspect: 'portrait',
  },
];

const POPULAR_PASSIONS = [
  { name: 'Music & Vocals', icon: '🎵', count: '1,420 members', color: '#0284c7', query: 'music' },
  { name: 'Dance & Movement', icon: '💃', count: '980 members', color: '#16a34a', query: 'dance' },
  { name: 'Philosophy & Books', icon: '📖', count: '830 members', color: '#ea580c', query: 'philosophy' },
  { name: 'Astronomy & Science', icon: '🔭', count: '640 members', color: '#7c3aed', query: 'science' },
  { name: 'Fine Arts & Pottery', icon: '🎨', count: '750 members', color: '#db2777', query: 'art' },
  { name: 'Coding & AI', icon: '💻', count: '1,120 members', color: '#2563eb', query: 'ai' },
  { name: 'Film & Photography', icon: '🎬', count: '590 members', color: '#ca8a04', query: 'film' },
  { name: 'Mindfulness & Yoga', icon: '🌿', count: '680 members', color: '#059669', query: 'yoga' },
];

const CITIES = [
  { name: 'Mumbai', state: 'Maharashtra', count: '3,800+ people' },
  { name: 'Bengaluru', state: 'Karnataka', count: '4,200+ people' },
  { name: 'Delhi NCR', state: 'Delhi', count: '2,900+ people' },
  { name: 'Pune', state: 'Maharashtra', count: '1,750+ people' },
];

const Landing = () => {
  const navigate = useNavigate();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Background video autoplay deferred until user interaction:', err);
        });
      }
    }
  }, []);

  return (
    <div style={styles.container}>
      {/* ================= HERO SECTION WITH VIDEO ================= */}
      <section style={styles.heroSection}>
        {/* Background Video */}
        <div style={styles.videoWrapper}>
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            defaultMuted
            playsInline
            preload="auto"
            poster="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1920&auto=format&fit=crop"
            onLoadedData={() => setIsVideoLoaded(true)}
            style={{
              ...styles.video,
              opacity: isVideoLoaded ? 1 : 0.85,
            }}
          >
            <source src="/hero-bg.mp4" type="video/mp4" />
          </video>
          {/* Cinematic Dark/Warm Overlay */}
          <div style={styles.videoOverlay} />
        </div>

        {/* Hero Overlay Content */}
        <div style={styles.heroContent}>
          {/* Elegant Pill Badge */}
          <div style={styles.pillBadge}>
            <span style={styles.sparkle}>✦</span>
            <span>The Human Connection Network</span>
          </div>

          {/* Headline over video */}
          <h1 style={styles.heroHeadline}>
            Your passion, your people <br />
            <span style={styles.heroHeadlineItalic}>all at one place</span>
          </h1>

          {/* Subtitle */}
          <p style={styles.heroSubtitle}>
            Find kindred spirits who share your deepest curiosities. Connect locally
            in Mumbai, Bengaluru, Delhi, and beyond for acoustic jams, philosophy salons,
            dance cyphers, and lifelong friendships.
          </p>

          {/* CTA Buttons */}
          <div style={styles.heroButtons}>
            <Link to="/auth?mode=signup" style={styles.primaryBtn}>
              Join PassionX Free
              <span style={{ fontSize: '1.1rem' }}>→</span>
            </Link>
            <Link to="/discover" style={styles.glassBtn}>
              Explore Community
            </Link>
          </div>

          {/* Floating Community Counter Pill */}
          <div style={styles.statsPill}>
            <div style={styles.statItem}>
              <span style={styles.statDot} />
              <span style={styles.statBold}>120+</span> Passions
            </div>
            <div style={styles.statDivider}>•</div>
            <div style={styles.statItem}>
              <span style={styles.statBold}>10,000+</span> Real Connections
            </div>
            <div style={styles.statDivider}>•</div>
            <div style={styles.statItem}>
              <span style={styles.statBold}>40+</span> Cities in India
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <a href="#editorial" style={styles.scrollDown}>
          <span style={styles.scrollText}>Scroll to discover</span>
          <span style={styles.scrollArrow}>↓</span>
        </a>
      </section>

      {/* ================= EDITORIAL SECTION (MATCHING SCREENSHOT) ================= */}
      <section id="editorial" style={styles.editorialSection}>
        <div style={styles.editorialContainer}>
          {/* Part 1: Top Split Header from screenshot */}
          <div style={styles.editorialTopRow}>
            <div style={styles.editorialLeftCol}>
              <h2 style={styles.editorialMainTitle}>
                Creating authentic <br />
                connection for all
              </h2>
            </div>
            <div style={styles.editorialRightCol}>
              <p style={styles.editorialLeadText}>
                We bring together dancers, musicians, philosophers, astronomers, and
                creators across cities through the pure joy of shared craft. No vanity
                metrics, no algorithmic echo chambers — just real humans doing what they love.
              </p>
            </div>
          </div>

          {/* Part 2: Columns with vertical marker lines (as seen in screenshot) */}
          <div style={styles.pillarsGrid}>
            <div style={styles.pillarCard}>
              <div style={styles.pillarHeader}>
                <span style={styles.pillarBar} />
                <h3 style={styles.pillarTitle}>Our passion hubs</h3>
              </div>
              <p style={styles.pillarBody}>
                Helping ignite creativity and camaraderie by connecting enthusiasts for
                weekend jams, book discussions, astronomy night-outs, and art workshops.
              </p>
              <Link to="/discover" style={styles.pillarLink}>
                Learn about our passions →
              </Link>
            </div>

            <div style={styles.pillarCard}>
              <div style={styles.pillarHeader}>
                <span style={styles.pillarBar} />
                <h3 style={styles.pillarTitle}>Our communities</h3>
              </div>
              <p style={styles.pillarBody}>
                Making an impact in the neighborhoods where we live and work: Bandra,
                Koramangala, Hauz Khas, and beyond through organic local meetups.
              </p>
              <Link to="/discover" style={styles.pillarLink}>
                Explore our communities →
              </Link>
            </div>

            <div style={styles.pillarCard}>
              <div style={styles.pillarHeader}>
                <span style={styles.pillarBar} />
                <h3 style={styles.pillarTitle}>Quiet minimalism</h3>
              </div>
              <p style={styles.pillarBody}>
                Designed with zero clutter, graceful typography, and Apple-grade
                glass aesthetics. Everything you need to meet kindred spirits, and nothing more.
              </p>
              <Link to="/auth?mode=signup" style={styles.pillarLink}>
                Join the experience →
              </Link>
            </div>
          </div>

          {/* Part 3: Split Section with Image (from lower half of screenshot) */}
          <div style={styles.editorialSplitSection}>
            <div style={styles.splitTextCol}>
              <h2 style={styles.splitHeading}>
                Prioritizing real bonds and creative growth
              </h2>
              <p style={styles.splitParagraph}>
                A passion-driven life is, by definition, an extraordinary one. We are
                committed to creating a warm, inclusive sanctuary where artists, thinkers,
                and dreamers feel like they truly belong.
              </p>
              <div style={styles.splitChecklist}>
                <div style={styles.checkItem}>
                  <span style={styles.checkIcon}>✓</span>
                  <span>Hyper-local discovery by city and neighborhood</span>
                </div>
                <div style={styles.checkItem}>
                  <span style={styles.checkIcon}>✓</span>
                  <span>Direct message access with zero algorithmic interference</span>
                </div>
                <div style={styles.checkItem}>
                  <span style={styles.checkIcon}>✓</span>
                  <span>Free and open for independent creators and hobbyists</span>
                </div>
              </div>
              <Link to="/auth?mode=signup" style={styles.splitActionBtn}>
                Find Your People Now →
              </Link>
            </div>
            <div style={styles.splitImageCol}>
              <div style={styles.imageCard}>
                <img
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop"
                  alt="Friends laughing and enjoying time together"
                  style={styles.splitImage}
                />
                <div style={styles.imageOverlayTag}>
                  <span style={styles.tagDot} />
                  <span>Sunday Philosophy Salon • Bengaluru</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FLOATING TESTIMONIAL SLIDESHOW (LEFT TO RIGHT) ================= */}
      <section style={styles.testimonialsSection}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionBadge}>TESTIMONIALS</div>
          <h2 style={styles.sectionTitle}>Stories of Connection</h2>
          <p style={styles.sectionSubtitle}>
            Real stories from members who found their creative partners, bandmates, and best friends.
          </p>
        </div>

        {/* Marquee Track 1: Moving Smoothly Left to Right */}
        <div style={styles.marqueeContainer}>
          <div style={styles.marqueeTrackLtoR}>
            {/* Duplicated list to create infinite seamless loop */}
            {[...TESTIMONIALS_ROW1, ...TESTIMONIALS_ROW1].map((item, idx) => (
              <div key={idx} style={styles.testimonialCard}>
                <div style={styles.cardTop}>
                  <img src={item.avatar} alt={item.name} style={styles.avatarImg} />
                  <div>
                    <h4 style={styles.authorName}>{item.name}</h4>
                    <p style={styles.authorCity}>📍 {item.city}</p>
                  </div>
                  <span
                    style={{
                      ...styles.passionTag,
                      backgroundColor: item.tagBg,
                      color: item.tagColor,
                    }}
                  >
                    {item.passion}
                  </span>
                </div>
                <p style={styles.quoteText}>“{item.quote}”</p>
                <div style={styles.stars}>★★★★★</div>
              </div>
            ))}
          </div>
        </div>

        {/* Marquee Track 2: Complementary Track */}
        <div style={{ ...styles.marqueeContainer, marginTop: '1.25rem' }}>
          <div style={styles.marqueeTrackRtoL}>
            {[...TESTIMONIALS_ROW2, ...TESTIMONIALS_ROW2].map((item, idx) => (
              <div key={idx} style={styles.testimonialCard}>
                <div style={styles.cardTop}>
                  <img src={item.avatar} alt={item.name} style={styles.avatarImg} />
                  <div>
                    <h4 style={styles.authorName}>{item.name}</h4>
                    <p style={styles.authorCity}>📍 {item.city}</p>
                  </div>
                  <span
                    style={{
                      ...styles.passionTag,
                      backgroundColor: item.tagBg,
                      color: item.tagColor,
                    }}
                  >
                    {item.passion}
                  </span>
                </div>
                <p style={styles.quoteText}>“{item.quote}”</p>
                <div style={styles.stars}>★★★★★</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HAPPY PHOTO GALLERY ================= */}
      <section style={styles.gallerySection}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionBadge}>LIFE AT PASSIONX</div>
          <h2 style={styles.sectionTitle}>Life is richer when shared</h2>
          <p style={styles.sectionSubtitle}>
            Glimpses of people connecting, laughing, jamming, and making memories.
          </p>
        </div>

        <div style={styles.galleryGrid}>
          {HAPPY_GALLERY.map((photo, i) => (
            <div key={i} style={styles.galleryItem}>
              <img src={photo.url} alt={photo.title} style={styles.galleryImg} />
              <div style={styles.galleryHover}>
                <span style={styles.galleryTag}>{photo.passion}</span>
                <h4 style={styles.galleryTitle}>{photo.title}</h4>
                <p style={styles.galleryLocation}>📍 {photo.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= BROWSE POPULAR PASSIONS ================= */}
      <section style={styles.passionsSection}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionBadge}>DISCOVER BY INTEREST</div>
          <h2 style={styles.sectionTitle}>What gets your heart racing?</h2>
          <p style={styles.sectionSubtitle}>
            Tap any passion to instantly see who is active in your city.
          </p>
        </div>

        <div style={styles.passionsGrid}>
          {POPULAR_PASSIONS.map((item, idx) => (
            <div
              key={idx}
              onClick={() => navigate(`/discover?passion=${item.query}`)}
              style={styles.passionCard}
            >
              <div style={styles.passionIcon}>{item.icon}</div>
              <h3 style={styles.passionCardTitle}>{item.name}</h3>
              <p style={styles.passionCount}>{item.count}</p>
              <span style={styles.passionArrow}>Explore →</span>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CITY CHAPTERS ================= */}
      <section style={styles.citySection}>
        <div style={styles.cityContainer}>
          <div style={styles.cityTextCol}>
            <div style={styles.sectionBadge}>LOCAL CHAPTERS</div>
            <h2 style={styles.cityHeading}>
              Active in India’s most creative hubs
            </h2>
            <p style={styles.cityDescription}>
              Whether you are looking for morning coffee philosophizers in Koramangala or
              sunset acoustic musicians on Bandra Bandstand, PassionX connects you directly
              to your neighborhood tribe.
            </p>
          </div>
          <div style={styles.cityGridCol}>
            {CITIES.map((city, idx) => (
              <div
                key={idx}
                onClick={() => navigate(`/discover?city=${city.name.toLowerCase()}`)}
                style={styles.cityItemCard}
              >
                <div style={styles.cityCircle}>📍</div>
                <div>
                  <h4 style={styles.cityItemName}>{city.name}</h4>
                  <p style={styles.cityItemSub}>{city.state} • {city.count}</p>
                </div>
                <span style={styles.cityGoArrow}>→</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CALL TO ACTION HERO ================= */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaCard}>
          {/* Subtle background glow orbs */}
          <div style={styles.ctaOrb1} />
          <div style={styles.ctaOrb2} />

          <div style={styles.ctaContent}>
            <span style={styles.ctaSparkle}>✦ ✦ ✦</span>
            <h2 style={styles.ctaHeading}>
              Your people are waiting for you.
            </h2>
            <p style={styles.ctaSub}>
              Take 30 seconds to sign up. Filter by your city and find someone who shares
              the spark you carry.
            </p>
            <div style={styles.ctaButtons}>
              <Link to="/auth?mode=signup" style={styles.ctaPrimaryBtn}>
                Get Started Free
              </Link>
              <Link to="/discover" style={styles.ctaSecondaryBtn}>
                Browse Directory
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <div style={styles.footerBrand}>
            <span style={styles.footerLogo}>✦ PassionX</span>
            <p style={styles.footerTagline}>
              Your passion, your people, all at one place.
            </p>
          </div>
          <div style={styles.footerLinks}>
            <Link to="/discover" style={styles.footerLink}>Discover</Link>
            <Link to="/auth" style={styles.footerLink}>Sign In</Link>
            <Link to="/auth?mode=signup" style={styles.footerLink}>Sign Up</Link>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p>© 2026 PassionX. Handcrafted with joy for creators, thinkers, and seekers.</p>
        </div>
      </footer>
    </div>
  );
};

/* ================= STYLES ================= */
const styles = {
  container: {
    backgroundColor: 'var(--color-ivory, #FAF8F5)',
    color: '#1e293b',
    width: '100%',
    overflowX: 'hidden',
  },

  /* HERO */
  heroSection: {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '6rem 2rem 5rem 2rem',
    overflow: 'hidden',
    backgroundColor: '#0f172a',
  },
  videoWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
    backgroundImage: 'radial-gradient(ellipse at center, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.9) 100%), url(https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1920&auto=format&fit=crop)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'opacity 1s ease',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background:
      'linear-gradient(180deg, rgba(15, 23, 42, 0.65) 0%, rgba(15, 23, 42, 0.45) 40%, rgba(15, 23, 42, 0.75) 80%, #FAF8F5 100%)',
  },
  heroContent: {
    position: 'relative',
    zIndex: 10,
    maxWidth: 960,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  pillBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.45rem',
    padding: '0.45rem 1.15rem',
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    color: '#f8fafc',
    fontSize: '0.85rem',
    fontWeight: 500,
    letterSpacing: '0.04em',
    marginBottom: '1.75rem',
  },
  sparkle: {
    color: '#38bdf8',
    fontSize: '1rem',
  },
  heroHeadline: {
    fontFamily: 'var(--font-serif)',
    fontSize: 'clamp(2.5rem, 5.8vw, 5.2rem)',
    fontWeight: 600,
    color: '#ffffff',
    lineHeight: 1.1,
    letterSpacing: '-0.03em',
    marginBottom: '1.5rem',
    textShadow: '0 4px 24px rgba(0,0,0,0.4)',
  },
  heroHeadlineItalic: {
    fontFamily: 'var(--font-serif)',
    fontStyle: 'italic',
    fontWeight: 400,
    color: '#bae6fd',
  },
  heroSubtitle: {
    fontSize: 'clamp(1rem, 1.35vw, 1.25rem)',
    fontWeight: 300,
    color: 'rgba(241, 245, 249, 0.92)',
    maxWidth: 720,
    lineHeight: 1.65,
    marginBottom: '2.5rem',
    letterSpacing: '-0.01em',
  },
  heroButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1.1rem',
    justifyContent: 'center',
    marginBottom: '3rem',
  },
  primaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.9rem 2.2rem',
    borderRadius: 30,
    backgroundColor: '#ffffff',
    color: '#0f172a',
    fontSize: '1rem',
    fontWeight: 600,
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.25)',
    transition: 'all 0.25s ease',
  },
  glassBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.9rem 2.2rem',
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    border: '1px solid rgba(255, 255, 255, 0.35)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: 500,
    transition: 'all 0.25s ease',
  },
  statsPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
    padding: '0.65rem 1.6rem',
    borderRadius: 30,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    color: 'rgba(248, 250, 252, 0.85)',
    fontSize: '0.85rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  statDot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    backgroundColor: '#10b981',
  },
  statBold: {
    fontWeight: 700,
    color: '#ffffff',
  },
  statDivider: {
    color: 'rgba(255, 255, 255, 0.3)',
  },
  scrollDown: {
    position: 'absolute',
    bottom: '1.5rem',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.2rem',
    color: '#64748b',
    textDecoration: 'none',
    fontSize: '0.78rem',
    letterSpacing: '0.05em',
  },
  scrollText: {
    textTransform: 'uppercase',
    fontWeight: 500,
  },
  scrollArrow: {
    fontSize: '1rem',
    animation: 'floatGentle 2s ease-in-out infinite',
  },

  /* EDITORIAL SECTION */
  editorialSection: {
    backgroundColor: 'var(--color-ivory, #FAF8F5)',
    padding: '6rem 2rem',
  },
  editorialContainer: {
    maxWidth: 1200,
    margin: '0 auto',
  },
  editorialTopRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '3rem',
    alignItems: 'baseline',
    marginBottom: '4.5rem',
    paddingBottom: '2.5rem',
    borderBottom: '1px solid rgba(203, 213, 225, 0.6)',
  },
  editorialLeftCol: {},
  editorialMainTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: 'clamp(2.4rem, 4.2vw, 3.8rem)',
    fontWeight: 600,
    lineHeight: 1.15,
    letterSpacing: '-0.03em',
    color: '#0f172a',
  },
  editorialRightCol: {},
  editorialLeadText: {
    fontSize: 'clamp(1.05rem, 1.35vw, 1.25rem)',
    lineHeight: 1.65,
    color: '#475569',
    fontWeight: 400,
  },

  /* Pillars Grid */
  pillarsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2.5rem',
    marginBottom: '6rem',
  },
  pillarCard: {
    display: 'flex',
    flexDirection: 'column',
  },
  pillarHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  pillarBar: {
    width: 3,
    height: 22,
    backgroundColor: '#0284c7',
    borderRadius: 2,
  },
  pillarTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#0f172a',
    letterSpacing: '-0.01em',
  },
  pillarBody: {
    fontSize: '0.94rem',
    lineHeight: 1.65,
    color: '#475569',
    marginBottom: '1.25rem',
    flexGrow: 1,
  },
  pillarLink: {
    fontSize: '0.88rem',
    fontWeight: 600,
    color: '#c2410c',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    transition: 'color 0.2s ease',
  },

  /* Split Section */
  editorialSplitSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '4rem',
    alignItems: 'center',
    paddingTop: '2rem',
  },
  splitTextCol: {},
  splitHeading: {
    fontFamily: 'var(--font-serif)',
    fontSize: 'clamp(2rem, 3.5vw, 3rem)',
    fontWeight: 600,
    lineHeight: 1.18,
    letterSpacing: '-0.025em',
    color: '#0f172a',
    marginBottom: '1.5rem',
  },
  splitParagraph: {
    fontSize: '1.05rem',
    lineHeight: 1.7,
    color: '#475569',
    marginBottom: '2rem',
  },
  splitChecklist: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem',
    marginBottom: '2.5rem',
  },
  checkItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '0.95rem',
    color: '#1e293b',
    fontWeight: 500,
  },
  checkIcon: {
    color: '#10b981',
    fontWeight: 800,
  },
  splitActionBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.85rem 1.8rem',
    borderRadius: 24,
    backgroundColor: '#0f172a',
    color: '#ffffff',
    fontSize: '0.94rem',
    fontWeight: 600,
    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.15)',
  },
  splitImageCol: {},
  imageCard: {
    position: 'relative',
    borderRadius: 24,
    overflow: 'hidden',
    boxShadow: '0 20px 48px rgba(15, 23, 42, 0.12)',
  },
  splitImage: {
    width: '100%',
    height: 440,
    objectFit: 'cover',
    display: 'block',
  },
  imageOverlayTag: {
    position: 'absolute',
    bottom: '1.25rem',
    left: '1.25rem',
    padding: '0.5rem 1rem',
    borderRadius: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    color: '#ffffff',
    fontSize: '0.82rem',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  tagDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: '#38bdf8',
  },

  /* TESTIMONIALS SLIDESHOW */
  testimonialsSection: {
    padding: '6rem 0',
    backgroundColor: '#F5EFEB',
    overflow: 'hidden',
  },
  sectionHeader: {
    textAlign: 'center',
    maxWidth: 680,
    margin: '0 auto 3.5rem auto',
    padding: '0 1.5rem',
  },
  sectionBadge: {
    display: 'inline-block',
    fontSize: '0.78rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    color: '#0284c7',
    marginBottom: '0.75rem',
  },
  sectionTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: 'clamp(2rem, 3.5vw, 3rem)',
    fontWeight: 600,
    color: '#0f172a',
    letterSpacing: '-0.025em',
    marginBottom: '0.85rem',
  },
  sectionSubtitle: {
    fontSize: '1rem',
    color: '#64748b',
    lineHeight: 1.6,
  },
  marqueeContainer: {
    width: '100%',
    overflow: 'hidden',
    display: 'flex',
  },
  marqueeTrackLtoR: {
    display: 'flex',
    gap: '1.5rem',
    width: 'max-content',
    animation: 'marqueeLeftToRight 36s linear infinite',
  },
  marqueeTrackRtoL: {
    display: 'flex',
    gap: '1.5rem',
    width: 'max-content',
    animation: 'marqueeRightToLeft 36s linear infinite',
  },
  testimonialCard: {
    width: 360,
    padding: '1.6rem',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    border: '1px solid rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexShrink: 0,
  },
  cardTop: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    marginBottom: '1rem',
  },
  avatarImg: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    objectFit: 'cover',
  },
  authorName: {
    fontSize: '0.96rem',
    fontWeight: 600,
    color: '#0f172a',
  },
  authorCity: {
    fontSize: '0.8rem',
    color: '#64748b',
  },
  passionTag: {
    marginLeft: 'auto',
    padding: '0.25rem 0.65rem',
    borderRadius: 14,
    fontSize: '0.74rem',
    fontWeight: 600,
  },
  quoteText: {
    fontSize: '0.92rem',
    lineHeight: 1.55,
    color: '#334155',
    fontStyle: 'italic',
    marginBottom: '1rem',
    flexGrow: 1,
  },
  stars: {
    color: '#f59e0b',
    fontSize: '0.85rem',
    letterSpacing: '0.15em',
  },

  /* HAPPY GALLERY */
  gallerySection: {
    padding: '6rem 2rem',
    backgroundColor: 'var(--color-ivory, #FAF8F5)',
  },
  galleryGrid: {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '1.5rem',
  },
  galleryItem: {
    position: 'relative',
    height: 300,
    borderRadius: 20,
    overflow: 'hidden',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.06)',
    cursor: 'pointer',
  },
  galleryImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.4s ease',
  },
  galleryHover: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '1.5rem',
    background: 'linear-gradient(180deg, transparent 0%, rgba(15, 23, 42, 0.85) 100%)',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  galleryTag: {
    display: 'inline-block',
    alignSelf: 'flex-start',
    padding: '0.2rem 0.6rem',
    borderRadius: 12,
    backgroundColor: 'rgba(56, 189, 248, 0.3)',
    color: '#bae6fd',
    fontSize: '0.74rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  galleryTitle: {
    fontSize: '1.15rem',
    fontWeight: 600,
    color: '#ffffff',
  },
  galleryLocation: {
    fontSize: '0.82rem',
    color: 'rgba(255, 255, 255, 0.8)',
  },

  /* PASSIONS */
  passionsSection: {
    padding: '6rem 2rem',
    backgroundColor: '#F7F5F0',
  },
  passionsGrid: {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '1.5rem',
  },
  passionCard: {
    padding: '1.8rem',
    borderRadius: 20,
    backgroundColor: '#ffffff',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.03)',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    display: 'flex',
    flexDirection: 'column',
  },
  passionIcon: {
    fontSize: '2.2rem',
    marginBottom: '1rem',
  },
  passionCardTitle: {
    fontSize: '1.15rem',
    fontWeight: 600,
    color: '#0f172a',
    marginBottom: '0.35rem',
  },
  passionCount: {
    fontSize: '0.84rem',
    color: '#64748b',
    marginBottom: '1.25rem',
  },
  passionArrow: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#0284c7',
    marginTop: 'auto',
  },

  /* CITY CHAPTERS */
  citySection: {
    padding: '6rem 2rem',
    backgroundColor: 'var(--color-ivory, #FAF8F5)',
  },
  cityContainer: {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '4rem',
    alignItems: 'center',
  },
  cityTextCol: {},
  cityHeading: {
    fontFamily: 'var(--font-serif)',
    fontSize: 'clamp(2rem, 3.5vw, 3rem)',
    fontWeight: 600,
    color: '#0f172a',
    lineHeight: 1.2,
    marginBottom: '1.25rem',
  },
  cityDescription: {
    fontSize: '1.02rem',
    lineHeight: 1.7,
    color: '#475569',
  },
  cityGridCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  cityItemCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.2rem',
    padding: '1.2rem 1.6rem',
    borderRadius: 18,
    backgroundColor: '#ffffff',
    border: '1px solid rgba(226, 232, 240, 0.8)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  },
  cityCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
  },
  cityItemName: {
    fontSize: '1.05rem',
    fontWeight: 600,
    color: '#0f172a',
  },
  cityItemSub: {
    fontSize: '0.82rem',
    color: '#64748b',
  },
  cityGoArrow: {
    marginLeft: 'auto',
    fontSize: '1.1rem',
    color: '#0284c7',
    fontWeight: 700,
  },

  /* CTA HERO */
  ctaSection: {
    padding: '5rem 2rem',
    maxWidth: 1200,
    margin: '0 auto',
  },
  ctaCard: {
    position: 'relative',
    borderRadius: 32,
    padding: '5rem 2rem',
    textAlign: 'center',
    backgroundColor: '#0f172a',
    overflow: 'hidden',
    boxShadow: '0 24px 64px rgba(15, 23, 42, 0.2)',
  },
  ctaOrb1: {
    position: 'absolute',
    top: '-20%',
    left: '-10%',
    width: 320,
    height: 320,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(56, 189, 248, 0.35) 0%, transparent 70%)',
    filter: 'blur(50px)',
    pointerEvents: 'none',
  },
  ctaOrb2: {
    position: 'absolute',
    bottom: '-20%',
    right: '-10%',
    width: 340,
    height: 340,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, transparent 70%)',
    filter: 'blur(50px)',
    pointerEvents: 'none',
  },
  ctaContent: {
    position: 'relative',
    zIndex: 1,
    maxWidth: 680,
    margin: '0 auto',
  },
  ctaSparkle: {
    color: '#38bdf8',
    letterSpacing: '0.4em',
    fontSize: '1rem',
    display: 'block',
    marginBottom: '1rem',
  },
  ctaHeading: {
    fontFamily: 'var(--font-serif)',
    fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
    fontWeight: 600,
    color: '#ffffff',
    lineHeight: 1.15,
    marginBottom: '1.25rem',
  },
  ctaSub: {
    fontSize: '1.05rem',
    color: 'rgba(241, 245, 249, 0.85)',
    lineHeight: 1.65,
    marginBottom: '2.5rem',
  },
  ctaButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    justifyContent: 'center',
  },
  ctaPrimaryBtn: {
    padding: '0.9rem 2.2rem',
    borderRadius: 30,
    backgroundColor: '#ffffff',
    color: '#0f172a',
    fontSize: '1rem',
    fontWeight: 600,
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
  },
  ctaSecondaryBtn: {
    padding: '0.9rem 2.2rem',
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: 500,
  },

  /* FOOTER */
  footer: {
    backgroundColor: '#090d16',
    color: 'rgba(255, 255, 255, 0.7)',
    padding: '4rem 2rem 2.5rem 2rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  },
  footerInner: {
    maxWidth: 1200,
    margin: '0 auto 3rem auto',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '2rem',
  },
  footerBrand: {},
  footerLogo: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#ffffff',
    display: 'block',
    marginBottom: '0.4rem',
  },
  footerTagline: {
    fontSize: '0.88rem',
    color: '#94a3b8',
  },
  footerLinks: {
    display: 'flex',
    gap: '2rem',
  },
  footerLink: {
    fontSize: '0.9rem',
    color: '#cbd5e1',
    transition: 'color 0.2s ease',
  },
  footerBottom: {
    maxWidth: 1200,
    margin: '0 auto',
    paddingTop: '2rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    fontSize: '0.82rem',
    color: '#64748b',
    textAlign: 'center',
  },
};

export default Landing;

