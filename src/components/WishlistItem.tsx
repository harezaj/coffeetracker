import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink } from "lucide-react";

interface WishlistBean {
  id: string;
  name: string;
  roaster: string;
  notes?: string;
}

interface WishlistItemProps {
  bean: WishlistBean;
  onDelete: (id: string) => void;
}

export function WishlistItem({ bean, onDelete }: WishlistItemProps) {
  return (
    <Card className="w-full overflow-hidden group hover:shadow-lg transition-all duration-300">
      <CardHeader className="bg-gradient-to-br from-white to-gray-50 border-b border-gray-100 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-gray-900 group-hover:text-gray-700 transition-colors">
              {bean.name}
            </CardTitle>
            <p className="text-gray-600 text-sm font-medium">by {bean.roaster}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-blue-600"
              asChild
            >
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(
                  `${bean.roaster} ${bean.name} coffee`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-red-600"
              onClick={() => onDelete(bean.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      {bean.notes && (
        <CardContent className="pt-4">
          <p className="text-gray-600 text-sm">{bean.notes}</p>
        </CardContent>
      )}
    </Card>
  );
}