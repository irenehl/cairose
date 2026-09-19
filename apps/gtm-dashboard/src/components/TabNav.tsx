import { TAB_LABELS, type TabId } from "../types";

const TABS: TabId[] = ["b2b", "icp", "comp", "b2c", "semana", "links"];

type TabNavProps = {
  tab: TabId;
  onChange: (tab: TabId) => void;
};

export function TabNav({ tab, onChange }: TabNavProps) {
  return (
    <nav className="flex flex-wrap gap-1 border-b border-stone-300 bg-white px-3 py-2">
      {TABS.map((id) => {
        const active = tab === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`rounded px-3 py-1.5 text-sm ${
              active ? "bg-stone-900 text-white" : "text-stone-700 hover:bg-stone-100"
            }`}
          >
            {TAB_LABELS[id]}
          </button>
        );
      })}
    </nav>
  );
}
