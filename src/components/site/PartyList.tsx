import { getPack } from "@/config/site";
import { roleLabel, type PartyMember } from "@/lib/party";

/** Liste des personnes d'un cortège. */
export function PartyList({ party, compact = false }: { party: PartyMember[]; compact?: boolean }) {
  return (
    <ol className={compact ? "space-y-1" : "space-y-1.5"}>
      {party.map((m, i) => (
        <li key={i} className="flex items-baseline gap-3">
          <span className="index w-5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
          <span>
            {roleLabel(m.role)}
            <span className="text-sand"> — {getPack(m.packId)?.name ?? "formule à définir"}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
