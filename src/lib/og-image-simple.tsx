import { ImageResponse } from '@vercel/og';

export interface OGImageProps {
  title?: string;
  description?: string;
  category?: string;
  theme?: 'light' | 'dark';
}

export async function generateOGImageSimple({
  title = 'Dodo Payments',
  description = 'Launch and Accept Global Payments in less than 60 minutes',
  category = 'Customer Portal',
  theme = 'light'
}: OGImageProps) {
  // Define colors based on theme - matching the screenshot style
  const colors = {
    background: '#F3FFD3', // Light green/yellow from screenshot
    text: '#0D0D0D',
    categoryText: '#7A9A00',
    borderColor: '#E8F5C8',
    accentColor: '#8FB300'
  };

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: colors.background,
          padding: '60px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Subtle background pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(circle at 20% 50%, ${colors.borderColor} 0%, transparent 50%),
                            radial-gradient(circle at 80% 80%, ${colors.borderColor} 0%, transparent 50%)`,
            opacity: 0.5,
          }}
        />
        
        {/* Content Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Header with Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '40px',
            }}
          >
            {/* Dodo Logo SVG */}
            <svg
              width="60"
              height="60"
              viewBox="0 0 60 60"
              fill="none"
              style={{ flexShrink: 0 }}
            >
              <rect width="60" height="60" rx="12" fill={colors.accentColor} />
              <circle cx="22" cy="22" r="6" fill="#FFF" />
              <circle cx="38" cy="22" r="6" fill="#FFF" />
              <path
                d="M20 36C20 36 24 40 30 40C36 40 40 36 40 36"
                stroke="#FFF"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="22" cy="22" r="3" fill={colors.text} />
              <circle cx="38" cy="22" r="3" fill={colors.text} />
            </svg>
            <span
              style={{
                fontSize: '32px',
                fontWeight: 700,
                color: colors.text,
              }}
            >
              Dodo Payments
            </span>
          </div>

          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            {category && (
              <div
                style={{
                  fontSize: '20px',
                  color: colors.categoryText,
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {category}
              </div>
            )}
            
            <h1
              style={{
                fontSize: '64px',
                fontWeight: 700,
                color: colors.text,
                lineHeight: 1.1,
                margin: 0,
                maxWidth: '900px',
              }}
            >
              {title}
            </h1>
            
            {description && (
              <p
                style={{
                  fontSize: '24px',
                  color: colors.text,
                  opacity: 0.8,
                  lineHeight: 1.4,
                  margin: 0,
                  maxWidth: '700px',
                }}
              >
                {description}
              </p>
            )}
          </div>

          {/* Footer decoration */}
          <div
            style={{
              position: 'absolute',
              bottom: '60px',
              right: '60px',
              width: '120px',
              height: '120px',
              borderRadius: '24px',
              background: colors.borderColor,
              opacity: 0.6,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '90px',
              right: '90px',
              width: '80px',
              height: '80px',
              borderRadius: '16px',
              background: colors.accentColor,
              opacity: 0.3,
            }}
          />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}