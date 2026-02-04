export interface Fruit {
    id: number;
    name: string;
    type: string;
    quantity: number;
    variants: string[];
    created_at?: string; // optional, từ Supabase
}