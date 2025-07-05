import React, { useState } from "react";
import { usePlayerContext } from "@/contexts/usePlayerContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import type { Item } from "@/types/game";

export const SupabaseTest: React.FC = () => {
  const {
    player,
    inventory,
    businesses,
    updatePlayer,
    addWeaponToInventory,
    getShopWeapons,
  } = usePlayerContext();
  const [shopWeapons, setShopWeapons] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  const handleUpdateMoney = async () => {
    if (!player) return;

    try {
      await updatePlayer({
        ...player,
        stats: {
          ...player.stats,
          money: player.stats.money + 100,
        },
      });
    } catch (error) {
    }
  };

  const handleAddWeapon = async () => {
    if (!player || shopWeapons.length === 0) return;

    try {
      setLoading(true);
      const weapon = shopWeapons[0]; // Add first weapon
      await addWeaponToInventory(weapon.id, 1);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleLoadShopWeapons = async () => {
    try {
      setLoading(true);
      const weapons = await getShopWeapons();
      setShopWeapons(weapons);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  if (!player) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Teste Supabase</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Carregando dados do jogador...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Teste de Integração Supabase</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Player Info */}
          <div className="space-y-2">
            <h3 className="font-semibold">Dados do Jogador</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                Nome: <Badge variant="outline">{player.name}</Badge>
              </div>
              <div>
                Nível: <Badge variant="outline">{player.level}</Badge>
              </div>
              <div>
                Experiência:{" "}
                <Badge variant="outline">{player.experience}</Badge>
              </div>
              <div>
                Dinheiro: <Badge variant="outline">${player.stats.money}</Badge>
              </div>
              <div>
                Energia:{" "}
                <Badge variant="outline">
                  {player.stats.energy}/{player.stats.maxEnergy}
                </Badge>
              </div>
              <div>
                Vida:{" "}
                <Badge variant="outline">
                  {player.stats.health}/{player.stats.maxHealth}
                </Badge>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <h3 className="font-semibold">Ações de Teste</h3>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleUpdateMoney} disabled={loading}>
                {loading ? <LoadingSpinner size="sm" /> : "Adicionar $100"}
              </Button>
              <Button onClick={handleLoadShopWeapons} disabled={loading}>
                {loading ? <LoadingSpinner size="sm" /> : "Carregar Armas"}
              </Button>
              <Button
                onClick={handleAddWeapon}
                disabled={loading || shopWeapons.length === 0}
              >
                {loading ? <LoadingSpinner size="sm" /> : "Adicionar Arma"}
              </Button>
            </div>
          </div>

          {/* Inventory */}
          <div className="space-y-2">
            <h3 className="font-semibold">
              Inventário ({inventory.length} itens)
            </h3>
            {inventory.length > 0 ? (
              <div className="space-y-1">
                {inventory.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-2 bg-gray-100 rounded"
                  >
                    <span className="text-sm">{item.name}</span>
                    <Badge variant="secondary">{item.type}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Inventário vazio</p>
            )}
          </div>

          {/* Businesses */}
          <div className="space-y-2">
            <h3 className="font-semibold">
              Negócios ({businesses.length} negócios)
            </h3>
            {businesses.length > 0 ? (
              <div className="space-y-1">
                {businesses.map((business) => (
                  <div
                    key={business.id}
                    className="flex justify-between items-center p-2 bg-gray-100 rounded"
                  >
                    <span className="text-sm">{business.name}</span>
                    <Badge variant="secondary">{business.type}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Nenhum negócio</p>
            )}
          </div>

          {/* Shop Weapons */}
          {shopWeapons.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">
                Arma da Loja ({shopWeapons.length} armas)
              </h3>
              <div className="space-y-1">
                {shopWeapons.slice(0, 3).map((weapon) => (
                  <div
                    key={weapon.id}
                    className="flex justify-between items-center p-2 bg-blue-50 rounded"
                  >
                    <span className="text-sm">{weapon.name}</span>
                    <Badge variant="outline">${weapon.price}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
