// Todo o conteúdo do protótipo: segmentos, perguntas do diagnóstico e preocupações.
// Dados fictícios. Nada aqui vem de clientes ou lojas reais.

export const SEGMENTOS = {
  papelaria: {
    nome: "Papelaria",
    produtos: ["caderno universitário", "caneta azul", "lápis de cor"],
    pedidoExemplo: [
      { item: "Caderno universitário", qtd: 1, preco: 32.9 },
      { item: "Caneta azul, caixa com 4", qtd: 1, preco: 9.6 },
      { item: "Lápis de cor, 24 cores", qtd: 1, preco: 27.5 },
    ],
    vantagem: "Os sites grandes levam dias para entregar. Você tem o material hoje, no bairro.",
    diferenciais: [
      { titulo: "Kits prontos da lista escolar", texto: "Monte kits por série e escola e venda com retirada." },
      { titulo: "Personalização", texto: "Etiquetas com nome, capas e encadernação. Marketplace não faz." },
      { titulo: "Clientes de empresa", texto: "Escritórios do bairro compram todo mês. Ofereça reposição." },
      { titulo: "Atendimento que conhece o aluno", texto: "Saber qual caderno a escola pede é um diferencial seu." },
    ],
  },
  moda: {
    nome: "Moda",
    produtos: ["camiseta básica", "calça jeans", "vestido"],
    pedidoExemplo: [
      { item: "Camiseta básica, tamanho M", qtd: 2, preco: 49.9 },
      { item: "Calça jeans, número 40", qtd: 1, preco: 139 },
    ],
    vantagem: "No site grande ninguém ajuda a escolher o tamanho. Você conhece o gosto de cada cliente.",
    diferenciais: [
      { titulo: "Provar e trocar na hora", texto: "Comprou pela internet, retira e prova na loja." },
      { titulo: "Looks montados", texto: "Venda o conjunto pronto, com foto no manequim." },
      { titulo: "Reserva de novidade", texto: "Avise as clientes fiéis antes de a coleção ir para a vitrine." },
      { titulo: "Ajuste incluso", texto: "Barra e pequenos ajustes valorizam a peça." },
    ],
  },
  pet: {
    nome: "Pet shop",
    produtos: ["ração de 10 kg", "areia higiênica", "petisco"],
    pedidoExemplo: [
      { item: "Ração para adulto, 10 kg", qtd: 1, preco: 154.9 },
      { item: "Petisco natural", qtd: 2, preco: 18.5 },
    ],
    vantagem: "A ração acaba de repente. Você separa ou entrega no mesmo dia.",
    diferenciais: [
      { titulo: "Recompra lembrada", texto: "Avise quando a ração do cliente estiver acabando." },
      { titulo: "Retirada junto com o banho", texto: "O pedido fica pronto quando o pet sai do banho." },
      { titulo: "Indicação de quem conhece o animal", texto: "Você sabe a raça, a idade e a alergia de cada um." },
      { titulo: "Entrega no bairro", texto: "Saco de 10 kg é pesado. Levar até a porta vale a compra." },
    ],
  },
  mercearia: {
    nome: "Mercearia",
    produtos: ["café torrado", "queijo meia cura", "doce de leite"],
    pedidoExemplo: [
      { item: "Café torrado, 500 g", qtd: 1, preco: 34 },
      { item: "Queijo meia cura, 400 g", qtd: 1, preco: 42.9 },
      { item: "Doce de leite, 350 g", qtd: 1, preco: 19.5 },
    ],
    vantagem: "Produto fresco não viaja bem pelo correio. No seu balcão, ele chega bem.",
    diferenciais: [
      { titulo: "Cestas prontas", texto: "Café da manhã, presente e churrasco, com retirada marcada." },
      { titulo: "Pedido da semana", texto: "Clientes fixos repetem o pedido com um toque." },
      { titulo: "Origem contada", texto: "Diga de qual produtor vem cada item." },
      { titulo: "Separado e gelado", texto: "O pedido espera na geladeira até o cliente passar." },
    ],
  },
  outro: {
    nome: "Loja de bairro",
    produtos: ["o produto mais vendido", "o item da vitrine", "a novidade da semana"],
    pedidoExemplo: [
      { item: "Produto mais vendido", qtd: 1, preco: 59.9 },
      { item: "Item da vitrine", qtd: 1, preco: 34.5 },
    ],
    vantagem: "Você está perto, conhece o cliente pelo nome e resolve no mesmo dia.",
    diferenciais: [
      { titulo: "Retirada no mesmo dia", texto: "Comprou de manhã, buscou à tarde." },
      { titulo: "Atendimento de quem entende", texto: "Sua indicação vale mais que a opinião de um desconhecido." },
      { titulo: "Reserva para cliente fiel", texto: "Segure o produto para quem sempre compra." },
      { titulo: "Troca no balcão", texto: "Sem correio e sem espera." },
    ],
  },
};

