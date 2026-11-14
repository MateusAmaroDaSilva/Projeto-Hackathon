export default function Rodape({ visivel, onRecomecar }) {
  if (!visivel) return null;
  return (
    <div className="foot">
      <button className="textlink" onClick={onRecomecar}>
        Recomeçar do zero
      </button>
    </div>
  );
}
