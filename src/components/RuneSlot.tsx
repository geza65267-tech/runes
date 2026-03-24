import { Rune } from '../types/rune';
import { Flame, Shield, Heart, Lock, Plus } from 'lucide-react';

interface RuneSlotProps {
  rune: Rune | null;
  unlocked: boolean;
  slotId: number;
  onDrop?: (e: React.DragEvent) => void;
  onRemove?: () => void;
}

export default function RuneSlot({ rune, unlocked, slotId, onDrop, onRemove }: RuneSlotProps) {
  const typeConfig = {
    fury: {
      icon: Flame,
      gradient: 'from-red-600/20 to-orange-600/20',
      border: 'border-red-500/50',
      glow: 'shadow-red-500/30',
    },
    aegis: {
      icon: Shield,
      gradient: 'from-cyan-600/20 to-blue-600/20',
      border: 'border-cyan-500/50',
      glow: 'shadow-cyan-500/30',
    },
    vitality: {
      icon: Heart,
      gradient: 'from-emerald-600/20 to-green-600/20',
      border: 'border-emerald-500/50',
      glow: 'shadow-emerald-500/30',
    },
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  if (!unlocked) {
    return (
      <div className="relative w-32 h-40 bg-gray-900/50 rounded-lg border-2 border-gray-700 flex items-center justify-center">
        <Lock className="w-8 h-8 text-gray-600" />
        <div className="absolute bottom-2 text-xs text-gray-600 font-medium">
          Floor {slotId * 5}
        </div>
      </div>
    );
  }

  if (!rune) {
    return (
      <div
        className="relative w-32 h-40 bg-gray-900/30 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center transition-all hover:border-gray-500 hover:bg-gray-800/30 cursor-pointer"
        onDrop={onDrop}
        onDragOver={handleDragOver}
      >
        <Plus className="w-8 h-8 text-gray-600" />
      </div>
    );
  }

  const config = typeConfig[rune.type];
  const Icon = config.icon;

  return (
    <div
      className={`relative w-32 h-40 bg-gradient-to-br ${config.gradient} rounded-lg border-2 ${config.border} shadow-lg ${config.glow} transition-all hover:scale-105 cursor-pointer group`}
      onDrop={onDrop}
      onDragOver={handleDragOver}
      onClick={onRemove}
    >
      <div className="absolute top-2 left-2">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${config.gradient.replace('/20', '')} shadow-md`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="absolute top-2 right-2">
        <div className="text-white font-bold text-lg">+{rune.fixedStat.value}</div>
        <div className="text-xs text-gray-300">{rune.fixedStat.name}</div>
      </div>

      <div className="absolute bottom-2 left-2 right-2">
        <div className="text-xs text-gray-300 font-semibold capitalize">
          {rune.rarity}
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {rune.affixes.length} {rune.affixes.length === 1 ? 'Affix' : 'Affixes'}
        </div>
      </div>

      <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/20 rounded-lg transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
        <span className="text-white font-bold text-sm">Remove</span>
      </div>

      {rune.corrupted && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
      )}
    </div>
  );
}
