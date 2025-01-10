import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Filters } from "@/types/types";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "./ui/input";

type FilterBarProps = {
  onChange: (filters: Filters) => void;
};

const FilterBar = ({ onChange }: FilterBarProps) => {
  const [search, setSearch] = useState<Filters["search"]>();
  const debouncedSearch = useDebounce(search);

  const [category, setCategory] = useState<Filters["category"]>();

  useEffect(() => {
    onChange({ category, search: debouncedSearch });
  }, [category, debouncedSearch]);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-x-4">
      <div className="flex items-center space-x-2">
        <p className="flex-shrink-0 text-lg font-light">Filter by:</p>
        <Select
          onValueChange={(value) => setCategory(value as Filters["category"])}
          value={category}
        >
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="work">Work</SelectItem>
            <SelectItem value="personal">Personal</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Input
          type="search"
          placeholder="Search tasks"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </div>
  );
};

export default FilterBar;
