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
    const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
      location
    )}`;

    const geoRes = await fetch(geoUrl, {
      headers: {
        // Nominatim requires a proper User-Agent
        'User-Agent': 'city-projects-app/1.0 (redcharizard1@gmail.com)',
      },
    });

    if (!geoRes.ok) {
      console.error('Geocoding failed', await geoRes.text());
      return NextResponse.json(
        { error: 'Failed to geocode location' },
        { status: 502 }
      );
    }

    const geoData: any[] = await geoRes.json();

    if (!geoData.length) {
      return NextResponse.json(
        { error: 'Could not find coordinates for this location' },
        { status: 400 }
      );
    }

    const latitude = parseFloat(geoData[0].lat);
    const longitude = parseFloat(geoData[0].lon);

    // 3️⃣ Insert into Supabase "projects" table
    //    Column names must match your Supabase table:
    //    id, title, designer, location, beneficiary, status, total_value,
    //    realization_duration_months, execution_duration_months,
    //    latest_decision_url, latest_change, category, latitude, longitude, ...
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
  } catch (err: any) {
    console.error('Unexpected error', err);
    return NextResponse.json(
      { error: 'Unexpected server error' },
      { status: 500 }
    );
  }
}
