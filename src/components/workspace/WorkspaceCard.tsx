import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { WorkspaceData } from '@/types/workspace';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell } from 'recharts';

interface WorkspaceCardProps {
  id: string;
  data: WorkspaceData;
  onDelete: () => void;
}

const UsageBar = ({ used, total, label }: { used: number; total: number; label: string }) => {
  const percentage = (used / total) * 100;
  const isCritical = percentage >= 90;

  return (
    <div className="flex flex-col space-y-1 w-full">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-terminal-green" />
          <span className="text-terminal-green font-mono">{label}</span>
        </div>
        <span className={cn(
          "font-mono",
          isCritical ? "text-terminal-magenta" : "text-terminal-green"
        )}>
          {used}/{total}
        </span>
      </div>
      <div className="w-full h-1 bg-terminal-dim rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-300",
            isCritical ? "bg-terminal-magenta" : "bg-terminal-green",
            "progress-heartbeat"
          )}
          style={{ 
            width: `${Math.min(percentage, 100)}%`,
            transform: 'translateX(0)',
            animation: isCritical ? 'heartbeat 0.8s ease-in-out infinite' : 'heartbeat 1.2s ease-in-out infinite'
          }}
        />
      </div>
    </div>
  );
};

export const WorkspaceCard: React.FC<WorkspaceCardProps> = ({ id, data, onDelete }) => {
  const botUsagePercentage = (data.bot_user_used / data.bot_user_limit) * 100;
  const botPercentage = (data.bot_used / data.bot_limit) * 100;
  const memberPercentage = (data.member_used / data.member_limit) * 100;

  const totalUsage = (botUsagePercentage + botPercentage + memberPercentage) / 3;
  const remainingUsage = 100 - totalUsage;

  const pieData = [
    { name: 'Used', value: totalUsage },
    { name: 'Available', value: remainingUsage }
  ];

  const COLORS = ['#00ff00', '#004400'];

  return (
    <Card className="bg-black/40 backdrop-blur-sm border border-terminal-green/20 shadow-lg shadow-terminal-green/5 hover:shadow-terminal-green/10 hover:border-terminal-green/30 transition-all duration-300 w-[400px]">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-terminal-green text-lg font-mono truncate max-w-[200px]">{data.name}</h3>
            <p className="text-terminal-green/60 text-xs font-mono mt-1">{data.plan}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-terminal-green/60 hover:text-terminal-magenta hover:bg-terminal-magenta/10"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-4 items-center">
          <div className="w-12 h-12 flex-shrink-0 animate-[spin_3s_linear_infinite]">
            <PieChart width={48} height={48}>
              <Pie
                data={pieData}
                cx={24}
                cy={24}
                innerRadius={15}
                outerRadius={22}
                fill="#00ff00"
                paddingAngle={4}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                animationBegin={0}
                animationDuration={2000}
              >
                {pieData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    className="transition-all duration-300"
                  />
                ))}
              </Pie>
            </PieChart>
          </div>
          
          <div className="flex-1 space-y-3 min-w-0">
            <UsageBar 
              used={data.bot_user_used}
              total={data.bot_user_limit}
              label="Bot Users"
            />
            
            <UsageBar 
              used={data.bot_used}
              total={data.bot_limit}
              label="Bots"
            />
            
            <UsageBar 
              used={data.member_used}
              total={data.member_limit}
              label="Members"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};