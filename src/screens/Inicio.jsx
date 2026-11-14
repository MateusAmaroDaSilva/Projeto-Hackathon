import { IconeCadeado } from "../components/Icones.jsx";
import Rodape from "../components/Rodape.jsx";

export default function Inicio({ pronto, onComecar, onIr, onRecomecar }) {
  return (
    <>
      <h1>Da sua loja até a primeira venda pela internet, em 7 dias.</h1>
      <p className="lead">Você não precisa entender de tecnologia. A gente mostra o que fazer, um passo por dia, com tudo já escrito.</p>

      <ol className="how">
        <li>
          <span className="n">1</span>
          <div>
            <b>Você conta como é a sua loja</b>
            <span className="muted">São perguntas simples. É só tocar na resposta.</span>
          </div>
        </li>
        <li>
          <span className="n">2</span>
          <div>
            <b>O Radar mostra o que você já tem e o que falta</b>
            <span className="muted">Sem termos técnicos.</span>
          </div>
        </li>
        <li>
          <span className="n">3</span>
          <div>
            <b>Você segue um plano de 7 dias</b>
            <span className="muted">Um passo curto por dia, até o primeiro pedido chegar.</span>
          </div>
        </li>
      </ol>

      <button className="btn" onClick={onComecar}>
        {pronto ? "Responder de novo" : "Começar"}
      </button>
      {pronto && (
        <button className="btn second" onClick={() => onIr("plano")}>
          Voltar para o meu plano
        </button>
      )}

      <p className="trust">
        <IconeCadeado />
        <span>
          <b>Seus dados ficam com você.</b> Não pedimos dados de clientes, senhas nem dados bancários.
        </span>
      </p>

      <Rodape visivel={pronto} onRecomecar={onRecomecar} />
    </>
  );
}
