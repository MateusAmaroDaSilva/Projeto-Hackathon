import Rodape from "../components/Rodape.jsx";
import { segmento, brl } from "../logic/radar.js";

const AVISO_PRONTO = "Oi! Seu pedido já está separado aqui na loja. Pode retirar hoje até as 18h. Obrigado por comprar pelo nosso site!";

function PrimeiraVenda({ respostas, feitos, vendeu, onVender, onCopiar }) {
  if (vendeu) {
    const itens = segmento(respostas).pedidoExemplo;
    const total = itens.reduce((s, i) => s + i.qtd * i.preco, 0);
    return (
      <section className="block" id="venda">
        <span className="lbl" style={{ color: "var(--good)" }}>
          Demonstração · pedido de mentira, sem dados reais
        </span>
        <h2>Chegou seu primeiro pedido pela internet</h2>
        <p>Uma cliente que recebeu seu convite pediu pelo link, já pagou no Pix e vem buscar hoje.</p>
        <table className="order">
          <tbody>
            {itens.map((i) => (
              <tr key={i.item}>
                <td>
                  {i.qtd} × {i.item}
                </td>
                <td>{brl(i.qtd * i.preco)}</td>
              </tr>
            ))}
            <tr className="tot">
              <td>Total, já pago no Pix</td>
              <td>{brl(total)}</td>
            </tr>
          </tbody>
        </table>
        <span className="lbl">O que fazer agora, no balcão</span>
        <ol className="steps">
          <li>Separe os produtos do pedido.</li>
          <li>Coloque o nome da cliente na sacola.</li>
          <li>Avise pelo WhatsApp que o pedido está pronto.</li>
        </ol>
        <pre className="msg">{AVISO_PRONTO}</pre>
        <button className="btn second" onClick={() => onCopiar(AVISO_PRONTO)}>
          Copiar aviso de pedido pronto
        </button>
      </section>
    );
  }
  if (feitos.length >= 3) {
    return (
      <section className="block" id="venda">
        <h2>Sua loja já está mais preparada para receber pedidos</h2>
        <p>Veja, em uma simulação, como um pedido chegaria para você no balcão.</p>
        <button className="btn" onClick={onVender}>
          Simular a chegada da primeira venda
        </button>
      </section>
    );
  }
  return <span id="venda" />;
}

function Dia({ passo, numero, feito, hoje, aberto, tom, onAlternar, onTom, onFeito, onDesfazer, onCopiar }) {
  const texto = passo.texto ? (tom === "formal" && passo.textoFormal ? passo.textoFormal : passo.texto) : "";
  const classes = ["day", feito && "done", hoje && "today"].filter(Boolean).join(" ");

  return (
    <section className={classes} id={`dia-${passo.id}`}>
      <button className="day-h" onClick={onAlternar} aria-expanded={aberto}>
        <span className="day-n">
          <small>PASSO</small>
          {numero}
        </span>
        <span>
          <b>{passo.titulo}</b>
          <span className="small">Leva {passo.minutos} minutos</span>
        </span>
        <span className={`chip${feito ? " done" : hoje ? " today" : ""}`}>{feito ? "Feito" : hoje ? "Fazer agora" : aberto ? "Fechar" : "Abrir"}</span>
      </button>

      {aberto && (
        <div className="day-b">
          <div>
            <span className="lbl">Por que fazer</span>
            <p>{passo.porque}</p>
          </div>
          <div>
            <span className="lbl">Como fazer</span>
            <ol className="steps">
              {passo.comoFazer.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ol>
          </div>

          {texto && (
            <>
              <div>
                <div className="scoreline">
                  <span className="lbl">{passo.botaoCopiar === "Copiar texto" ? "Texto pronto" : "Mensagem pronta"}</span>
                  {passo.textoFormal && (
                    <div className="seg" role="group" aria-label="Tom da mensagem">
                      <button aria-pressed={tom !== "formal"} onClick={() => onTom("proximo")}>
                        Tom próximo
                      </button>
                      <button aria-pressed={tom === "formal"} onClick={() => onTom("formal")}>
                        Tom formal
                      </button>
                    </div>
                  )}
                </div>
                <pre className="msg">{texto}</pre>
              </div>
              <button className="btn second" onClick={() => onCopiar(texto)}>
                {passo.botaoCopiar}
              </button>
            </>
          )}

          {passo.nota && <p className="small">{passo.nota}</p>}

          {feito ? (
            <p>
              <b style={{ color: "var(--good)" }}>Você já fez este passo.</b>{" "}
              <button className="textlink" onClick={onDesfazer}>
                Desmarcar
              </button>
            </p>
          ) : (
            <button className="btn ok" onClick={onFeito}>
              Já fiz este passo
            </button>
          )}
        </div>
      )}
    </section>
  );
}

export default function Plano({ respostas, plano, feitos, proximo, diaAberto, tons, vendeu, acoes }) {
  const n = feitos.length;
  const resumo = n === 7 ? "Você concluiu os 7 passos." : n === 0 ? "Nenhum passo feito ainda. Comece pelo Passo 1." : `Você já fez ${n} de 7 passos.`;

  return (
    <>
      <h1>Passos para melhorar, no seu ritmo.</h1>
      <p className="lead">
        Sem prazo: faça no seu ritmo{respostas.tempo === 10 ? ", todos os passos com 10 minutos ou menos" : ""}. Sugestão: fazer {respostas.hora}.
      </p>

      <div>
        <b>{resumo}</b>
        <div className="segs" role="img" aria-label={`${n} de 7 passos feitos`}>
          {plano.map((p) => (
            <i key={p.id} className={feitos.includes(p.id) ? "done" : proximo?.id === p.id ? "on" : ""} />
          ))}
        </div>
      </div>

      <PrimeiraVenda respostas={respostas} feitos={feitos} vendeu={vendeu} onVender={acoes.vender} onCopiar={acoes.copiar} />

      <div className="days">
        {plano.map((p, i) => (
          <Dia
            key={p.id}
            passo={p}
            numero={i + 1}
            feito={feitos.includes(p.id)}
            hoje={proximo?.id === p.id}
            aberto={diaAberto === p.id}
            tom={tons[p.id] || "proximo"}
            onAlternar={() => acoes.alternarDia(p.id)}
            onTom={(t) => acoes.mudarTom(p.id, t)}
            onFeito={() => acoes.marcarFeito(p.id)}
            onDesfazer={() => acoes.desmarcar(p.id)}
            onCopiar={acoes.copiar}
          />
        ))}
      </div>

      <Rodape visivel onRecomecar={acoes.recomecar} />
    </>
  );
}
