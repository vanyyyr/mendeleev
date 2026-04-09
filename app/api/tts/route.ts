import { NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Microsoft Edge TTS WebSocket implementation for high-quality Russian narration.
 * No API key required.
 */
export async function POST(req: Request) {
  try {
    const { text, voice = 'ru-RU-SvetlanaNeural' } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Generate a unique connection ID
    const connectionId = crypto.randomBytes(16).toString('hex').toUpperCase();
    const endpoint = `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=6A5AA1D4EAFF4E9FB37E23D68491D6F4&ConnectionId=${connectionId}`;

    const ws = new WebSocket(endpoint);

    const audioChunks: Buffer[] = [];
    
    return new Promise<Response>((resolve, reject) => {
      const timeout = setTimeout(() => {
        ws.close();
        reject(new Error('TTS Timeout'));
      }, 10000);

      ws.onopen = () => {
        // 1. Send configuration
        const timestamp = new Date().toISOString();
        const config = `X-Timestamp:${timestamp}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"false"},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}`;
        ws.send(config);

        // 2. Send the synthesis request (SSML)
        const ssml = `X-Timestamp:${timestamp}\r\nContent-Type:application/ssml+xml\r\nPath:ssml\r\n\r\n<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='ru-RU'><voice name='${voice}'><prosody rate='0%' pitch='0%'>${text}</prosody></voice></speak>`;
        ws.send(ssml);
      };

      ws.onmessage = async (event) => {
        const data = event.data;
        if (typeof data === 'string') {
          if (data.includes('Path:turn.end')) {
            clearTimeout(timeout);
            ws.close();
            const fullAudio = Buffer.concat(audioChunks);
            resolve(new NextResponse(fullAudio, {
              headers: {
                'Content-Type': 'audio/mpeg',
                'Cache-Control': 'public, max-age=3600',
              },
            }));
          }
        } else if (data instanceof Blob) {
          // In Node 22 WebSocket, data can be a Blob or ArrayBuffer
          const arrayBuffer = await data.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          
          // Edge TTS sends multiple types of binary messages. 
          // The audio data starts after the "Path:audio" header (at index 130 approx).
          // We look for the 'Path:audio' marker in the message headers.
          const marker = 'Path:audio\r\n';
          const markerIndex = buffer.indexOf(marker);
          if (markerIndex !== -1) {
            const bodyIndex = buffer.indexOf('\r\n\r\n', markerIndex) + 4;
            if (bodyIndex !== -1) {
              audioChunks.push(buffer.subarray(bodyIndex));
            }
          }
        }
      };

      ws.onerror = (err) => {
        clearTimeout(timeout);
        ws.close();
        reject(err);
      };
    });

  } catch (error) {
    console.error('TTS Error:', error);
    return NextResponse.json({ error: 'Failed to generate speech' }, { status: 500 });
  }
}
