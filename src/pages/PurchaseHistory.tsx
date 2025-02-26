import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBeans, updateBean } from "@/lib/api";
import { CoffeeBean } from "@/components/CoffeeCard";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Coffee, Menu, Plus } from "lucide-react";
import { Settings } from "@/components/Settings";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function PurchaseHistory() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: beans = [], isLoading, error } = useQuery({
    queryKey: ["coffee-beans"],
    queryFn: fetchBeans,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Omit<CoffeeBean, "id">> }) => 
      updateBean(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coffee-beans"] });
      toast({
        title: "Success",
        description: "Purchase count updated successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update purchase count. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleUpdate = (bean: CoffeeBean) => {
    updateMutation.mutate({
      id: bean.id,
      updates: { purchaseCount: (bean.purchaseCount || 0) + 1 },
    });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading coffee beans</div>;
  }

  const sortedBeans = [...beans].sort((a, b) => {
    const dateA = new Date(a.created_at || 0);
    const dateB = new Date(b.created_at || 0);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <Link to="/" className="flex items-center gap-4 group">
          <div className="relative">
            <Coffee className="h-12 w-12 text-coffee dark:text-white scale-x-[-1]" />
            <div className="absolute top-0 left-1/2 w-1 h-1 bg-coffee dark:bg-white rounded-full opacity-0 group-hover:animate-[droplet_1s_ease-in-out_infinite]" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-4xl font-black text-coffee-dark dark:text-white tracking-tight group-hover:text-coffee dark:group-hover:text-cream transition-colors">
              Purchase Log
            </h1>
            <span className="text-xl font-light text-coffee-dark dark:text-white tracking-wider group-hover:text-coffee dark:group-hover:text-cream transition-colors">
              Track your coffee journey
            </span>
          </div>
        </Link>
        <div className="flex gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/" className="cursor-pointer">
                  Collection
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/recommendations" className="cursor-pointer">
                  AI Recommendations
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Settings />
        </div>
      </div>

      <div className="bg-white dark:bg-[#121212] rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden divide-y divide-gray-200 dark:divide-gray-800">
        {sortedBeans.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">No coffee beans in your collection yet.</p>
          </div>
        ) : (
          sortedBeans.map((bean) => (
            <div 
              key={bean.id}
              className="group relative hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div 
                onClick={() => navigate('/')}
                className="flex items-center p-4 cursor-pointer"
              >
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {bean.name}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      by {bean.roaster}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>Purchased {bean.purchaseCount || 1} time{(bean.purchaseCount || 1) !== 1 ? 's' : ''}</span>
                    <span>•</span>
                    <span>{format(new Date(bean.created_at || new Date()), 'MMM d, yyyy')}</span>
                  </div>
                  {bean.notes && bean.notes.length > 0 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                      Notes: {bean.notes.join(', ')}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdate(bean);
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}