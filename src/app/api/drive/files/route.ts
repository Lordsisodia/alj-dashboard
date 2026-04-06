import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const FOLDER_ID = process.env.GOOGLE_DRIVE_VIDEOS_ALL_FOLDER!;

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  webViewLink?: string;
  createdTime?: string;
  size?: string;
}

export async function GET() {
  try {
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    const drive = google.drive({ version: 'v3', auth });

    const res = await drive.files.list({
      q: `'${FOLDER_ID}' in parents and trashed = false`,
      fields: 'files(id,name,mimeType,thumbnailLink,webViewLink,createdTime,size)',
      orderBy: 'createdTime desc',
      pageSize: 20,
    });

    const files: DriveFile[] = (res.data.files ?? []).map(f => ({
      id: f.id!,
      name: f.name!,
      mimeType: f.mimeType!,
      thumbnailLink: f.thumbnailLink ?? undefined,
      webViewLink: f.webViewLink ?? undefined,
      createdTime: f.createdTime ?? undefined,
      size: f.size ?? undefined,
    }));

    return NextResponse.json({ files });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
