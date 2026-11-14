// Radar da Primeira Venda: protótipo de hackathon para o desafio Tray.
// Guarda o estado do lojista no próprio navegador (localStorage) e troca de tela pelo menu.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Topo from "./components/Topo.jsx";
import Menu from "./components/Menu.jsx";
import Inicio from "./screens/Inicio.jsx";
import Diagnostico from "./screens/Diagnostico.jsx";
import Radar from "./screens/Radar.jsx";
import Plano from "./screens/Plano.jsx";
import Assistente from "./screens/Assistente.jsx";
import VisaoTray from "./screens/VisaoTray.jsx";
import SemDiagnostico from "./screens/SemDiagnostico.jsx";
import { PERGUNTAS } from "./data/conteudo.js";
import { perguntasAtivas, montarPlano, proximoPasso, mensagensIniciais, responderAssistente } from "./logic/radar.js";

const CHAVE = "radar-primeira-venda-react-v1";
const TELAS = { inicio: "inicio", perguntas: "perguntas", radar: "radar", plano: "plano", assistente: "assistente", tray: "visao-tray" };

const INICIAL = {
  respostas: {},
  pergunta: 0, // índice da pergunta atual no diagnóstico
  pronto: false, // diagnóstico concluído
  feitos: [], // ids dos passos concluídos
  vendeu: false, // simulação da primeira venda
  tela: "inicio",
  diaAberto: "auto", // "auto" abre o próximo passo; null fecha todos
  tons: {}, // tom escolhido para cada mensagem pronta
  conversa: [], // mensagens do assistente
};

function carregar() {
  let estado = INICIAL;
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE) || "null");
    if (salvo && salvo.respostas && Array.isArray(salvo.feitos)) estado = { ...INICIAL, ...salvo };
  } catch {
    /* sem localStorage: começa do zero */
  }
  const doLink = Object.keys(TELAS).find((t) => TELAS[t] === window.location.hash.slice(1));
  if (doLink && doLink !== "perguntas") estado = { ...estado, tela: doLink };
  if (estado.tela === "perguntas" && estado.pronto) estado = { ...estado, tela: "radar" };
  return estado;
}

