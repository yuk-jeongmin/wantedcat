import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Plus, Heart, Calendar, Weight, Stethoscope } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Cat {
  id: number;
  name: string;
  breed: string;
  age: string;
  weight: string;
  gender: 'male' | 'female';
  healthStatus: 'healthy' | 'caution' | 'sick';
  lastCheckup: string;
  image?: string;
  notes?: string;
}

interface RegisteredCatsProps {
  cats?: Cat[];
  onGoToCatManagement?: () => void;
}


export function RegisteredCats({ cats = [], onGoToCatManagement }: RegisteredCatsProps) {
  const healthyCats = cats.filter(cat => cat.healthStatus === 'healthy').length;
  const totalCats = cats.length;

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'caution': return 'bg-yellow-500';
      case 'sick': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getHealthStatusText = (status: string) => {
    switch (status) {
      case 'healthy': return '건강';
      case 'caution': return '주의';
      case 'sick': return '치료중';
      default: return '알 수 없음';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle>등록된 고양이</CardTitle>
          <Button 
            size="sm" 
            className="bg-primary hover:bg-primary/90"
            onClick={onGoToCatManagement}
          >
            <Plus className="w-4 h-4 mr-2" />
            고양이 추가
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          총 {totalCats}마리 • 건강한 고양이 {healthyCats}마리
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">건강한 고양이</div>
                  <div className="text-xl font-medium">{healthyCats}마리</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Stethoscope className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">관리 필요</div>
                  <div className="text-xl font-medium">{totalCats - healthyCats}마리</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cat List */}
        <div className="space-y-3">
          {cats.slice(0, 3).map((cat) => (
            <Card key={cat.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                    <ImageWithFallback
                      src={cat.image || `https://images.unsplash.com/photo-1574158622682-e40e69881006?w=64&h=64&fit=crop&crop=face`}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{cat.name}</h3>
                        <Badge 
                          variant="outline"
                          className={`text-xs ${cat.gender === 'male' ? 'text-blue-600 border-blue-200' : 'text-pink-600 border-pink-200'}`}
                        >
                          {cat.gender === 'male' ? '수컷' : '암컷'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${getHealthStatusColor(cat.healthStatus)}`}></div>
                        <span className="text-xs text-muted-foreground">
                          {getHealthStatusText(cat.healthStatus)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div>{cat.breed} • {cat.age}</div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Weight className="w-3 h-3" />
                          <span>{cat.weight}</span>
                        </div>

                      </div>
                      {cat.notes && (
                        <div className="text-xs text-muted-foreground pt-1">
                          {cat.notes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Show More Button */}
        <div className="text-center pt-2">
          <Button 
            variant="ghost" 
            className="text-primary text-sm"
            onClick={onGoToCatManagement}
          >
            모든 고양이 보기
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}