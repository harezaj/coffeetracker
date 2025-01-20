import { CoffeeCard, type CoffeeBean } from "./CoffeeCard";
import { CoffeeListItem } from "./CoffeeListItem";
import { AddCoffeeForm } from "./AddCoffeeForm";
import { useState } from "react";
import { LayoutGrid, List, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent } from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "@/components/ui/input";

type SortField = 'name' | 'roaster' | 'rank';

interface CollectionTabProps {
  beans: CoffeeBean[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Omit<CoffeeBean, "id">>) => void;
  onAdd: (bean: Omit<CoffeeBean, "id">) => void;
  isLoading?: boolean;
}

export function CollectionTab({ beans, onDelete, onUpdate, onAdd, isLoading = false }: CollectionTabProps) {
  const [viewMode, setViewMode] = useState<'tiles' | 'list'>('tiles');
  const [selectedBean, setSelectedBean] = useState<CoffeeBean | null>(null);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedRoaster, setSelectedRoaster] = useState<string>('all');
  const [selectedRank, setSelectedRank] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const uniqueRoasters = ['all', ...Array.from(new Set(beans.map(bean => bean.roaster)))];

  const filterBeans = (beans: CoffeeBean[]) => {
    return beans.filter(bean => {
      const roasterMatch = selectedRoaster === 'all' || bean.roaster === selectedRoaster;
      const rankMatch = selectedRank === 'all' || bean.rank === parseInt(selectedRank);
      const searchMatch = 
        searchQuery === '' || 
        bean.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bean.roaster.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bean.notes.some(note => note.toLowerCase().includes(searchQuery.toLowerCase()));
      return roasterMatch && rankMatch && searchMatch;
    });
  };

  const sortBeans = (beans: CoffeeBean[]) => {
    return [...beans].sort((a, b) => {
      const modifier = sortDirection === 'asc' ? 1 : -1;
      if (sortField === 'rank') {
        return (b.rank - a.rank) * modifier;
      }
      return a[sortField].localeCompare(b[sortField]) * modifier;
    });
  };

  const filteredAndSortedBeans = sortBeans(filterBeans(beans));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
            Your Collection
          </h2>
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-10 w-32 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-96 bg-white dark:bg-[#121212] rounded-lg border border-gray-200 dark:border-gray-800 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Your Collection
        </h2>
        <AddCoffeeForm onAdd={onAdd} />
      </div>
      {beans.length === 0 ? (
        <div className="text-center py-16 bg-white/50 dark:bg-[#121212]/50 rounded-xl backdrop-blur-sm border border-gray-200 dark:border-gray-800 shadow-lg animate-fade-in">
          <p className="text-gray-600 dark:text-gray-300 text-xl">
            No coffee beans added yet. Start by adding your first coffee bean!
          </p>
        </div>
      ) : filteredAndSortedBeans.length === 0 ? (
        <div className="text-center py-16 bg-white/50 dark:bg-[#121212]/50 rounded-xl backdrop-blur-sm border border-gray-200 dark:border-gray-800 shadow-lg animate-fade-in">
          <p className="text-gray-600 dark:text-gray-300 text-xl">
            No coffee beans match your current filters.
          </p>
        </div>
      ) : viewMode === 'tiles' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAndSortedBeans.map((bean) => (
            <CoffeeCard 
              key={bean.id} 
              bean={bean} 
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#121212] rounded-lg border border-gray-200 dark:border-gray-800 divide-y divide-gray-200 dark:divide-gray-800">
          {filteredAndSortedBeans.map((bean) => (
            <CoffeeListItem
              key={bean.id}
              bean={bean}
              onClick={() => setSelectedBean(bean)}
            />
          ))}
        </div>
      )}

      <Dialog open={!!selectedBean} onOpenChange={() => setSelectedBean(null)}>
        <DialogContent className="max-w-3xl">
          {selectedBean && (
            <CoffeeCard
              bean={selectedBean}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
