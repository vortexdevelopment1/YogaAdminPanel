// Root page that redirects visitors to the login route

import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/login");
}
