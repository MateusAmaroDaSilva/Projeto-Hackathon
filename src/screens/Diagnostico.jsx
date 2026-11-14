// Diagnóstico em formato de conversa: uma pergunta por vez, respostas por toque.

import { Fragment, useEffect, useRef } from "react";
import { perguntasAtivas, textoPergunta, rotuloResposta } from "../logic/radar.js";

export default function Diagnostico({ respostas, indice, onResponder, onMarcar, onConfirmar, onTexto, onVoltar }) {
  const perguntas = perguntasAtivas(respostas);
  const i = Math.min(indice, perguntas.length - 1);
  const q = perguntas[i];
  const atual = respostas[q.id];
  const campo = useRef(null);

  // Foca e seleciona o campo de texto, para o lojista só digitar por cima da sugestão.
  useEffect(() => {
    if (campo.current) {
      campo.current.focus({ preventScroll: true });
      campo.current.select();
    }
  }, [q.id]);

  function enviarTexto(e) {
    e.preventDefault();
    onTexto(q, e.currentTarget.elements.v.value.trim());
  }

  return (
    <>
      <div>
        <span className="step-of">
          Diagnóstico · {i + 1} de {perguntas.length}
        </span>
        <div className="bar" aria-hidden="true">
          <i style={{ width: `${((i + 1) / perguntas.length) * 100}%` }} />
        </div>
      </div>

      <div className="talk">
        {perguntas.slice(0, i).map((p, k) => {
          const antiga = k < i - 1 ? " old" : "";
          return (
            <Fragment key={p.id}>
              <div className={`tb bot${antiga}`}>{textoPergunta(p, respostas)}</div>
              <div className={`tb me${antiga}`}>{rotuloResposta(p, respostas[p.id]) || "Prefiro não informar"}</div>
            </Fragment>
          );
        })}
        <div className="tb bot">{textoPergunta(q, respostas)}</div>
      </div>

      {q.tipo === "texto" ? (
        <form className="sendrow" onSubmit={enviarTexto}>
          <input
            ref={campo}
            className="field"
            name="v"
            defaultValue={atual || q.sugestao || ""}
            key={q.id}
            maxLength={60}
            autoComplete="off"
            aria-label={textoPergunta(q, respostas)}
          />
          <button className="btn" type="submit">
            Enviar
          </button>
        </form>
      ) : (
        <>
          <div className="chips" role="group" aria-label="Respostas">
            {q.opcoes.map((o) => {
              const marcada = q.multipla ? (atual || []).includes(o.valor) : atual === o.valor;
              return (
                <button
                  key={String(o.valor)}
                  className={`chipbtn big${marcada ? " sel" : ""}`}
                  aria-pressed={marcada}
                  onClick={() => (q.multipla ? onMarcar(q, o.valor) : onResponder(q, o.valor))}
                >
                  {o.rotulo}
                </button>
              );
            })}
          </div>
          {q.multipla && (
            <button className="btn" onClick={() => onConfirmar(q)}>
              Confirmar ({(atual || []).length})
            </button>
          )}
        </>
      )}

      <p className="small push-bottom">
        Não pedimos dados de clientes, senhas ou dados bancários.
        {i > 0 && (
          <>
            {" "}
            <button className="textlink" onClick={onVoltar}>
              Voltar uma pergunta
            </button>
          </>
        )}
      </p>
    </>
  );
}
