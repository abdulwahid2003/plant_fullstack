"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Leaf,
  Package,
  Pencil,
  Plus,
  Search,
  Sprout,
  Trash2,
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
import {
  getPlantStatus,
  type PlantRecord,
  type PlantStatus,
} from "@/types/plant";

type InventoryPlant = PlantRecord & {
  status: PlantStatus;
};

function statusVariant(status: PlantStatus) {
  if (status === "Available") return "secondary";
  if (status === "Low Stock") return "outline";
  return "destructive";
}

function InventoryTable({ plants }: { plants: PlantRecord[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");

  const inventoryPlants: InventoryPlant[] = useMemo(
    () =>
      plants.map((plant) => ({
        ...plant,
        status: getPlantStatus(plant.stock),
      })),
    [plants]
  );

  const categories = useMemo(
    () => [
      "All categories",
      ...Array.from(new Set(plants.map((plant) => plant.category))).sort(),
    ],
    [plants]
  );

  const filteredPlants = useMemo(() => {
    return inventoryPlants.filter((plant) => {
      const matchesSearch = plant.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        category === "All categories" || plant.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [inventoryPlants, search, category]);

  const totalStock = inventoryPlants.reduce(
    (sum, plant) => sum + plant.stock,
    0
  );
  const availableCount = inventoryPlants.filter(
    (plant) => plant.status === "Available"
  ).length;
  const lowStockCount = inventoryPlants.filter(
    (plant) => plant.status === "Low Stock"
  ).length;
  const outOfStockCount = inventoryPlants.filter(
    (plant) => plant.status === "Out of Stock"
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
            Live inventory from your Neon Postgres database.
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
          <p className="mt-2 text-2xl font-semibold">{inventoryPlants.length}</p>
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
            {lowStockCount + outOfStockCount}
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
              <TableHead className="text-right">Actions</TableHead>
              <TableHead className="pr-4 text-right">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlants.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-32 text-center text-muted-foreground"
                >
                  {inventoryPlants.length === 0
                    ? "No plants in your inventory yet."
                    : "No plants match your search."}
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
                      <div>
                        <p>{plant.name}</p>
                        {plant.description && (
                          <p className="text-xs text-muted-foreground">
                            {plant.description}
                          </p>
                        )}
                      </div>
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
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon-sm" aria-label="Edit plant">
                        <Pencil />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Delete plant"
                      >
                        <Trash2 />
                      </Button>
                    </div>
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
          Showing {filteredPlants.length} of {inventoryPlants.length} plants
        </div>
      </div>
    </div>
  );
}

export default InventoryTable;
