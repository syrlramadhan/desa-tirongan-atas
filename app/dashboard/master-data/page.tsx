import { redirect } from "next/navigation";

export default function MasterDataPage() {
  // Redirect ke halaman Data Penduduk sebagai default
  redirect("/dashboard/master-data/penduduk");
}
