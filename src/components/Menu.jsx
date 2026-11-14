// Menu fixo na parte de baixo da tela.

import { IconeInicio, IconeRadar, IconePlano, IconeAssistente, IconeTray } from "./Icones.jsx";

const ITENS = [
  { tela: "inicio", nome: "Início", Icone: IconeInicio },
  { tela: "radar", nome: "Radar", Icone: IconeRadar },
  { tela: "plano", nome: "Plano", Icone: IconePlano },
  { tela: "assistente", nome: "Assistente", Icone: IconeAssistente },
  { tela: "tray", nome: "Visão Tray", Icone: IconeTray },
];

export default function Menu({ tela, onIr }) {
  return (
    <nav className="menu" aria-label="Telas">
      {ITENS.map(({ tela: t, nome, Icone }) => (
        <button key={t} onClick={() => onIr(t)} aria-current={tela === t ? "page" : undefined}>
          <Icone />
          <span>{nome}</span>
        </button>
      ))}
    </nav>
  );
}
