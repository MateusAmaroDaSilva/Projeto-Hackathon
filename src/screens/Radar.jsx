import Status from "../components/Status.jsx";
import Rodape from "../components/Rodape.jsx";
import { STATUS } from "../data/conteudo.js";
import { retrato, prontidao, areaMaisFraca, preocupacao, segmento } from "../logic/radar.js";

const CORES_NIVEL = ["#1E4FB8", "#FFC93C", "#16733F"];

// Gráfico de radar com as 6 áreas, desenhado em SVG.
function GraficoRadar({ areas }) {
  const cx = 180;
  const cy = 140;
  const R = 92;
  const ponto = (i, f) => {
    const a = ((-90 + i * 60) * Math.PI) / 180;
    return [cx + Math.cos(a) * R * f, cy + Math.sin(a) * R * f];
  };
  const escala = (nivel) => 0.34 + nivel * 0.33;
  const poligono = (pts) => pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

  return (
    <svg className="radar" viewBox="0 0 360 280" role="img" aria-label="Gráfico de radar com as seis áreas da loja">
      {[0.34, 0.67, 1].map((n) => (
        <polygon key={n} points={poligono(areas.map((_, i) => ponto(i, n)))} fill="none" stroke="#CCD6E8" strokeWidth="1.5" />
      ))}
      {areas.map((_, i) => {
        const [x, y] = ponto(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#CCD6E8" strokeWidth="1.5" />;
      })}
      <polygon
        className="shape"
        points={poligono(areas.map((a, i) => ponto(i, escala(a.nivel))))}
        fill="rgba(68,162,216,.3)"
        stroke="#002C6A"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {areas.map((a, i) => {
        const [x, y] = ponto(i, escala(a.nivel));
        const [lx, ly] = ponto(i, 1.22);
        const ancora = Math.abs(lx - cx) < 8 ? "middle" : lx > cx ? "start" : "end";
        return (
          <g key={a.chave}>
            <circle cx={x} cy={y} r="6" fill={CORES_NIVEL[a.nivel]} stroke="#fff" strokeWidth="2" />
            <text x={lx} y={ly + 5} textAnchor={ancora} fontFamily="Lexend, Verdana, sans-serif" fontSize="14" fontWeight="600" fill="#0B1F4B">
              {a.curto}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Radar({ respostas, feitos, onIr, onRecomecar }) {
  const r = respostas;
  const areas = retrato(r);
  const { nota, faixa } = prontidao(areas);
  const fraca = areaMaisFraca(areas);
  const medo = preocupacao(r);
  const seg = segmento(r);
  const canal = { instagram: "Instagram", facebook: "Facebook", status: "Status do WhatsApp", boca: "Boca a boca", nao: "Sem divulgação" }[r.divulga];
  const estagio = r.online === "fisica" ? "Só loja física" : r.online === "loja" ? "Loja online sem vendas" : "Só em marketplace";

  return (
    <>
      <h1>Radar da {r.nome}</h1>

      <section className="block">
        <div className="scoreline">
          <div>
            <span className="lbl">Prontidão para vender online</span>
            <div className="score">
              <b>{nota}</b>
              <span>de 100 · {faixa}</span>
            </div>
          </div>
          <Status nivel={0}>{estagio}</Status>
        </div>
        <div className="radarbox">
          <GraficoRadar areas={areas} />
          <ul className="have compact">
            {areas.map((a) => (
              <li key={a.chave}>
                <b>{a.nome}</b>
                <Status nivel={a.nivel} />
              </li>
            ))}
          </ul>
        </div>
        <p className="small">Estimativa feita a partir das suas respostas, não de dados da loja. Serve para mostrar por onde começar.</p>
      </section>

      <section className="block">
        <h2>O que mais pode melhorar agora</h2>
        <div className="feelrow">
          <div className="feel">
            <span className="lbl">O que você sente</span>
            <b>{medo.nome.charAt(0).toUpperCase() + medo.nome.slice(1)}</b>
          </div>
          <div className="feel">
            <span className="lbl">O que suas respostas mostram</span>
            <b>{fraca.nome}</b>
          </div>
        </div>
        <p>{medo.resposta}</p>
        <p className="muted">{fraca.detalhe}</p>
        <button className="btn" onClick={() => onIr("plano")}>
          {feitos.length ? "Continuar meus passos" : "Ver meus passos"}
        </button>
      </section>

      <section className="block">
        <h2>As 6 áreas, uma por uma</h2>
        <ul className="have">
          {[...areas]
            .sort((a, b) => a.nivel - b.nivel)
            .map((a) => (
              <li key={a.chave}>
                <b>{a.nome}</b>
                <Status nivel={a.nivel}>{STATUS[a.nivel]}</Status>
                <p>{a.detalhe}</p>
              </li>
            ))}
        </ul>
      </section>

      <section className="block">
        <h2>Como se destacar em {seg.nome.toLowerCase()}</h2>
        <p>
          <b>Sua vantagem sobre as lojas grandes:</b> {seg.vantagem}
        </p>
        <ul className="difs">
          {seg.diferenciais.map((d) => (
            <li key={d.titulo}>
              <b>{d.titulo}</b>
              <span>{d.texto}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="block">
        <div className="scoreline">
          <h2>Sua divulgação</h2>
          <Status nivel={1}>{canal} · análise simulada</Status>
        </div>
        {r.divulga === "instagram" ? (
          <>
            <p>
              Analisamos {r.insta || "o perfil da loja"}: o perfil mostra produtos, mas ainda não diz <b>como comprar</b>.
            </p>
            <ul className="plain">
              <li>A descrição do perfil não tem o link para pedir.</li>
              <li>As fotos não mostram o preço.</li>
              <li>Nenhuma publicação recente explica a retirada na loja.</li>
            </ul>
          </>
        ) : r.divulga === "nao" ? (
          <p>A loja ainda não divulga os produtos. Os roteiros abaixo servem para começar pelo canal mais fácil: o status do WhatsApp.</p>
        ) : (
          <p>
            Você já divulga por {canal.toLowerCase()}. Falta dizer, em cada divulgação, <b>como comprar pela internet</b>.
          </p>
        )}
        <span className="lbl">Roteiros prontos de posts e vídeos</span>
        <ol className="steps">
          <li>
            <span>
              <b>Vídeo de 15 segundos.</b> Mostre o balcão e um pedido separado. Diga: “pediu pelo celular, retirou sem fila”.
            </span>
          </li>
          <li>
            <span>
              <b>Post com preço.</b> Foto de {seg.produtos[0]} com o valor e a frase “peça pelo link e retire hoje”.
            </span>
          </li>
          <li>
            <span>
              <b>Status do WhatsApp.</b> Três produtos da semana, um por imagem, com o link da loja.
            </span>
          </li>
        </ol>
      </section>

      <Rodape visivel onRecomecar={onRecomecar} />
    </>
  );
}
