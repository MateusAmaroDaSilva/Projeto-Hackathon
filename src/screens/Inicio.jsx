import { IconeCadeado } from "../components/Icones.jsx";
import Rodape from "../components/Rodape.jsx";

export default function Inicio({ pronto, onComecar, onIr, onRecomecar }) {
  return (
    <>
      <h1>Passos para ajudar a sua loja a chegar mais perto da primeira venda pela internet.</h1>
      <p className="lead">Você não precisa entender de tecnologia. A gente mostra o que fazer, um passo de cada vez e no seu ritmo, com tudo já escrito. Não é uma promessa de venda: é um apoio para você começar.</p>

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
            <b>Você segue os passos no seu ritmo</b>
            <span className="muted">Passos curtos, sem prazo, que podem aumentar as chances de receber o primeiro pedido.</span>
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
