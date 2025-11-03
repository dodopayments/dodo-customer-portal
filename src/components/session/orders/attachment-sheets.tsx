import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Download, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import { DigitalProductResponse } from "../product";

interface AttachmentsSheetProps {
  isAttachmentsSheetOpen: boolean;
  setIsAttachmentsSheetOpen: (open: boolean) => void;
  digitalProductsLoading: boolean;
  digitalProducts: DigitalProductResponse | null;
  error: string | null;
}

export const AttachmentsSheet = ({
  isAttachmentsSheetOpen,
  setIsAttachmentsSheetOpen,
  digitalProductsLoading,
  digitalProducts,
  error,
}: AttachmentsSheetProps) => {
  return (
    <div className="flex flex-col gap-4">
      <Sheet
        open={isAttachmentsSheetOpen}
        onOpenChange={setIsAttachmentsSheetOpen}
      >
        <SheetTrigger asChild>
          <Button variant="secondary" className="w-fit">
            <File />
            Attachments
          </Button>
        </SheetTrigger>
        <SheetContent className="sm:max-w-md mx-auto">
          <SheetHeader>
            <SheetTitle>Digital Products</SheetTitle>
            <SheetDescription>
              Download your digital products for
            </SheetDescription>
          </SheetHeader>
          <Separator className="mt-4" />
          <div className="py-4">
            {error && <p className="text-sm text-destructive mb-3">{error}</p>}
            {digitalProductsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span className="text-sm text-muted-foreground">
                    Loading digital products...
                  </span>
                </div>
              </div>
            ) : (
              (() => {
                const deliverable = digitalProducts?.deliverable;
                const files = deliverable?.files ?? [];
                const hasFiles = files.length > 0;
                const externalUrl = deliverable?.external_url;
                const instructions = deliverable?.instructions;

                if (
                  !digitalProducts ||
                  (!hasFiles && !externalUrl && !instructions)
                ) {
                  return (
                    <p className="text-sm text-muted-foreground">
                      No digital products available.
                    </p>
                  );
                }

                return (
                  <div className="space-y-6">
                    {hasFiles && (
                      <div>
                        <h4 className="font-medium mb-2">Files</h4>
                        <div className="space-y-2">
                          {files.map((file) => (
                            <div
                              key={file.file_id}
                              className="flex items-center justify-between p-2 border rounded"
                            >
                              <div className="flex items-center gap-2">
                                <File className="w-4 h-4" />
                                <span className="text-sm">
                                  {file.file_name}
                                </span>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(file.url, "_blank")}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {externalUrl && (
                      <div>
                        <h4 className="font-medium mb-2">External link</h4>
                        <Button
                          variant="secondary"
                          onClick={() => window.open(externalUrl, "_blank")}
                        >
                          Open
                        </Button>
                      </div>
                    )}

                    {instructions && (
                      <div>
                        <h4 className="font-medium mb-2">Instructions</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">
                          {instructions}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
