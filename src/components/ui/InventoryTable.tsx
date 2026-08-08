"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Leaf,
  Package,
  Plus,
  Search,
  Sprout,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "./input";
import { Badge } from "./badge";
import { Button } from "./button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

type PlantStatus = "Available" | "Low Stock" | "Out of Stock";

type Plant = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: PlantStatus;
};

const plants: Plant[] = [
  {
    id: 1,
    name: "Aloe Vera",
    category: "Succulent",
    price: 10,
    stock: 20,
    status: "Available",
  },
  {
    id: 2,
    name: "Monstera Deliciosa",
    category: "Tropical",
    price: 45,
    stock: 8,
    status: "Available",
  },
  {
    id: 3,
    name: "Snake Plant",
    category: "Indoor",
    price: 18,
    stock: 3,
    status: "Low Stock",
  },
  {
    id: 4,
    name: "Fiddle Leaf Fig",
    category: "Indoor",
    price: 55,
    stock: 0,
    status: "Out of Stock",
  },
  {
    id: 5,
    name: "Basil",
    category: "Herb",
    price: 6,
    stock: 32,
    status: "Available",
  },
  {
    id: 6,
    name: "Peace Lily",
    category: "Flowering",
    price: 22,
    stock: 5,
    status: "Low Stock",
  },
];

const categories = [
  "All categories",
  "Succulent",
  "Tropical",
  "Indoor",
  "Herb",
  "Flowering",
];

function statusVariant(status: PlantStatus) {
  if (status === "Available") return "secondary";
  if (status === "Low Stock") return "outline";
  return "destructive";
}

function InventoryTable() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");

  const filteredPlants = useMemo(() => {
    return plants.filter((plant) => {
      const matchesSearch = plant.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        category === "All categories" || plant.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const totalStock = plants.reduce((sum, plant) => sum + plant.stock, 0);
  const availableCount = plants.filter(
    (plant) => plant.status === "Available"
  ).length;
  const lowStockCount = plants.filter(
    (plant) => plant.status === "Low Stock"
  ).length;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-primary">
            <Sprout className="size-5" />
            <span className="text-sm font-medium">Plantventory</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Plant Inventory
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Track stock levels, categories, and availability across your
            nursery.
          </p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus />
          Add Plant
        </Button>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Plants</p>
            <Leaf className="size-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-2xl font-semibold">{plants.length}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">In Stock</p>
            <Package className="size-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-2xl font-semibold">{totalStock} units</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Needs Attention</p>
            <AlertTriangle className="size-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-2xl font-semibold">
            {lowStockCount + plants.filter((p) => p.status === "Out of Stock").length}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {availableCount} available right now
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search plants..."
              className="pl-9"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="w-full sm:w-56">
            <Combobox
              items={categories}
              value={category}
              onValueChange={(value) => setCategory(value ?? "All categories")}
            >
              <ComboboxInput placeholder="Filter by category" />
              <ComboboxContent>
                <ComboboxEmpty>No categories found.</ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-4">Plant</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-4 text-right">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlants.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-muted-foreground"
                >
                  No plants match your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredPlants.map((plant) => (
                <TableRow key={plant.id}>
                  <TableCell className="pl-4 font-medium">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Leaf className="size-4" />
                      </div>
                      <span>{plant.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{plant.category}</Badge>
                  </TableCell>
                  <TableCell>${plant.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <span
                      className={
                        plant.stock <= 5 && plant.stock > 0
                          ? "font-medium text-amber-600 dark:text-amber-400"
                          : plant.stock === 0
                            ? "font-medium text-destructive"
                            : undefined
                      }
                    >
                      {plant.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(plant.status)}>
                      {plant.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-4 text-right font-medium">
                    ${(plant.price * plant.stock).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="border-t px-4 py-3 text-sm text-muted-foreground">
          Showing {filteredPlants.length} of {plants.length} plants
        </div>
      </div>
    </div>
  );
}

export default InventoryTable;
