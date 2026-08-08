"use client";

import { authClient } from "@/lib/auth/client";
import SignInForm from "../sign-in/page";
import InventoryTable from "@/components/ui/InventoryTable";

function Plant() {
  const { data: session } = authClient.useSession();
  return session?.user ? <InventoryTable /> : <SignInForm />;
}

export default Plant;
