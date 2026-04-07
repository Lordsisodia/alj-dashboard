import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    const drive = google.drive({ version: 'v3', auth });

    // Get file metadata for mimeType
    const meta = await drive.files.get({ fileId: id, fields: 'mimeType,name' });
    const mimeType = meta.data.mimeType ?? 'video/mp4';

    // Stream the file content
    const res = await drive.files.get(
      { fileId: id, alt: 'media' },
      { responseType: 'stream' }
    );

    const readable = res.data as NodeJS.ReadableStream;

    const stream = new ReadableStream({
      start(controller) {
        readable.on('data', (chunk: Buffer) => controller.enqueue(chunk));
        readable.on('end', () => controller.close());
        readable.on('error', (err: Error) => controller.error(err));
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
