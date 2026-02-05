"use server";

import { createClient } from "@/utils/suspabase/server"; // file server.ts bạn đã có
import { revalidatePath } from "next/cache";
import { Fruit } from "@/lib/fruit-data";

export async function getFruits(): Promise<Fruit[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("nongsan")
        .select("*")
        .order("created_at", { ascending: false }); // hoặc id desc

    if (error) {
        console.error("Error fetching nongsan:", error);
        return [];
    }
    return data || [];
}

export async function addFruit(fruit: Omit<Fruit, "id">): Promise<Fruit | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("nongsan")
        .insert({
            name: fruit.name,
            type: fruit.type,
            quantity: fruit.quantity,
            variants: fruit.variants,
        })
        .select()
        .single();

    if (error) {
        console.error("Add fruit error:", error);
        return null;
    }

    revalidatePath("/nongsan");
    revalidatePath("/admin");
    return data;
}

export async function updateFruit(fruit: Fruit): Promise<Fruit | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("nongsan")
        .update({
            name: fruit.name,
            type: fruit.type,
            quantity: fruit.quantity,
            variants: fruit.variants,
        })
        .eq("id", fruit.id)
        .select()
        .single();

    if (error) {
        console.error("Update fruit error:", error);
        return null;
    }

    revalidatePath("/nongsan");
    revalidatePath("/admin");
    return data;
}

export async function deleteFruit(id: number): Promise<boolean> {
    const supabase = await createClient();
    const { error } = await supabase.from("nongsan").delete().eq("id", id);

    if (error) {
        console.error("Delete fruit error:", error);
        return false;
    }

    revalidatePath("/nongsan");
    revalidatePath("/admin");
    return true;
}