// Assistente simulado no estilo WhatsApp: check-in do passo, dúvidas e atualização de estoque.

import { useState } from "react";
import Rodape from "../components/Rodape.jsx";
import { segmento } from "../logic/radar.js";

export default function Assistente({ respostas, conversa, digitando, onEnviar, onRecomecar }) {
  const [texto, setTexto] = useState("");
  const produtos = segmento(respostas).produtos;
  const atalhos = ["O que falta?", "Consegui fazer o passo", "Ainda não consegui", "Qual entrega escolher?", `${produtos[0]}: 30`];

  function enviar(e) {
    e.preventDefault();
    if (!texto.trim()) return;
    onEnviar(texto);
    setTexto("");
  }

  return (
    <>
      <h1>Assistente no WhatsApp</h1>
      <p className="lead">Lembra o passo do dia, faz o check-in e atualiza o estoque por mensagem, sem abrir painel.</p>

      <div className="wa">
        <div className="wa-head">
          <i>R</i>
          <div>
            <b>Radar · {respostas.nome}</b>
            <small>modo demonstração</small>
          </div>
        </div>

        <div className="wa-body">
          {conversa.map((m, i) => (
            <div key={i} className={`b ${m.de === "radar" ? "in" : "out"}`}>
              {m.texto}
            </div>
          ))}
          {digitando && <div className="b in">Digitando…</div>}
        </div>

        <div className="wa-foot">
          <span className="lbl">Toque em uma frase ou escreva a sua</span>
          <div className="chips">
            {atalhos.map((a) => (
              <button key={a} className="chipbtn" onClick={() => onEnviar(a)}>
                {a}
              </button>
            ))}
          </div>
          <form className="sendrow" onSubmit={enviar}>
            <input
              className="field"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escreva sua dúvida"
              autoComplete="off"
              aria-label="Mensagem"
            />
            <button className="btn" type="submit">
              Enviar
            </button>
          </form>
        </div>
      </div>

      <Rodape visivel onRecomecar={onRecomecar} />
    </>
  );
}
