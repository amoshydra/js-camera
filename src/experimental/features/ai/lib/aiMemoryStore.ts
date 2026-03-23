interface MemoryEntry {
  id: string;
  content: string;
  timestamp: number;
}

const MAX_MEMORIES = 20;

class AiMemoryStore {
  private memories: MemoryEntry[] = [];
  private nextId = 1;

  remember(content: string): string {
    const id = `m${this.nextId++}`;
    this.memories.push({ id, content, timestamp: Date.now() });
    if (this.memories.length > MAX_MEMORIES) {
      this.memories.shift();
    }
    return id;
  }

  recall(): MemoryEntry[] {
    return [...this.memories];
  }

  forget(id: string): boolean {
    const idx = this.memories.findIndex((m) => m.id === id);
    if (idx !== -1) {
      this.memories.splice(idx, 1);
      return true;
    }
    return false;
  }

  clear(): void {
    this.memories = [];
  }

  count(): number {
    return this.memories.length;
  }
}

export const aiMemoryStore = new AiMemoryStore();
