import { Warning } from "@mui/icons-material";
import { Check, CheckCheck, Clock3 } from "lucide-react";

export function MessageStatus({ status }: { status?: string }) {
  if (status === "sending") {
    return <Clock3 size={12} className="text-white/70" />;
  }

  if (status === "sent") {
    return <Check size={14} className="text-white/70" />;
  }

  if (status === "delivered") {
    return <CheckCheck size={14} className="text-white/70" />;
  }

  if (status === "seen") {
    return <CheckCheck size={14} className="text-sky-400" />;
  }

  if (status === "failed") {
    return <Warning fontSize="small" className="text-red-500/65" />;
  }

  return null;
}
