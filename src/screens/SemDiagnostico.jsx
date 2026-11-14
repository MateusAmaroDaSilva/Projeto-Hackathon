// Mostrado em Radar, Plano e Assistente enquanto o lojista ainda não respondeu as perguntas.

export default function SemDiagnostico({ titulo, texto, onComecar }) {
  return (
    <>
      <h1>{titulo}</h1>
      <p className="lead">{texto} Primeiro precisamos conhecer a sua loja.</p>
      <button className="btn" onClick={onComecar}>
        Responder as perguntas
      </button>
    </>
  );
}
