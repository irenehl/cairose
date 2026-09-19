import type { Competitor } from "../types";

type CompetitorTableProps = {
  competitors: Competitor[];
  onSelect: (id: string) => void;
};

export function CompetitorTable({ competitors, onSelect }: CompetitorTableProps) {
  if (competitors.length === 0) {
    return <p className="p-4 text-sm text-stone-500">sin dato</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[880px] border-collapse text-left text-sm">
        <thead className="bg-stone-100 text-xs tracking-wide text-stone-500 uppercase">
          <tr>
            <th className="px-3 py-2 font-medium">Nombre</th>
            <th className="px-3 py-2 font-medium">Geo</th>
            <th className="px-3 py-2 font-medium">Modelo</th>
            <th className="px-3 py-2 font-medium">Precio</th>
            <th className="px-3 py-2 font-medium">Sub</th>
            <th className="px-3 py-2 font-medium">Gift</th>
            <th className="px-3 py-2 font-medium">Nota</th>
          </tr>
        </thead>
        <tbody>
          {competitors.map((row) => (
            <tr
              key={row.id}
              className="cursor-pointer border-t border-stone-200 bg-white hover:bg-stone-50"
              onClick={() => onSelect(row.id)}
            >
              <td className="px-3 py-2 align-top font-medium text-stone-900">{row.name}</td>
              <td className="px-3 py-2 align-top">{row.geo}</td>
              <td className="px-3 py-2 align-top">{row.model}</td>
              <td className="px-3 py-2 align-top">{row.price}</td>
              <td className="px-3 py-2 align-top">{row.sub}</td>
              <td className="px-3 py-2 align-top">{row.gift}</td>
              <td className="px-3 py-2 align-top text-stone-700">{row.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
