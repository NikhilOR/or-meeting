const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseUrl = rawSupabaseUrl.replace(/\/$/, "");
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfigError = !rawSupabaseUrl
  ? "Missing VITE_SUPABASE_URL."
  : !rawSupabaseUrl.startsWith("https://")
    ? "VITE_SUPABASE_URL must be the HTTPS Project URL, not the PostgreSQL database URL."
    : !supabaseAnonKey
      ? "Missing VITE_SUPABASE_ANON_KEY."
      : "";

export const hasSupabaseConfig = !supabaseConfigError;

function toRow(meeting) {
  return {
    id: meeting.id,
    title: meeting.title || "",
    meeting_date: meeting.date || null,
    attendees: meeting.attendees || "",
    tags: meeting.tags || [],
    body: meeting.body || "",
    actions: meeting.actions || [],
    updated_at: new Date().toISOString(),
  };
}

function fromRow(row) {
  return {
    id: row.id,
    title: row.title || "",
    date: row.meeting_date || "",
    attendees: row.attendees || "",
    tags: row.tags || [],
    body: row.body || "",
    actions: row.actions || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function supabaseRest(path, options = {}) {
  if (!hasSupabaseConfig) throw new Error(supabaseConfigError);
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Supabase request failed");
  }
  if (response.status === 204) return null;
  return response.json();
}

export async function fetchMeetingsFromDb() {
  if (!hasSupabaseConfig) return null;
  const data = await supabaseRest("or_meetings?select=*&order=meeting_date.desc");
  return (data || []).map(fromRow);
}

export async function upsertMeetingToDb(meeting) {
  if (!hasSupabaseConfig) return null;
  const data = await supabaseRest("or_meetings?on_conflict=id&select=*", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(toRow(meeting)),
  });
  return fromRow(Array.isArray(data) ? data[0] : data);
}

export async function deleteMeetingFromDb(id) {
  if (!hasSupabaseConfig) return null;
  await supabaseRest(`or_meetings?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { Prefer: "return=minimal" },
  });
  return true;
}
