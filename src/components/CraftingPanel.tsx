import { useState, useEffect } from 'react';
import { Rune, RuneSlot as RuneSlotType, RuneType, RuneRarity } from '../types/rune';
import { generateMockRune } from '../data/runeData';
import RuneCard from './RuneCard';
import RuneSlot from './RuneSlot';
import {
  Sparkles,
  Merge,
  RefreshCw,
  Flame,
  Shield,
  Heart,
  TrendingUp,
  X,
} from 'lucide-react';

export default function CraftingPanel() {
  const [runeSlots, setRuneSlots] = useState<RuneSlotType[]>([
    { id: 1, rune: null, unlocked: true },
    { id: 2, rune: null, unlocked: true },
    { id: 3, rune: null, unlocked: true },
    { id: 4, rune: null, unlocked: false },
    { id: 5, rune: null, unlocked: false },
  ]);

  const [inventory, setInventory] = useState<Rune[]>([
    generateMockRune('fury', 'legendary', false),
    generateMockRune('aegis', 'major', false),
    generateMockRune('vitality', 'major', false),
    generateMockRune('fury', 'minor', false),
    generateMockRune('aegis', 'minor', true),
    generateMockRune('vitality', 'legendary', false),
  ]);

  const [shards, setShards] = useState({ fury: 8, aegis: 5, vitality: 12 });
  const [selectedForCraft, setSelectedForCraft] = useState<RuneType | null>(null);
  const [selectedForFusion, setSelectedForFusion] = useState<Rune[]>([]);
  const [craftMode, setCraftMode] = useState<'craft' | 'fuse' | 'reroll'>('craft');
  const [draggedRune, setDraggedRune] = useState<Rune | null>(null);

  const [playerStats, setPlayerStats] = useState({
    atk: 10,
    def: 5,
    hp: 100,
    dps: 50,
  });

  useEffect(() => {
    const equippedRunes = runeSlots.filter((slot) => slot.rune !== null).map((slot) => slot.rune!);

    let atk = 10;
    let def = 5;
    let hp = 100;

    equippedRunes.forEach((rune) => {
      if (rune.type === 'fury') atk += rune.fixedStat.value;
      if (rune.type === 'aegis') def += rune.fixedStat.value;
      if (rune.type === 'vitality') hp += rune.fixedStat.value;
    });

    const dps = atk * 5 * (1 + def * 0.05);

    setPlayerStats({ atk, def, hp, dps: Math.round(dps) });
  }, [runeSlots]);

  const handleDragStart = (rune: Rune) => {
    setDraggedRune(rune);
  };

  const handleDropToSlot = (slotId: number) => {
    if (!draggedRune) return;

    const updatedSlots = runeSlots.map((slot) => {
      if (slot.id === slotId && slot.unlocked) {
        return { ...slot, rune: draggedRune };
      }
      return slot;
    });

    setRuneSlots(updatedSlots);
    setInventory(inventory.filter((r) => r.id !== draggedRune.id));
    setDraggedRune(null);
  };

  const handleRemoveFromSlot = (slotId: number) => {
    const slot = runeSlots.find((s) => s.id === slotId);
    if (!slot || !slot.rune) return;

    setInventory([...inventory, slot.rune]);
    setRuneSlots(
      runeSlots.map((s) => (s.id === slotId ? { ...s, rune: null } : s))
    );
  };

  const handleCraftRune = (type: RuneType, rarity: RuneRarity) => {
    const cost = rarity === 'minor' ? 3 : 0;
    if (shards[type] < cost) return;

    const newRune = generateMockRune(type, rarity, Math.random() < 0.05);
    setInventory([...inventory, newRune]);
    setShards({ ...shards, [type]: shards[type] - cost });
  };

  const handleFuseRunes = () => {
    if (selectedForFusion.length !== 2) return;

    const types = selectedForFusion.map((r) => r.type);
    let fusedType: RuneType = 'fury';

    if (types.includes('fury') && types.includes('aegis')) fusedType = 'fury';
    if (types.includes('fury') && types.includes('vitality')) fusedType = 'vitality';
    if (types.includes('aegis') && types.includes('vitality')) fusedType = 'aegis';

    const fusedRune = generateMockRune(fusedType, 'legendary', Math.random() < 0.2);
    setInventory([
      ...inventory.filter((r) => !selectedForFusion.find((sr) => sr.id === r.id)),
      fusedRune,
    ]);
    setSelectedForFusion([]);
  };

  const toggleFusionSelection = (rune: Rune) => {
    if (selectedForFusion.find((r) => r.id === rune.id)) {
      setSelectedForFusion(selectedForFusion.filter((r) => r.id !== rune.id));
    } else if (selectedForFusion.length < 2) {
      setSelectedForFusion([...selectedForFusion, rune]);
    }
  };

  const setBonus = () => {
    const equipped = runeSlots.filter((s) => s.rune).map((s) => s.rune!);
    const furyCount = equipped.filter((r) => r.type === 'fury').length;
    const aegisCount = equipped.filter((r) => r.type === 'aegis').length;
    const vitalityCount = equipped.filter((r) => r.type === 'vitality').length;

    return { fury: furyCount, aegis: aegisCount, vitality: vitalityCount };
  };

  const setBonuses = setBonus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-cyan-500 to-emerald-500 mb-2">
            ABYSS RUNE FORGE
          </h1>
          <p className="text-gray-400">Craft, Fuse, and Master the Power of Runes</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-amber-400" />
                Loadout
              </h2>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-gray-400">DPS:</span>
                  <span className="text-white font-bold">{playerStats.dps}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mb-6 flex-wrap justify-center">
              {runeSlots.map((slot) => (
                <RuneSlot
                  key={slot.id}
                  rune={slot.rune}
                  unlocked={slot.unlocked}
                  slotId={slot.id}
                  onDrop={() => handleDropToSlot(slot.id)}
                  onRemove={() => handleRemoveFromSlot(slot.id)}
                />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 bg-gray-950/50 rounded-xl p-4">
              <div className="text-center">
                <Flame className="w-6 h-6 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{playerStats.atk}</div>
                <div className="text-xs text-gray-400">Attack</div>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 text-cyan-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{playerStats.def}</div>
                <div className="text-xs text-gray-400">Defense</div>
              </div>
              <div className="text-center">
                <Heart className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{playerStats.hp}</div>
                <div className="text-xs text-gray-400">Health</div>
              </div>
            </div>

            {(setBonuses.fury >= 2 || setBonuses.aegis >= 2 || setBonuses.vitality >= 2) && (
              <div className="mt-4 bg-gradient-to-r from-amber-900/30 to-amber-800/30 border border-amber-600/50 rounded-xl p-4">
                <div className="text-sm font-bold text-amber-300 mb-2">SET BONUSES ACTIVE</div>
                <div className="space-y-1 text-xs text-amber-200">
                  {setBonuses.fury >= 2 && <div>🔴 Fury Set (2): +15% Attack Speed</div>}
                  {setBonuses.aegis >= 2 && <div>🔵 Aegis Set (2): +10% Block Chance</div>}
                  {setBonuses.vitality >= 2 && <div>🟢 Vitality Set (2): +5 HP Regen/sec</div>}
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Resources</h2>
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-red-900/30 to-red-800/30 rounded-lg p-3 border border-red-600/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-red-500" />
                    <span className="text-white font-medium">Fury Shards</span>
                  </div>
                  <span className="text-2xl font-bold text-red-400">{shards.fury}</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-cyan-900/30 to-cyan-800/30 rounded-lg p-3 border border-cyan-600/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-cyan-500" />
                    <span className="text-white font-medium">Aegis Shards</span>
                  </div>
                  <span className="text-2xl font-bold text-cyan-400">{shards.aegis}</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-emerald-900/30 to-emerald-800/30 rounded-lg p-3 border border-emerald-600/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-emerald-500" />
                    <span className="text-white font-medium">Vitality Shards</span>
                  </div>
                  <span className="text-2xl font-bold text-emerald-400">{shards.vitality}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setCraftMode('craft')}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                craftMode === 'craft'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/50'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <Sparkles className="w-5 h-5 inline mr-2" />
              Craft
            </button>
            <button
              onClick={() => setCraftMode('fuse')}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                craftMode === 'fuse'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <Merge className="w-5 h-5 inline mr-2" />
              Fuse
            </button>
            <button
              onClick={() => setCraftMode('reroll')}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                craftMode === 'reroll'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <RefreshCw className="w-5 h-5 inline mr-2" />
              Reroll
            </button>
          </div>

          {craftMode === 'craft' && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Craft New Rune</h3>
              <div className="grid grid-cols-3 gap-4">
                {(['fury', 'aegis', 'vitality'] as RuneType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => handleCraftRune(type, 'minor')}
                    disabled={shards[type] < 3}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      shards[type] >= 3
                        ? 'bg-gray-800 border-gray-600 hover:border-gray-500 hover:scale-105 cursor-pointer'
                        : 'bg-gray-900 border-gray-700 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="text-white font-bold capitalize mb-2">{type} Rune</div>
                    <div className="text-sm text-gray-400">Cost: 3 shards</div>
                    <div className="text-xs text-gray-500 mt-2">→ Minor Rune</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {craftMode === 'fuse' && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4">
                Fuse Runes ({selectedForFusion.length}/2 selected)
              </h3>
              {selectedForFusion.length === 2 && (
                <button
                  onClick={handleFuseRunes}
                  className="mb-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:scale-105 transition-all shadow-lg shadow-purple-500/50"
                >
                  Fuse Selected Runes
                </button>
              )}
              <div className="text-sm text-gray-400 mb-4">
                Select 2 runes from your inventory to fuse into a powerful combined rune
              </div>
            </div>
          )}

          {craftMode === 'reroll' && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Reroll Affixes</h3>
              <div className="text-sm text-gray-400">
                Select a rune from inventory to reroll its affixes (Coming soon)
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Inventory</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inventory.map((rune) => (
              <div key={rune.id} className="relative">
                {craftMode === 'fuse' && selectedForFusion.find((r) => r.id === rune.id) && (
                  <div className="absolute -top-2 -right-2 z-10 bg-purple-600 rounded-full p-2 border-2 border-purple-400">
                    <X className="w-4 h-4 text-white" />
                  </div>
                )}
                <RuneCard
                  rune={rune}
                  draggable={craftMode !== 'fuse'}
                  onDragStart={() => handleDragStart(rune)}
                  onClick={
                    craftMode === 'fuse' ? () => toggleFusionSelection(rune) : undefined
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
