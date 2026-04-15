import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const targetFile = formData.get('target') as File | null;
    const prompt = (formData.get('prompt') as string) || '';

    if (!targetFile) {
      return NextResponse.json({ error: 'Missing target image' }, { status: 400 });
    }

    const falKey = process.env.FAL_KEY;
    if (!falKey) {
      return NextResponse.json({ error: 'FAL_KEY not configured in .env.local' }, { status: 500 });
    }

    const targetBuffer = await targetFile.arrayBuffer();
    const targetMime = targetFile.type || 'image/jpeg';
    const targetExt = targetMime.split('/')[1]?.split(';')[0] || 'jpg';

    // Step 1: Initiate upload via rest.fal.ai (correct current endpoint)
    console.log('Initiating upload via rest.fal.ai...');
    const initiateRes = await fetch(
      'https://rest.fal.ai/storage/upload/initiate?storage_type=fal-cdn-v3',
      {
        method: 'POST',
        headers: {
          Authorization: `Key ${falKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content_type: targetMime,
          file_name: `upload-${Date.now()}.${targetExt}`,
        }),
      }
    );

    if (!initiateRes.ok) {
      const err = await initiateRes.text();
      console.error('Upload initiate failed:', initiateRes.status, err);
      return NextResponse.json(
        { error: `Upload initiate failed (${initiateRes.status}): ${err}` },
        { status: 500 }
      );
    }

    const { upload_url, file_url: imageUrl } = await initiateRes.json();
    console.log('Got upload URL, uploading file...');

    // Step 2: PUT the image binary to the signed upload URL
    const putRes = await fetch(upload_url, {
      method: 'PUT',
      headers: { 'Content-Type': targetMime },
      body: targetBuffer,
    });

    if (!putRes.ok) {
      const err = await putRes.text();
      console.error('File PUT failed:', putRes.status, err);
      return NextResponse.json(
        { error: `File upload failed (${putRes.status}): ${err}` },
        { status: 500 }
      );
    }

    console.log('File uploaded. URL:', imageUrl);

    // Step 3: Build the prompt
    const finalPrompt = prompt.trim()
      ? prompt.trim()
      : 'Transform this person into a fun, vibrant cartoon mascot character. Bold outlines, bright colours, friendly expression. Keep the face recognisable.';

    // Step 4: Call fal.ai flux-pro/kontext with the uploaded file URL
    console.log('Calling fal.ai flux-pro/kontext...');
    const falRes = await fetch('https://fal.run/fal-ai/flux-pro/kontext', {
      method: 'POST',
      headers: {
        Authorization: `Key ${falKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url: imageUrl,
        prompt: finalPrompt,
        num_inference_steps: 28,
        guidance_scale: 3.5,
        num_images: 1,
        output_format: 'jpeg',
        output_quality: 92,
        enable_safety_checker: false,
      }),
    });

    if (!falRes.ok) {
      const errorText = await falRes.text();
      console.error('fal.ai error:', falRes.status, errorText);

      if (falRes.status === 401) {
        return NextResponse.json({ error: 'Invalid FAL_KEY — check your .env.local' }, { status: 401 });
      }
      if (falRes.status === 429) {
        return NextResponse.json({ error: 'Rate limited — wait a moment and try again' }, { status: 429 });
      }

      return NextResponse.json(
        { error: `fal.ai error (${falRes.status}): ${errorText}` },
        { status: 500 }
      );
    }

    const result = await falRes.json();
    console.log('fal.ai response keys:', Object.keys(result));

    // fal.ai returns: { images: [{ url: '...' }], ... }
    const images = result.images;
    if (!images || images.length === 0) {
      console.error('Unexpected fal.ai response:', JSON.stringify(result));
      return NextResponse.json({ error: 'No image returned from fal.ai' }, { status: 500 });
    }

    return NextResponse.json({ image: images[0].url });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Unexpected route error:', message);
    return NextResponse.json({ error: `Server error: ${message}` }, { status: 500 });
  }
}
