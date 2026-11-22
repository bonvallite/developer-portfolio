// First-party Open Graph image; no remote fonts, images, cookies or tracking.
// Brand colours and copy follow the maintained docs/JRV_DESIGN_SYSTEM.md v1.12; no external media requests.
import { ImageResponse } from 'next/og';

export const alt = 'JRV Shopify development and commerce engineering';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{
      width: '100%', height: '100%', display: 'flex',
      flexDirection: 'column', justifyContent: 'space-between',
      padding: '64px 72px', color: '#EAF4F3', fontFamily: 'sans-serif',
      background: 'linear-gradient(125deg, #0B1419 0%, #122B34 70%, #0B1419 100%)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ color: '#38C7BC', fontSize: 46, fontWeight: 800 }}>{'{JRV}'}</div>
        <div style={{ fontSize: 16, color: '#A9C1C3', letterSpacing: 3 }}>COMMERCE ENGINEERING</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 72, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
          <div>Shopify development.</div>
          <div style={{ color: '#38C7BC' }}>Ecommerce systems.</div>
        </div>
        <div style={{ fontSize: 27, marginTop: 12 }}>Storefronts / CRO / B2B / Custom apps</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #365B63', paddingTop: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ backgroundColor: '#F28C52', width: 16, height: 16, borderRadius: 8 }} />
          <div style={{ color: '#A9C1C3', fontSize: 18 }}>BUILT FOR MEASURABLE PROGRESS</div>
        </div>
        <div style={{ color: '#FFB58B', fontSize: 21 }}>jrvallite.com</div>
      </div>
    </div>,
    size
  );
}
