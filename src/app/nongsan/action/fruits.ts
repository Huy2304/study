"use server";

import { createClient } from "@/utils/suspabase/server";
import { revalidatePath } from "next/cache";
import { Nongsan, Traicay, Bienthe } from "@/app/nongsan/data/fruit-data";

type NongsanRow = {
  id: number;
  traicay_id: number;
  quantity: number;
  price: number;
  created_at: string | null;

  traicay: Traicay | null;
  bienthes: {
    bienthe: Bienthe[] | null;
  }[];
};

/* ======================================================
   Mapper
====================================================== */

function mapNongsanRow(row: NongsanRow): Nongsan {
  return {
    id: row.id,
    traicay_id: row.traicay_id,
    quantity: row.quantity,
    price: row.price,
    created_at: row.created_at ?? undefined,

    traicay: row.traicay,
    bienthes: row.bienthes
      .flatMap((r) => r.bienthe ?? []),
  };
}

/* ======================================================
   Queries
====================================================== */

export async function getNongsans(): Promise<Nongsan[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("nongsan")
    .select(`
      id,
      traicay_id,
      quantity,
      price,
      created_at,
      traicay:traicay_id (
        id,
        name
      ),
      bienthes:nongsan_bienthe (
        bienthe:bienthe_id (id, name)
      )
    `)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  console.log('RAW SUPABASE DATA:', data);

  return (data as unknown as NongsanRow[]).map(mapNongsanRow);
}

/* ======================================================
   Create
====================================================== */

export async function createNongsan(payload: {
  traicay_id: number;
  bienthe_ids: number[];
  quantity: number;
  price: number;
}): Promise<Nongsan | null> {
  const supabase = await createClient();

  const { data: inserted, error } = await supabase
    .from("nongsan")
    .insert({
      traicay_id: payload.traicay_id,
      quantity: payload.quantity,
      price: payload.price,
    })
    .select(`
      id,
      traicay_id,
      quantity,
      price,
      created_at,
      traicay:traicay_id (id, name)
    `)
    .single();

  if (error || !inserted) return null;

  if (payload.bienthe_ids.length) {
    await supabase.from("nongsan_bienthe").insert(
      payload.bienthe_ids.map((bienthe_id) => ({
        nongsan_id: inserted.id,
        bienthe_id,
      }))
    );
  }

  revalidatePath("/nongsan");
  revalidatePath("/admin");

  const { data: fullData } = await supabase
    .from("nongsan")
    .select(`
      id,
      traicay_id,
      quantity,
      price,
      created_at,
      traicay:traicay_id (id, name),
      bienthes:nongsan_bienthe (
        bienthe:bienthe_id (id, name)
      )
    `)
    .eq("id", inserted.id)
    .single();

  return fullData ? mapNongsanRow(fullData as unknown as NongsanRow) : null;
}

/* ======================================================
   Update
====================================================== */

export async function updateNongsan(
  id: number,
  payload: {
    traicay_id: number;
    bienthe_ids: number[];
    quantity: number;
    price: number;
  }
): Promise<Nongsan | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("nongsan")
    .update({
      traicay_id: payload.traicay_id,
      quantity: payload.quantity,
      price: payload.price,
    })
    .eq("id", id)
    .select(`
      id,
      traicay_id,
      quantity,
      price,
      created_at,
      traicay (
        id,
        name
      ),
    `)
    .single();

  if (error || !data) return null;

  await supabase.from("nongsan_bienthe").delete().eq("nongsan_id", id);

  if (payload.bienthe_ids.length) {
    await supabase.from("nongsan_bienthe").insert(
      payload.bienthe_ids.map((bienthe_id) => ({
        nongsan_id: id,
        bienthe_id,
      }))
    );
  }

  revalidatePath("/nongsan");
  revalidatePath("/admin");

  const { data: fullData } = await supabase
    .from("nongsan")
    .select(`
      id,
      traicay_id,
      quantity,
      price,
      created_at,
      traicay:traicay_id (id, name),
      bienthes:nongsan_bienthe (
        bienthe:bienthe_id (id, name)
      )
    `)
    .eq("id", id)
    .single();

  return fullData ? mapNongsanRow(fullData as unknown as NongsanRow) : null;
}

/* ======================================================
   Delete
====================================================== */

export async function deleteNongsan(id: number): Promise<boolean> {
  const supabase = await createClient();

  await supabase.from("nongsan_bienthe").delete().eq("nongsan_id", id);

  const { error } = await supabase.from("nongsan").delete().eq("id", id);

  if (error) return false;

  revalidatePath("/nongsan");
  revalidatePath("/admin");
  return true;
}

/* ======================================================
   Lookup tables
====================================================== */

export async function getTraicays(): Promise<Traicay[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("traicay").select("id, name").order("name");
  return data ?? [];
}

export async function getBienthes(): Promise<Bienthe[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("bienthe").select("id, name").order("name");
  return data ?? [];
}
