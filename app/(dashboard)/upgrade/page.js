import { Suspense } from "react";
import UpgradeClient from "./UpgradeClient";

export default function UpgradePage() {
  return (
    <Suspense>
      <UpgradeClient />
    </Suspense>
  );
}
