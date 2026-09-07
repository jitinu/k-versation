import { redirect } from "next/navigation";
import { isHostAuthenticated } from "@/lib/host-auth";

export default async function HostIndex() {
  redirect((await isHostAuthenticated()) ? "/host/dashboard" : "/host/login");
}
