"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { acceptProposalByToken } from "@/lib/actions/proposals";

export function ProposalAcceptButton({ token }: { token: string }) {
  const [pending, start] = useTransition();

  function handle(action: "accept" | "reject") {
    start(async () => {
      try {
        if (action === "accept") {
          await acceptProposalByToken(token);
          toast.success("Teklif kabul edildi!");
        } else {
          toast.info("Reddetmek için freelancer ile iletişime geçin.");
        }
      } catch (e) {
        toast.error((e as Error).message);
      }
    });
  }

  return (
    <div className="flex gap-3 pt-2">
      <Button
        className="flex-1 gap-2"
        loading={pending}
        onClick={() => handle("accept")}
      >
        <CheckCircle className="h-4 w-4" />
        Teklifi Kabul Et
      </Button>
      <Button
        variant="ghost"
        className="flex-1 gap-2"
        onClick={() => handle("reject")}
        disabled={pending}
      >
        <XCircle className="h-4 w-4" />
        Reddet
      </Button>
    </div>
  );
}
