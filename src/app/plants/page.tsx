import { auth } from "@/lib/auth/server";
import SignInForm from "../sign-in/page";
import InventoryTable from "@/components/ui/InventoryTable";
import { getPlants } from "@/app/actions/plant.action";

export const dynamic = "force-dynamic";

export default async function PlantsPage() {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    return <SignInForm />;
  }

  const plants = await getPlants();

  return <InventoryTable plants={plants} />;
}
