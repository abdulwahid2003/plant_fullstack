export type PlantRecord = {
  id: string;
  name: string;
  description: string | null;
  category: string;
  stock: number;
  price: number;
  imageUrl: string | null;
};

export type PlantStatus = "Available" | "Low Stock" | "Out of Stock";

export function getPlantStatus(stock: number): PlantStatus {
  if (stock === 0) return "Out of Stock";
  if (stock <= 5) return "Low Stock";
  return "Available";
}
