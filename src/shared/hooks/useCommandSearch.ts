// src/shared/hooks/useCommandSearch.ts
import { useEffect, useRef, useState, useCallback } from "react";
import type { SearchItem } from "../workers/search.worker";

export function useCommandSearch() {
  const [query, setQueryState] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Instantiate web worker using Vite module worker syntax
    const worker = new Worker(
      new URL("../workers/search.worker.ts", import.meta.url),
      { type: "module" }
    );
    workerRef.current = worker;

    // Trigger initial seeding of search index
    worker.postMessage({ type: "INIT" });

    worker.onmessage = (event: MessageEvent) => {
      const { type, results: searchResults } = event.data;
      if (type === "RESULTS") {
        setResults(searchResults);
        setIsSearching(false);
      }
    };

    return () => {
      worker.terminate();
    };
  }, []);

  const setQuery = useCallback((newQuery: string) => {
    setQueryState(newQuery);
    if (!newQuery.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    if (workerRef.current) {
      workerRef.current.postMessage({ type: "SEARCH", query: newQuery });
    }
  }, []);

  return {
    query,
    setQuery,
    results,
    isSearching,
  };
}
