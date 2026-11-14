// Parte de cima do app: logo, fachada da loja e, depois do diagnóstico, a trilha de 7 dias.

import Fachada from "./Fachada.jsx";
import { IconeCheck, IconeSacola } from "./Icones.jsx";

export default function Topo({ respostas, ultima, pronto, plano, feitos, proximo, diaAberto, tela, vendeu, onAbrirDia, onMeta, onRadar }) {
  const liberada = feitos.length >= 3;

  return (
    <header className="street" aria-label="Sua loja e o caminho até a primeira venda">
      <div className="brand">
        <img src="./tray-logo.png" alt="Tray" />
        <div>
          <b>Radar da Primeira Venda</b>
          <span>Protótipo de hackathon para o desafio Tray. Não é um produto oficial.</span>
        </div>
      </div>

      <button className="shopbtn" disabled={!pronto} onClick={onRadar} aria-label={pronto ? "Ver o radar da minha loja" : undefined}>
        <Fachada respostas={respostas} ultima={ultima} />
      </button>

      {pronto && (
        <ol className="trail">
          {plano.map((passo, i) => {
            const feito = feitos.includes(passo.id);
            const hoje = proximo?.id === passo.id;
            const selecionado = tela === "plano" && diaAberto === passo.id;
            const classes = ["stop", feito && "done", hoje && "today", selecionado && "sel"].filter(Boolean).join(" ");
            return (
              <li key={passo.id}>
                <button
                  className={classes}
                  onClick={() => onAbrirDia(passo.id)}
                  aria-label={`Dia ${i + 1}: ${passo.titulo}${feito ? " (feito)" : hoje ? " (hoje)" : ""}`}
                >
                  <span className="dot">{feito ? <IconeCheck /> : i + 1}</span>
                </button>
              </li>
            );
          })}
          <li>
            <button
              className={["stop goal", vendeu ? "done" : liberada ? "" : "locked"].join(" ").trim()}
              onClick={onMeta}
              aria-label="Primeira venda pela internet"
            >
              <span className="dot">{vendeu ? <IconeCheck /> : <IconeSacola />}</span>
            </button>
          </li>
        </ol>
      )}
    </header>
  );
}
