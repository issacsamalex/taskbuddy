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
import { Search } from "lucide-react";
import { Label } from "./ui/label";

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
    <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-x-6">
      <div className="flex items-center space-x-2">
        <p className="flex-shrink-0 text-lg font-light">Filter by:</p>
        <Select
          onValueChange={(value) => setCategory(value as Filters["category"])}
          value={category}
        >
          <SelectTrigger className="rounded-full">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="work">Work</SelectItem>
            <SelectItem value="personal">Personal</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Input
          id="search"
          className="rounded-full w-60"
          type="search"
          placeholder="Search tasks"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Label htmlFor="search">
          <Search className="text-muted-foreground" />
        </Label>
      </div>
    </div>
  );
};

export default FilterBar;
