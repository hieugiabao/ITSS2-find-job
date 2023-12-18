import React, { FC, createContext, useMemo, useState } from "react";

export interface ISearchContext {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

export const SearchContext = createContext<ISearchContext>({
  query: "",
  setQuery: () => {},
});

export function useSearchContext() {
  const context = React.useContext(SearchContext);
  if (!context) {
    throw new Error("useSearchContext must be used within a SearchProvider");
  }
  return context;
}

export const SearchProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [query, setQuery] = useState("");

  const value = useMemo(() => ({ query, setQuery }), [query, setQuery]);

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};
