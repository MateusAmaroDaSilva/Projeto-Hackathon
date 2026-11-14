// Texto de status com bolinha colorida: "Você já tem", "Dá para melhorar" ou "Vamos criar".

import { STATUS } from "../data/conteudo.js";

export default function Status({ nivel, children }) {
  return <span className={`tag t${nivel}`}>{children ?? STATUS[nivel]}</span>;
}
