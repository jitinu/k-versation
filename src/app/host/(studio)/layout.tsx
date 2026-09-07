import { redirect } from "next/navigation";
import { HostShell } from "@/components/host-shell";
import { isHostAuthenticated } from "@/lib/host-auth";

export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  if (!(await isHostAuthenticated())) redirect("/host/login");
  return <HostShell>{children}</HostShell>;
}
