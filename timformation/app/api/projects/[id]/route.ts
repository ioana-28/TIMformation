import { NextResponse } from 'next/server';
import { createClient } from '@/libs/supabase/server';

type ProjectInput = Partial<{
    id: number;
    location_point: string;
  title: string;
  designer: string | null;
  location: string;
  beneficiary: string | null;
  status: string;
  category: string | null;
  total_value: number | null;
  realization_duration_months: number | null;
  execution_duration_months: number | null;
  latest_decision_url: string | null;
  latest_change: string | null;
}>;

export async function PATCH(req: Request, { params }: { params: { id: number } }) {
  try {
    // ✅ Convert string to number
    
    // if (isNaN(id)) return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });

    const body = (await req.json()) as ProjectInput;
    const id = body.id;
    const {
  location_point, // ignore
  ...updateData
} = body;
    
    const supabase = await createClient();

    let latitude: number | null = null;
    let longitude: number | null = null;

    if (body.location) {
      const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(body.location)}`;
      const geoRes = await fetch(geoUrl, {
        headers: { 'User-Agent': 'city-projects-app/1.0 (redcharizard1@gmail.com)' },
      });

      if (!geoRes.ok) return NextResponse.json({ error: 'Failed to geocode location' }, { status: 502 });

      const geoData: any[] = await geoRes.json();
      if (!geoData.length) return NextResponse.json({ error: 'Could not find coordinates for this location' }, { status: 400 });

      latitude = parseFloat(geoData[0].lat);
      longitude = parseFloat(geoData[0].lon);
    }
    console.log(id);

    const { data, error } = await supabase
      .from('projects')
      .update({
        ...updateData,
        designer: body.designer ?? null,
        beneficiary: body.beneficiary ?? null,
        category: body.category ?? null,
        total_value: body.total_value ?? null,
        realization_duration_months: body.realization_duration_months ?? null,
        execution_duration_months: body.execution_duration_months ?? null,
        latest_decision_url: body.latest_decision_url ?? null,
        latest_change: body.latest_change ?? null,
        latitude,
        longitude,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: 'Failed to update project', details: error.message }, { status: 500 });

    return NextResponse.json({ project: data });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}
