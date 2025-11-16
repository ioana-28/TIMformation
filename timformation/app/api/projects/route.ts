import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// ⬇️ adjust this path to wherever your server.ts is
import { createClient } from '@/libs/supabase/server';

type ProjectInput = {
  title: string;
  designer?: string;
  location: string;
  beneficiary?: string;
  status: string;
  total_value?: number;
  realization_duration_months?: number;
  execution_duration_months?: number;
  latest_decision_url?: string;
  latest_change?: string;
  category?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ProjectInput;

    const {
      title,
      designer,
      location,
      beneficiary,
      status,
      total_value,
      realization_duration_months,
      execution_duration_months,
      latest_decision_url,
      latest_change,
      category,
    } = body;

    if (!title || !location || !status) {
      return NextResponse.json(
        { error: 'title, location and status are required' },
        { status: 400 }
      );
    }

    // 1️⃣ Create Supabase server client using your existing helper
    const cookieStore = cookies();
    const supabase = await createClient();

    // 2️⃣ Geocode location with OpenStreetMap (Nominatim)
    // Add "Timișoara" context to improve search accuracy
    const searchQuery = location.toLowerCase().includes('timișoara') || location.toLowerCase().includes('timisoara')
      ? location
      : `${location}, Timișoara, Romania`;

    const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(searchQuery)}`;

    console.log('🌍 Geocoding query:', searchQuery);

    const geoRes = await fetch(geoUrl, {
      headers: {
        'User-Agent': 'TIMformation-app/1.0',
      },
    });

    console.log('🌍 Response status:', geoRes.status);

    if (!geoRes.ok) {
      const text = await geoRes.text();
      console.error('Geocoding HTTP error:', { status: geoRes.status, body: text.substring(0, 200) });
      return NextResponse.json(
        { error: `Geocoding error (${geoRes.status}). Try "Piața Unirii, Timișoara"` },
        { status: 502 }
      );
    }

    let geoData: Array<{ lat: string; lon: string }> = [];
    try {
      geoData = await geoRes.json();
    } catch (e) {
      console.error('Failed to parse response:', e);
      return NextResponse.json(
        { error: 'Geocoding service returned invalid data' },
        { status: 502 }
      );
    }

    console.log('Geocoding results:', { query: searchQuery, count: geoData.length });

    if (!geoData.length) {
      return NextResponse.json(
        { error: `No location found for "${location}". Try: "Piața Unirii, Timișoara"` },
        { status: 400 }
      );
    }

    const latitude = parseFloat(geoData[0].lat);
    const longitude = parseFloat(geoData[0].lon);

    const { data, error } = await supabase
      .from('projects')
      .insert({
        title,
        designer,
        location,
        beneficiary,
        status,
        total_value: total_value ?? null,
        realization_duration_months: realization_duration_months ?? null,
        execution_duration_months: execution_duration_months ?? null,
        latest_decision_url: latest_decision_url ?? null,
        latest_change: latest_change ?? null,
        category,
        latitude,
        longitude,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error', error);
      return NextResponse.json(
        { error: 'Failed to insert project', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ project: data }, { status: 201 });
  } catch (err) {
    console.error('Unexpected error', err);
    return NextResponse.json(
      { error: 'Unexpected server error' },
      { status: 500 }
    );
  }
}

// Allow fetching projects via GET at /api/projects
export async function GET(req: Request) {
  try {
    const supabase = await createClient();

    // You can extend this to read query params for filtering/pagination
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let query = supabase.from('projects').select('*');
    if (status) query = query.eq('status', status);

    const { data, error } = await query.order('id', { ascending: false });

    if (error) {
      console.error('Supabase fetch error', error);
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }

    return NextResponse.json({ projects: data }, { status: 200 });
  } catch (err) {
    console.error('Unexpected error in GET /api/projects', err);
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}