export default function App() {
  const [estado, setEstado] = useState(carregar);
  const [ultima, setUltima] = useState(null); // última parte da fachada que apareceu (anima uma vez)
  const [aviso, setAviso] = useState(null);
  const [digitando, setDigitando] = useState(false);
  const rolar = useRef(null); // para onde rolar depois do próximo render
  const ocupado = useRef(false); // evita toque duplo enquanto a pergunta avança
  const folha = useRef(null);

  const { respostas, pronto, feitos, tela } = estado;
  const plano = useMemo(() => (pronto ? montarPlano(respostas) : []), [pronto, respostas]);
  const proximo = proximoPasso(plano, feitos);
  const diaAberto = estado.diaAberto === "auto" ? (proximo?.id ?? null) : estado.diaAberto;
  const conversa = estado.conversa.length ? estado.conversa : pronto ? mensagensIniciais(plano, feitos, respostas) : [];

  // Salva no navegador e mantém o endereço com a tela atual.
  useEffect(() => {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(estado));
    } catch {
      /* ignorado */
    }
  }, [estado]);

  useEffect(() => {
    try {
      window.history.replaceState(null, "", "#" + TELAS[tela]);
    } catch {
      /* ignorado */
    }
  }, [tela]);

  // Rola a tela depois que o React desenha a mudança.
  useEffect(() => {
    const alvo = rolar.current;
    if (!alvo) return;
    rolar.current = null;
    if (alvo === "topo") window.scrollTo(0, 0);
    else if (alvo === "folha") folha.current?.scrollIntoView({ block: "start" });
    else document.querySelector(alvo)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  useEffect(() => {
    if (!ultima) return;
    const t = setTimeout(() => setUltima(null), 700);
    return () => clearTimeout(t);
  }, [ultima]);

  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(null), 2800);
    return () => clearTimeout(t);
  }, [aviso]);

  const mudar = useCallback((fn, destino) => {
    if (destino) rolar.current = destino;
    setEstado((s) => ({ ...s, ...fn(s) }));
  }, []);

  // ---------- navegação ----------
  const ir = (t) => mudar(() => ({ tela: t }), ["inicio", "perguntas"].includes(t) ? "topo" : "folha");
  const comecar = () => {
    rolar.current = "topo";
    setEstado({ ...INICIAL, tela: "perguntas" });
  };
  const recomecar = () => {
    rolar.current = "topo";
    setEstado(INICIAL);
  };

  // ---------- diagnóstico ----------
  const avancar = () =>
    mudar((s) => {
      const ativas = perguntasAtivas(s.respostas);
      if (s.pergunta < ativas.length - 1) {
        rolar.current = "folha";
        return { pergunta: s.pergunta + 1 };
      }
      // Fim do diagnóstico: descarta respostas de perguntas que deixaram de valer.
      const limpas = { ...s.respostas };
      PERGUNTAS.forEach((q) => {
        if (q.quando && !q.quando(limpas)) delete limpas[q.id];
      });
      rolar.current = "folha";
      return { respostas: limpas, pronto: true, feitos: [], vendeu: false, diaAberto: "auto", conversa: [], pergunta: 0, tela: "radar" };
    });

  const responder = (q, valor) => {
    if (ocupado.current) return;
    ocupado.current = true;
    setUltima(q.id);
    mudar((s) => ({ respostas: { ...s.respostas, [q.id]: valor } }));
    setTimeout(() => {
      ocupado.current = false;
      avancar();
    }, 420);
  };

  const marcar = (q, valor) => {
    setUltima(q.id);
    mudar((s) => {
      const atual = s.respostas[q.id] || [];
      const novo = atual.includes(valor) ? atual.filter((v) => v !== valor) : [...atual, valor];
      return { respostas: { ...s.respostas, [q.id]: novo } };
    });
  };

  const confirmar = (q) => {
    if (!(respostas[q.id] || []).length) return setAviso("Marque pelo menos uma opção para continuar.");
    avancar();
  };

  const responderTexto = (q, valor) => {
    if (!valor && !q.opcional) return setAviso("Escreva o nome da loja para continuar.");
    setUltima(q.id);
    mudar((s) => {
      const r = { ...s.respostas };
      if (valor) r[q.id] = valor;
      else delete r[q.id];
      return { respostas: r };
    });
    avancar();
  };

  const voltarPergunta = () => mudar((s) => ({ pergunta: Math.max(0, s.pergunta - 1) }), "folha");

  // ---------- plano ----------
  const copiar = (texto) => {
    const falhou = () => setAviso("Não deu para copiar. Segure o dedo sobre o texto e escolha Copiar.");
    try {
      navigator.clipboard.writeText(texto).then(() => setAviso("Copiado. Agora é só colar."), falhou);
    } catch {
      falhou();
    }
  };

  const acoesPlano = {
    copiar,
    recomecar,
    alternarDia: (id) => mudar(() => ({ diaAberto: diaAberto === id ? null : id })),
    mudarTom: (id, tom) => mudar((s) => ({ tons: { ...s.tons, [id]: tom } })),
    desmarcar: (id) => mudar((s) => ({ feitos: s.feitos.filter((f) => f !== id) })),
    vender: () => mudar(() => ({ vendeu: true }), "#venda"),
    marcarFeito: (id) => {
      const novos = feitos.includes(id) ? feitos : [...feitos, id];
      const depois = proximoPasso(plano, novos);
      setAviso(
        novos.length === 3
          ? "Passo feito. A simulação da primeira venda foi liberada."
          : depois
            ? "Passo feito. O próximo já está aberto."
            : "Parabéns! Você concluiu os 7 passos."
      );
      mudar(() => ({ feitos: novos, diaAberto: "auto" }), novos.length === 3 || !depois ? "#venda" : `#dia-${depois.id}`);
    },
  };

  const abrirDia = (id) => mudar(() => ({ tela: "plano", diaAberto: id }), `#dia-${id}`);
  const irParaMeta = () => mudar(() => ({ tela: "plano" }), "#venda");

  // ---------- assistente ----------
  const enviarMensagem = (texto) => {
    if (!texto.trim()) return;
    mudar((s) => ({ conversa: [...(s.conversa.length ? s.conversa : conversa), { de: "lojista", texto }] }), ".wa-foot");
    setDigitando(true);
    setTimeout(() => {
      setDigitando(false);
      mudar((s) => {
        const planoAtual = montarPlano(s.respostas);
        const r = responderAssistente(texto, { plano: planoAtual, feitos: s.feitos, vendeu: s.vendeu, respostas: s.respostas });
        const mudouPasso = r.feitos.length !== s.feitos.length;
        return { feitos: r.feitos, diaAberto: mudouPasso ? "auto" : s.diaAberto, conversa: [...s.conversa, { de: "radar", texto: r.texto }] };
      });
    }, 600);
  };

  // ---------- telas ----------
  let conteudo;
  if (tela === "perguntas") {
    conteudo = (
      <Diagnostico
        respostas={respostas}
        indice={estado.pergunta}
        onResponder={responder}
        onMarcar={marcar}
        onConfirmar={confirmar}
        onTexto={responderTexto}
        onVoltar={voltarPergunta}
      />
    );
  } else if (tela === "radar") {
    conteudo = pronto ? (
      <Radar respostas={respostas} feitos={feitos} onIr={ir} onRecomecar={recomecar} />
    ) : (
      <SemDiagnostico titulo="Radar da sua loja" texto="Aqui aparece o que sua loja já tem e o que falta para vender pela internet." onComecar={comecar} />
    );
  } else if (tela === "plano") {
    conteudo = pronto ? (
      <Plano
        respostas={respostas}
        plano={plano}
        feitos={feitos}
        proximo={proximo}
        diaAberto={diaAberto}
        tons={estado.tons}
        vendeu={estado.vendeu}
        acoes={acoesPlano}
      />
    ) : (
      <SemDiagnostico titulo="Seus passos" texto="Aqui aparecem os 7 passos para ajudar na primeira venda, no seu ritmo." onComecar={comecar} />
    );
  } else if (tela === "assistente") {
    conteudo = pronto ? (
      <Assistente respostas={respostas} conversa={conversa} digitando={digitando} onEnviar={enviarMensagem} onRecomecar={recomecar} />
    ) : (
      <SemDiagnostico
        titulo="Assistente"
        texto="Aqui você tira dúvidas, avisa que fez um passo e atualiza o estoque por mensagem."
        onComecar={comecar}
      />
    );
  } else if (tela === "tray") {
    conteudo = <VisaoTray />;
  } else {
    conteudo = <Inicio pronto={pronto} onComecar={comecar} onIr={ir} onRecomecar={recomecar} />;
  }

  return (
    <div className="app">
      <Topo
        respostas={respostas}
        ultima={ultima}
        pronto={pronto}
        plano={plano}
        feitos={feitos}
        proximo={proximo}
        diaAberto={diaAberto}
        tela={tela}
        vendeu={estado.vendeu}
        onAbrirDia={abrirDia}
        onMeta={irParaMeta}
        onRadar={() => ir("radar")}
      />
      <main className="sheet" ref={folha}>
        {conteudo}
      </main>
      <Menu tela={tela === "perguntas" ? null : tela} onIr={ir} />
      <div aria-live="polite">{aviso && <div className="toast">{aviso}</div>}</div>
    </div>
  );
}
