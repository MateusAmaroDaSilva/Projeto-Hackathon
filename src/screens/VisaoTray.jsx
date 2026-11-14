// Tela interna da Tray. Todos os números são fictícios.

import Status from "../components/Status.jsx";
import { PILOTO } from "../data/conteudo.js";

export default function VisaoTray() {
  const { funil, barreiras } = PILOTO;
  const maiorBarreira = barreiras[0].pct;

  return (
    <>
      <span className="step-of">Tela da equipe Tray, não do lojista</span>
      <h1>Como a Tray acompanha</h1>
      <p className="lead">Dados fictícios de um piloto, para ilustrar as métricas do caso de investimento.</p>

      <div className="stats two">
        <div>
          <b>49%</b>das lojas que começaram concluíram os 7 passos
        </div>
        <div>
          <b>62%</b>melhoraram ao menos uma área ao refazer o diagnóstico
        </div>
      </div>

      <section className="block">
        <h2>Funil de ativação</h2>
        {funil.map((f, i) => (
          <div key={f.etapa}>
            <div className="barrow">
              <span className="bl">{f.etapa}</span>
              <span className="t">
                <i style={{ width: `${(f.total / funil[0].total) * 100}%` }} />
              </span>
              <b>{f.total}</b>
            </div>
            {i < funil.length - 1 && <div className="drop">{Math.round((funil[i + 1].total / f.total) * 100)}% seguem para a próxima etapa</div>}
          </div>
        ))}
      </section>

      <section className="block">
        <h2>Alertas de desistência</h2>
        <div className="alert hi">
          <i />
          <div>
            <b>Pet Amigo</b> · loja publicada há 6 dias, nenhuma divulgação enviada
            <span>Ação: especialista da Tray entra em contato</span>
          </div>
        </div>
        <div className="alert">
          <i />
          <div>
            <b>Ótica Visão</b> · 10 dias sem avançar nenhum passo
            <span>Ação automática: lembrete com versão de 5 minutos pelo WhatsApp</span>
          </div>
        </div>
        <div className="alert">
          <i />
          <div>
            <b>Empório Dona Lu</b> · passos concluídos, loja ainda sem visitas
            <span>Ação: novos passos de divulgação e roteiros de vídeo</span>
          </div>
        </div>
      </section>

      <section className="block">
        <h2>Barreira principal declarada</h2>
        {barreiras.map((b) => (
          <div key={b.nome} className="barrow">
            <span className="bl">{b.nome}</span>
            <span className="t">
              <i style={{ width: `${(b.pct / maiorBarreira) * 100}%` }} />
            </span>
            <b>{b.pct}%</b>
          </div>
        ))}
        <p className="small">Esses dados alimentam o catálogo de passos: a Tray aprende o que trava o varejo local.</p>
      </section>

      <section className="block">
        <h2>Gate 1 · fim do piloto (3 meses)</h2>
        <div className="gate">
          <span>Começaram → concluíram os 7 passos</span>
          <span>
            <b>49%</b> <Status nivel={2}>meta: 40% ou mais</Status>
          </span>
        </div>
        <div className="gate">
          <span>Loja publicada → 1º pedido</span>
          <span>
            <b>44%</b> <Status nivel={1}>acompanhar</Status>
          </span>
        </div>
        <div className="gate">
          <span>Custo por loja ativa</span>
          <span>
            <b>R$ 240</b> <Status nivel={2}>meta: menos de R$ 300</Status>
          </span>
        </div>
      </section>

      <p className="banner">Todos os números desta tela são hipóteses ilustrativas, a validar no piloto com a Tray.</p>
    </>
  );
}
