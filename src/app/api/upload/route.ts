import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData(); // Parse the FormData body
    const file = formData.get('file') as File; // Get the file from FormData
    const fileName = formData.get('fileName') as string; // Get the fileName from FormData
    const userId = formData.get('id') as string; // Get the fileName from FormData

    if (!file || !fileName) {
      return NextResponse.json(
        { error: 'File and fileName are required' },
        { status: 400 }
      );
    }

    // Convert file to binary buffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);
    const path = `${userId}/${Date.now()}-${fileName}`;
    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('property-images') // Replace 'property-images' with your bucket name
      .upload(path, fileBuffer, {
        contentType: file.type || 'application/octet-stream',
      });

    if (error) {
      throw error;
    }

    // Get the public URL of the uploaded file
    const { data: storageData } = supabase.storage
      .from('property-images')
      .getPublicUrl(data.path);

    return NextResponse.json(
      { url: storageData.publicUrl },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error uploading file:', error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
