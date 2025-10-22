import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            fontSize: 32,
            fontWeight: 600,
          }}
        >
          <div style={{ marginBottom: 20, fontSize: 48 }}>🏃‍♂️</div>
          <div style={{ color: '#1f2937', textAlign: 'center' }}>
            Onchain Leveling
          </div>
          <div style={{ 
            color: '#6b7280', 
            fontSize: 24, 
            marginTop: 10,
            textAlign: 'center' 
          }}>
            Level up through real-world activities
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: unknown) {
    console.log(`${e instanceof Error ? e.message : 'Unknown error'}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}