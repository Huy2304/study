// fruit-data.ts
export interface Bienthe {
  id: number;
  name: string;
}

export interface Traicay {
  id: number;
  name: string;
}

export interface Nongsan {
  id: number;
  traicay_id: number;
  quantity: number;
  price: number;
  created_at?: string;

  // Quan hệ
  traicay: Traicay | null;        
  bienthes: Bienthe[];        

}