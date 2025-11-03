import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LicenseKeyResponse } from "../product";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { getBadge } from "@/lib/badge-helper";
import { Badge, BadgeVariant } from "@/components/ui/badge";
import { parseIsoDate } from "@/lib/date-helper";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface LicenseSheetsProps {
  isLicenseSheetOpen: boolean;
  setIsLicenseSheetOpen: (open: boolean) => void;
  licenseKeys: LicenseKeyResponse[];
}

export const LicenseSheets = ({
  isLicenseSheetOpen,
  setIsLicenseSheetOpen,
  licenseKeys,
}: LicenseSheetsProps) => {
  const [visibleById, setVisibleById] = useState<Record<string, boolean>>({});

  const toggleVisibility = (id: string) =>
    setVisibleById((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="flex flex-col gap-4">
      <Sheet open={isLicenseSheetOpen} onOpenChange={setIsLicenseSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="secondary" className="w-fit">
            License Keys
          </Button>
        </SheetTrigger>
        <SheetContent className="sm:max-w-md mx-auto">
          <SheetHeader>
            <SheetTitle>Migrate - License Key</SheetTitle>
          </SheetHeader>
          <Separator className="my-4" />
          {licenseKeys.map((licenseKey: LicenseKeyResponse) => {
            const isVisible = !!visibleById[licenseKey.id];
            return (
              <Card key={licenseKey.id} className="p-4">
                <CardHeader className="p-0 pb-3">
                  <CardTitle className="text-base">License Key</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-3">
                    <p className="text-sm font-medium text-text-secondary">
                      {isVisible ? (
                        <span className="font-mono text-text-primary">
                          {licenseKey.key}
                        </span>
                      ) : (
                        <span className="italic">
                          Click to view license key
                        </span>
                      )}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-text-secondary"
                      onClick={() => toggleVisibility(licenseKey.id)}
                      aria-label={
                        isVisible ? "Hide license key" : "Show license key"
                      }
                    >
                      {isVisible ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-row justify-between p-0 pt-3">
                  <Badge
                    variant={
                      getBadge(licenseKey.status, false, true)
                        .color as BadgeVariant
                    }
                  >
                    {getBadge(licenseKey.status, false, true).message}
                  </Badge>
                  <p className="text-sm text-text-secondary">
                    Expires {parseIsoDate(licenseKey.expires_at)}
                  </p>
                </CardFooter>
              </Card>
            );
          })}
        </SheetContent>
      </Sheet>
    </div>
  );
};
