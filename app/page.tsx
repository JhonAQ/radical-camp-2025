import { headers } from "next/headers";
import DesktopLanding from "@/components/app/DesktopLanding";
import MobileApp from "@/components/app/MobileApp";

export default async function HomePage() {
  const headersList = await headers();
  const deviceType = headersList.get("x-device-type");

  if (deviceType === "desktop") {
    return <DesktopLanding />;
  }

  return <MobileApp />;
}
