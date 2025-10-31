import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface TableState {
  pagination: {
    pageSize: number;
  };
  sorting: Array<{
    id: string;
    desc: boolean;
  }>;
  columnOrder: string[];
  columnVisibility: Record<string, boolean>;
  columnSizing: Record<string, number>;
  filters?: Array<{
    id: string;
    value: any; /* eslint-disable-line @typescript-eslint/no-explicit-any */
  }>;
}

interface TablesStorage {
  tables: {
    [tableId: string]: TableState;
  };
}

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

const STORAGE_KEY = 'dodopayments_tables';

class TableLocalStorage {
  private static getStorage(): TablesStorage {
    if (typeof window === 'undefined') {
      return this.getDefaultStorage();
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...this.getDefaultStorage(), ...parsed };
      }
    } catch {}
    return this.getDefaultStorage();
  }

  private static getDefaultStorage(): TablesStorage {
    return { tables: {} };
  }

  private static setStorage(data: TablesStorage): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }

  private static updateStorage(updates: DeepPartial<TablesStorage>): void {
    const current = this.getStorage();
    const updated = this.deepMerge(current, updates);
    this.setStorage(updated);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static deepMerge<T extends Record<string, any>>(target: T, source: DeepPartial<T>): T {
    const result = { ...target };
    for (const key in source) {
      if (source[key] !== undefined) {
        if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
          result[key] = this.deepMerge((result[key] as any) || {}, source[key] as any) as any; /* eslint-disable-line @typescript-eslint/no-explicit-any */
        } else {
          result[key] = source[key] as any; /* eslint-disable-line @typescript-eslint/no-explicit-any */
        }
      }
    }
    return result;
  }

  static getTableState(tableId: string): TableState | null {
    const storage = this.getStorage();
    return storage.tables[tableId] || null;
  }

  static setTableState(tableId: string, state: TableState) {
    const updates: DeepPartial<TablesStorage> = {
      tables: {
        [tableId]: state
      }
    };
    this.updateStorage(updates);
  }

  static updateTableState(tableId: string, stateUpdates: Partial<TableState>) {
    const currentState = this.getTableState(tableId);
    const newState: TableState = {
      pagination: { pageSize: 10 },
      sorting: [],
      columnOrder: [],
      columnVisibility: {},
      columnSizing: {},
      ...currentState,
      ...stateUpdates
    };
    this.setTableState(tableId, newState);
  }

  static clearTableState(tableId: string) {
    const storage = this.getStorage();
    if (storage.tables[tableId]) {
      delete storage.tables[tableId];
      this.setStorage(storage);
    }
  }

  static clearAllTableStates() {
    const updates: DeepPartial<TablesStorage> = { tables: {} };
    this.updateStorage(updates);
  }

  static clear() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  }

  static export(): TablesStorage {
    return this.getStorage();
  }
}

export default TableLocalStorage;
export type { TableState };