import React, { useState } from "react";
import BaseView from "./BaseView";
import { Gavel, Siren, Users, Handshake, Angry } from "lucide-react";

interface PrisonViewProps {
  isPlayerImprisoned: boolean;
  onAttemptBribe: () => boolean; // Retorna true em sucesso
  onAttemptRiot: () => boolean; // Retorna true em sucesso
}

const PrisonView = ({
  isPlayerImprisoned,
  onAttemptBribe,
  onAttemptRiot,
}: PrisonViewProps) => {
  const [feedback, setFeedback] = useState("");

  const handleBribe = () => {
    setFeedback("Tentando subornar o guarda...");
    setTimeout(() => {
      const success = onAttemptBribe();
      setFeedback(
        success
          ? "Suborno aceito! Você está livre."
          : "Suborno falhou! Sua pena aumentou."
      );
    }, 1500);
  };

  const handleRiot = () => {
    setFeedback("Iniciando um motim...");
    setTimeout(() => {
      const success = onAttemptRiot();
      setFeedback(
        success
          ? "Motim bem-sucedido! Você escapou no caos."
          : "Motim falhou! Você foi capturado e sua pena dobrou."
      );
    }, 1500);
  };

  if (isPlayerImprisoned) {
    return (
      <BaseView title="Prisão">
        <div className="cyber-border p-4 text-center">
          <Siren
            size={48}
            className="mx-auto text-red-500 mb-4 animate-pulse"
          />
          <h3 className="text-2xl font-bold mb-2">Você está preso!</h3>
          <p className="text-white/70 mb-6">
            Suas ações estão bloqueadas. Tente encontrar uma saída ou cumpra sua
            pena.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleBribe}
              className="flex flex-col items-center justify-center p-4 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg transition-colors"
            >
              <Handshake size={32} className="mb-2 text-yellow-400" />
              <span className="font-semibold">Subornar Guarda</span>
              <span className="text-xs text-white/60">(10% de chance)</span>
            </button>
            <button
              onClick={handleRiot}
              className="flex flex-col items-center justify-center p-4 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
            >
              <Angry size={32} className="mb-2 text-red-400" />
              <span className="font-semibold">Começar um Motim</span>
              <span className="text-xs text-white/60">(30% de chance)</span>
            </button>
          </div>
          {feedback && (
            <div className="mt-6 p-3 bg-cyber-dark-medium rounded-lg text-center font-semibold">
              {feedback}
            </div>
          )}
        </div>
      </BaseView>
    );
  }

  return (
    <BaseView title="Prisão">
      <div className="cyber-border p-4">
        <h3 className="text-xl font-semibold mb-4">Visitar Presos</h3>
        <p className="text-white/70 mb-4">
          Você não está preso. Você pode visitar outros detentos.
        </p>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-cyber-dark-medium rounded-lg">
            <div className="flex items-center gap-3">
              <Users size={24} className="text-cyan-400" />
              <div>
                <h4 className="font-semibold">Membro da Gangue X</h4>
                <p className="text-xs text-white/60">Pena: 3 dias restantes</p>
              </div>
            </div>
            <button className="px-4 py-1 text-sm bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg transition-colors">
              Conversar
            </button>
          </div>
          {/* Adicionar mais presos aqui */}
        </div>
      </div>
    </BaseView>
  );
};

export default PrisonView;
