"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { acceptProposalByToken } from "@/lib/actions/proposals";

export function ProposalAcceptButton({ token }: { token: string }) {
  const [pending, start] = useTransition();
  const [done, setDone] = useState<"accepted" | "rejected" | null>(null);

  function handle(action: "accept" | "reject") {
    start(async () => {
      try {
        if (action === "accept") {
          await acceptProposalByToken(token);
          toast.success("Teklif kabul edildi!");
          setDone("accepted");
        } else {
          setDone("rejected");
          toast.info("Reddetmek için freelancer ile iletişime geçin.");
        }
      } catch (e) {
        toast.error((e as Error).message);
      }
    });
  }

  if (done === "accepted") {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-green-500/10 px-4 py-3 text-sm text-green-400">
        <CheckCircle className="h-4 w-4" />
        Teklif kabul edildi. Teşekkürler!
      </div>
    );
  }

  if (done === "rejected") {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-bg-elevated px-4 py-3 text-sm text-text-secondary">
        <XCircle className="h-4 w-4" />
        Freelancer ile iletişime geçin.
      </div>
    );
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