const op = (valor, rotulo) => ({ valor, rotulo });

// Roteiro do diagnóstico, igual ao protótipo original do time.
// "quando" decide se a pergunta aparece, com base nas respostas anteriores.
export const PERGUNTAS = [
  {
    id: "seg",
    texto:
      "Oi! Eu sou o Radar 👋 Vou te fazer umas perguntas rápidas (uns 3 minutos) pra entender sua loja e sugerir os próximos passos. Pra começar: o que sua loja vende?",
    opcoes: [op("papelaria", "Papelaria"), op("moda", "Moda"), op("pet", "Pet shop"), op("mercearia", "Mercearia"), op("outro", "Outro")],
  },
  { id: "nome", texto: "Legal! E qual o nome da loja?", tipo: "texto", sugestao: "Papelaria Central" },
  {
    id: "online",
    texto: "E hoje, como está a parte online?",
    opcoes: [op("fisica", "Só tenho loja física"), op("loja", "Tenho loja online, mas nunca vendi"), op("market", "Vendo só em marketplace")],
  },
  {
    id: "clientes",
    texto: "Quantos clientes frequentes você conhece pelo nome ou tem o contato? (só o número, não precisa passar nomes)",
    opcoes: [op(10, "Até 10"), op(30, "Entre 10 e 50"), op(50, "Mais de 50")],
  },
  {
    id: "whats",
    texto: "Você já atende clientes pelo WhatsApp?",
    opcoes: [op("business", "Sim, WhatsApp Business"), op("pessoal", "Sim, no meu número pessoal"), op("nao", "Ainda não")],
  },
  {
    id: "divulga",
    texto: (r) => `E como a ${r.nome || "loja"} divulga os produtos hoje?`,
    opcoes: [
      op("instagram", "Instagram"),
      op("facebook", "Facebook"),
      op("status", "Status ou grupos do WhatsApp"),
      op("boca", "Boca a boca / panfleto"),
      op("nao", "Ainda não divulgo"),
    ],
  },
  {
    id: "insta",
    quando: (r) => r.divulga === "instagram",
    texto:
      "Show! Me passa o @ ou o link do Instagram da loja? Vou fazer uma análise prévia de como ela aparece por lá e sugerir roteiros de posts e vídeos.",
    tipo: "texto",
    sugestao: "@papelariacentral",
    opcional: true,
  },
  {
    id: "entrega",
    texto: "Se alguém comprar online, como você prefere entregar?",
    opcoes: [op("retira", "Cliente retira na loja"), op("bairro", "Entrego no bairro"), op("correio", "Envio pelos Correios/transportadora")],
  },
  {
    id: "paga",
    texto: "Como seus clientes podem pagar hoje na loja? Pode marcar mais de uma.",
    multipla: true,
    opcoes: [
      op("pix", "Pix"),
      op("dinheiro", "Dinheiro"),
      op("debito", "Cartão de débito"),
      op("credito", "Crédito à vista"),
      op("parcelado", "Crédito parcelado"),
      op("boleto", "Boleto"),
      op("fiado", "Fiado / caderneta"),
    ],
  },
  {
    id: "pixpreco",
    quando: (r) => (r.paga || []).includes("pix"),
    texto: "No pix, o preço muda?",
    opcoes: [op("desconto", "Dou desconto"), op("acrescimo", "Cobro acréscimo"), op("igual", "Mesmo preço")],
  },
  {
    id: "pixdesc",
    quando: (r) => (r.paga || []).includes("pix") && r.pixpreco === "desconto",
    texto: "De quanto é o desconto no pix?",
    opcoes: [op("até 5%", "Até 5%"), op("de 5% a 10%", "De 5% a 10%"), op("mais de 10%", "Mais de 10%")],
  },
  {
    id: "tempo",
    texto: "Quanto tempo por dia dá pra separar pra isso, sem atrapalhar o balcão?",
    opcoes: [op(10, "Menos de 15 min"), op(20, "15 a 30 min"), op(30, "Mais de 30 min")],
  },
  {
    id: "hora",
    texto: "Qual o horário mais tranquilo da loja?",
    opcoes: [op("logo na abertura", "Logo na abertura"), op("depois do almoço", "Depois do almoço"), op("no fim do dia", "No fim do dia")],
  },
  {
    id: "medo",
    texto: "Última: o que mais te preocupa em vender pela internet?",
    opcoes: [
      op("confianca", "“Acho que ninguém vai comprar”"),
      op("estoque", "“Não sei controlar o estoque”"),
      op("tempo", "“Não tenho tempo”"),
      op("balcao", "“Vai me atrapalhar no balcão”"),
      op("entrega", "“Frete e entrega me assustam”"),
      op("preco", "“Não sei que preço colocar”"),
    ],
  },
];

