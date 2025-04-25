import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const fileName = formData.get('fileName') as string;
    const userId = formData.get('id') as string;

    if (!file || !fileName) {
      return NextResponse.json(
        { error: 'File and fileName are required' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);
    const path = `${userId}/${Date.now()}-${fileName}`;
    const { data, error } = await supabase.storage
      .from('property-images')
      .upload(path, fileBuffer, {
        contentType: file.type || 'application/octet-stream',
      });

    if (error) {
      throw error;
    }

    const { data: storageData } = supabase.storage
      .from('property-images')
      .getPublicUrl(data.path);

    return NextResponse.json(
      { url: storageData.publicUrl },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error uploading file:', error.message);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    } else {
      console.error('Error uploading file:', error);
      return NextResponse.json(
        { error: 'An unknown error occurred' },
        { status: 500 }
      );
    }
  }
}
