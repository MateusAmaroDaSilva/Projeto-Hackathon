// Desenho da fachada da loja. Cada parte aparece quando a pergunta correspondente é respondida.
// Partes ainda sem resposta ficam tracejadas ("fantasma").

const AZUL = "#44A2D8";
const MARINHO = "#002C6A";
const AMARELO = "#FFC93C";

function Parte({ ligada, chave, ultima, children }) {
  const classe = ligada ? `on${ultima === chave ? " pop" : ""}` : "ghost";
  return <g className={classe}>{children}</g>;
}

export default function Fachada({ respostas, ultima }) {
  const r = respostas;
  const tem = (k) => r[k] !== undefined;
  const temPix = (r.paga || []).includes("pix");
  const pessoas = tem("clientes") ? (r.clientes === 50 ? 3 : r.clientes === 30 ? 2 : 1) : 2;

  return (
    <svg className="shop" viewBox="0 44 360 206" role="img" aria-label="Desenho da fachada da loja">
      <circle cx="322" cy="60" r="14" fill={AMARELO} />
      <rect x="0" y="222" width="360" height="28" fill="#A9D3EE" />
      <rect x="70" y="78" width="220" height="145" rx="4" fill="#fff" stroke={MARINHO} strokeWidth="3" />

      {/* toldo listrado */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const x = 62 + i * 39.33;
        return (
          <path
            key={i}
            d={`M${x} 78h39.33v16a19.66 9 0 0 1-39.33 0z`}
            fill={i % 2 ? "#fff" : AZUL}
            stroke={MARINHO}
            strokeWidth="2.5"
          />
        );
      })}

      {/* vitrine */}
      <rect x="86" y="122" width="114" height="72" rx="4" fill="#E4F2FB" stroke={MARINHO} strokeWidth="3" />
      {tem("seg") && (
        <g className={`on${ultima === "seg" ? " pop" : ""}`}>
          <rect x="97" y="152" width="22" height="30" rx="2" fill={AMARELO} stroke={MARINHO} strokeWidth="2" />
          <rect x="128" y="142" width="26" height="40" rx="2" fill={AZUL} stroke={MARINHO} strokeWidth="2" />
          <rect x="163" y="158" width="26" height="24" rx="2" fill="#fff" stroke={MARINHO} strokeWidth="2" />
        </g>
      )}
      <path d="M90 184h106" stroke={MARINHO} strokeWidth="3" />

      {/* porta */}
      <rect x="222" y="122" width="50" height="101" rx="4" fill={MARINHO} />
      <circle cx="232" cy="176" r="3.5" fill={AMARELO} />

      {/* selo de pagamento na porta */}
      <Parte ligada={tem("paga")} chave="paga" ultima={ultima}>
        {temPix ? (
          <rect x="239" y="138" width="17" height="17" rx="3" transform="rotate(45 247.5 146.5)" fill="#32BCAD" />
        ) : (
          <rect x="235" y="138" width="26" height="17" rx="3" fill="#fff" />
        )}
      </Parte>

      {/* balão do WhatsApp */}
      <Parte ligada={tem("whats") && r.whats !== "nao"} chave="whats" ultima={ultima}>
        <path
          d="M14 100a10 10 0 0 1 10-10h26a10 10 0 0 1 10 10v14a10 10 0 0 1-10 10H34l-10 9v-9a10 10 0 0 1-10-10z"
          fill="#25D366"
          stroke={MARINHO}
          strokeWidth="2"
        />
        <circle cx="27" cy="107" r="3" fill="#fff" stroke="none" />
        <circle cx="37" cy="107" r="3" fill="#fff" stroke="none" />
        <circle cx="47" cy="107" r="3" fill="#fff" stroke="none" />
      </Parte>

      {/* megafone da divulgação */}
      <Parte ligada={tem("divulga") && r.divulga !== "nao"} chave="divulga" ultima={ultima}>
        <path d="M18 160h10l20-11v38l-20-11H18z" fill={AMARELO} stroke={MARINHO} strokeWidth="2" strokeLinejoin="round" />
      </Parte>

      {/* clientes na calçada */}
      <Parte ligada={tem("clientes")} chave="clientes" ultima={ultima}>
        {Array.from({ length: pessoas }, (_, i) => (
          <g key={i}>
            <circle cx={22 + i * 17} cy="194" r="6.5" fill={AMARELO} stroke={MARINHO} strokeWidth="2" />
            <path d={`M${14 + i * 17} 222v-9a8 8 0 0 1 16 0v9z`} fill={AZUL} stroke={MARINHO} strokeWidth="2" />
          </g>
        ))}
      </Parte>

      {/* celular com a loja online */}
      <Parte ligada={tem("online") && r.online !== "fisica"} chave="online" ultima={ultima}>
        <rect x="306" y="80" width="42" height="72" rx="8" fill="#fff" stroke={MARINHO} strokeWidth="3" />
        <rect x="313" y="92" width="28" height="9" rx="2" fill={AZUL} />
        <rect x="313" y="107" width="12" height="14" rx="2" fill={AMARELO} />
        <rect x="329" y="107" width="12" height="14" rx="2" fill={MARINHO} />
        <rect x="313" y="128" width="28" height="6" rx="3" fill="#CCD6E8" />
      </Parte>

      {/* sacola de retirada */}
      <Parte ligada={tem("entrega")} chave="entrega" ultima={ultima}>
        <path d="M319 196v-5a8 8 0 0 1 16 0v5" fill="none" stroke={MARINHO} strokeWidth="2.5" />
        <rect x="312" y="194" width="30" height="28" rx="3" fill={AZUL} stroke={MARINHO} strokeWidth="2.5" />
      </Parte>
    </svg>
  );
}