// O que o lojista sente, o que responder, e qual passo vai para o Dia 1.
export const PREOCUPACOES = {
  confianca: {
    nome: "medo de ninguém comprar",
    resposta: "A primeira venda costuma vir de quem já compra no seu balcão. Por isso o plano leva o convite até eles.",
    passo: "convite",
  },
  estoque: {
    nome: "controle do estoque",
    resposta: "Você não precisa colocar a loja inteira na internet. Poucos produtos, os que mais vendem, já bastam.",
    passo: "produtos",
  },
  tempo: { nome: "falta de tempo", resposta: "Cada passo cabe no tempo que você disse ter por dia.", passo: "resposta" },
  balcao: {
    nome: "medo de atrapalhar o balcão",
    resposta: "Com uma resposta pronta, você atende pelo celular sem largar o cliente que está na loja.",
    passo: "resposta",
  },
  entrega: {
    nome: "frete e entrega",
    resposta: "Você começa só com a retirada na loja. Não precisa de motoboy nem de Correios.",
    passo: "retirada",
  },
  preco: {
    nome: "dúvida sobre o preço",
    resposta: "Comece com o mesmo preço do balcão. Você não ganha no preço, ganha por estar perto.",
    passo: "pix",
  },
};

// Nível 0, 1 e 2 de cada área do radar.
export const STATUS = ["Vamos criar", "Dá para melhorar", "Você já tem"];

// Números fictícios do piloto, só para a tela Visão Tray.
export const PILOTO = {
  funil: [
    { etapa: "Diagnósticos feitos", total: 120 },
    { etapa: "Começaram o plano", total: 84 },
    { etapa: "Publicaram a loja", total: 52 },
    { etapa: "Concluíram os 7 passos", total: 41 },
    { etapa: "Receberam o 1º pedido online", total: 23 },
  ],
  barreiras: [
    { nome: "Confiança", pct: 38 },
    { nome: "Tempo", pct: 27 },
    { nome: "Entrega", pct: 16 },
    { nome: "Atendimento", pct: 11 },
    { nome: "Estoque", pct: 8 },
  ],
};
