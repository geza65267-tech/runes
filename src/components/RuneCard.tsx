import { Rune } from '../types/rune';
import { Flame, Shield, Heart, Skull, Zap, Star } from 'lucide-react';

interface RuneCardProps {
  rune: Rune;
  onClick?: () => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  showTooltip?: boolean;
  compact?: boolean;
}

export default function RuneCard({
  rune,
  onClick,
  draggable = false,
  onDragStart,
  compact = false,
}: RuneCardProps) {
  const typeConfig = {
    fury: {
      icon: Flame,
      gradient: 'from-red-600 to-orange-600',
      glow: 'shadow-red-500/50',
      border: 'border-red-500',
    },
    aegis: {
      icon: Shield,
      gradient: 'from-cyan-600 to-blue-600',
      glow: 'shadow-cyan-500/50',
      border: 'border-cyan-500',
    },
    vitality: {
      icon: Heart,
      gradient: 'from-emerald-600 to-green-600',
      glow: 'shadow-emerald-500/50',
      border: 'border-emerald-500',
    },
  };

  const rarityConfig = {
    minor: {
      border: 'border-gray-600',
      glow: 'shadow-lg',
      textColor: 'text-gray-300',
    },
    major: {
      border: 'border-blue-500',
      glow: 'shadow-xl shadow-blue-500/30',
      textColor: 'text-blue-300',
    },
    legendary: {
      border: 'border-amber-500',
      glow: 'shadow-2xl shadow-amber-500/50',
      textColor: 'text-amber-300',
    },
  };

  const config = typeConfig[rune.type];
  const rarityStyle = rarityConfig[rune.rarity];
  const Icon = config.icon;

  const affixRarityColor = {
    common: 'text-gray-400',
    rare: 'text-blue-400',
    epic: 'text-purple-400',
  };

  return (
    <div
      className={`
        relative bg-gradient-to-br from-gray-900 to-gray-800
        rounded-lg border-2 ${rarityStyle.border} ${rarityStyle.glow}
        transition-all duration-300 hover:scale-105 hover:-translate-y-1
        ${onClick ? 'cursor-pointer' : ''}
        ${rune.corrupted ? 'animate-pulse' : ''}
        ${compact ? 'p-3' : 'p-4'}
      `}
      onClick={onClick}
      draggable={draggable}
      onDragStart={onDragStart}
    >
      {rune.corrupted && (
        <div className="absolute -top-2 -right-2 bg-purple-600 rounded-full p-1.5 border-2 border-purple-400 animate-pulse">
          <Skull className="w-4 h-4 text-white" />
        </div>
      )}

      <div className="flex items-start justify-between mb-3">
        <div className={`flex items-center gap-2 ${compact ? 'text-xs' : 'text-sm'}`}>
          <div className={`p-2 rounded-lg bg-gradient-to-br ${config.gradient} ${config.glow} shadow-lg`}>
            <Icon className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
          </div>
          <div>
            <div className={`font-bold ${rarityStyle.textColor} capitalize ${compact ? 'text-xs' : 'text-sm'}`}>
              {rune.rarity}
            </div>
            <div className="text-gray-400 text-xs capitalize">{rune.type}</div>
          </div>
        </div>

        <div className={`text-right ${compact ? 'text-sm' : 'text-lg'}`}>
          <div className="text-white font-bold">+{rune.fixedStat.value}</div>
          <div className="text-gray-400 text-xs">{rune.fixedStat.name}</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className={`text-gray-300 font-semibold border-t border-gray-700 pt-2 ${compact ? 'text-xs' : 'text-sm'}`}>
          Affixes
        </div>
        {rune.affixes.map((affix) => (
          <div
            key={affix.id}
            className={`flex items-start gap-2 ${compact ? 'text-xs' : 'text-sm'}`}
          >
            {affix.rarity === 'epic' && <Star className="w-3 h-3 text-purple-400 flex-shrink-0 mt-0.5" />}
            {affix.rarity === 'rare' && <Zap className="w-3 h-3 text-blue-400 flex-shrink-0 mt-0.5" />}
            <div>
              <div className={`font-medium ${affixRarityColor[affix.rarity]}`}>
                {affix.name}
              </div>
              <div className="text-gray-500 text-xs">{affix.description}</div>
            </div>
          </div>
        ))}
      </div>

      {rune.corrupted && (
        <div className="mt-3 pt-3 border-t border-purple-500/30">
          <div className="flex items-center gap-2 text-purple-400 text-xs">
            <Skull className="w-3 h-3" />
            <span className="font-medium">Corrupted:</span>
            <span className="text-purple-300">{rune.corruptionEffect}</span>
          </div>
        </div>
      )}
    </div>
  );
}
