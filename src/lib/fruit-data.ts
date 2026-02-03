export interface Fruit {
    id: number;
    name: string;
    type: string; // Nhiễm thể
    quantity: number;
    variants: string[];
}

export const mockFruits: Fruit[] = [
    {
        id: 1,
        name: "Trái Lửa",
        type: "Logia",
        quantity: 3,
        variants: ["Lửa thường", "Lửa xanh", "Lửa địa ngục"]
    },
    {
        id: 2,
        name: "Trái Cao Su",
        type: "Paramecia",
        quantity: 1,
        variants: ["Gear 2", "Gear 3", "Gear 4", "Gear 5"]
    },
    {
        id: 3,
        name: "Trái Băng",
        type: "Logia",
        quantity: 2,
        variants: ["Đóng băng", "Kỷ băng hà"]
    }
];
