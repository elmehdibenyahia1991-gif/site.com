import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase-server';

export async function GET() {
  const supabase = createServerSupabase();
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const supabase = createServerSupabase();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get('file') as File;
  if (!file) return NextResponse.json({ error: 'File is required' }, { status: 400 });

  const fileName = `${auth.user.id}/${Date.now()}-${file.name}`;
  const upload = await supabase.storage.from('products').upload(fileName, file, { upsert: false });
  if (upload.error) return NextResponse.json({ error: upload.error.message }, { status: 400 });

  const payload = {
    title: String(formData.get('title')),
    description: String(formData.get('description')),
    price: Number(formData.get('price')),
    category: String(formData.get('category')),
    file_url: fileName,
    cover_image: String(formData.get('coverImage') || ''),
    seller_id: auth.user.id,
    bundle_price: formData.get('bundlePrice') ? Number(formData.get('bundlePrice')) : null,
    bundle_label: String(formData.get('bundleLabel') || '') || null
  };

  const { error } = await supabase.from('products').insert(payload);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ message: 'Product created successfully' });
}
