// Regras do protótipo: o que mostrar no radar e como montar o plano de 7 dias.
// Na versão real, uma IA escolheria e personalizaria os passos de um catálogo da Tray.
// Aqui tudo é feito por regras simples, a partir das respostas do diagnóstico.

import { SEGMENTOS, PERGUNTAS, PREOCUPACOES } from "../data/conteudo.js";

export const perguntasAtivas = (r) => PERGUNTAS.filter((q) => !q.quando || q.quando(r));

export const textoPergunta = (q, r) => (typeof q.texto === "function" ? q.texto(r) : q.texto);

export function rotuloResposta(q, valor) {
  if (q.tipo === "texto") return valor;
  if (q.multipla) return (valor || []).map((v) => q.opcoes.find((o) => o.valor === v)?.rotulo).join(", ");
  return q.opcoes.find((o) => o.valor === valor)?.rotulo;
}

export const segmento = (r) => SEGMENTOS[r.seg] || SEGMENTOS.outro;

export const preocupacao = (r) => PREOCUPACOES[r.medo] || PREOCUPACOES.balcao;

export const linkLoja = (r) =>
  "loja.exemplo/" +
  ((r.nome || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^a-z0-9]+/g, "") || "minhaloja");

export const brl = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// As 6 áreas do radar. nivel: 0 = vamos criar, 1 = dá para melhorar, 2 = você já tem.
export function retrato(r) {
  const temPix = (r.paga || []).includes("pix");
  const temCartao = (r.paga || []).some((x) => ["debito", "credito", "parcelado"].includes(x));
  const canal = { instagram: "no Instagram", facebook: "no Facebook", status: "pelo WhatsApp", boca: "no boca a boca" }[r.divulga];

  return [
    {
      chave: "clientes",
      nome: "Clientes fiéis",
      curto: "Clientes",
      nivel: r.clientes === 10 ? 1 : 2,
      detalhe:
        r.clientes === 10
          ? "Você conhece até 10 clientes pelo nome. É por eles que a primeira venda começa."
          : `Você tem ${r.clientes === 30 ? "entre 10 e 50" : "mais de 50"} clientes que já confiam na loja. Eles compram primeiro.`,
    },
    {
      chave: "paga",
      nome: "Pagamento",
      curto: "Pagamento",
      nivel: temPix ? 2 : temCartao ? 1 : 0,
      detalhe: temPix
        ? "Você já recebe no Pix. É o jeito mais simples de vender pela internet."
        : temCartao
          ? "Você aceita cartão. Com o Pix, o pedido da internet fica pago na hora."
          : "Para vender pela internet, o cliente precisa pagar sozinho. O Pix resolve.",
    },
    {
      chave: "entrega",
      nome: "Entrega",
      curto: "Entrega",
      nivel: r.entrega === "retira" ? 2 : 1,
      detalhe:
        r.entrega === "retira"
          ? "O cliente busca na loja. Não precisa de motoboy nem de embalagem."
          : r.entrega === "bairro"
            ? "Entregar no bairro funciona. Para começar, a retirada na loja é ainda mais simples."
            : "Correios e transportadora dão trabalho. Comece pela retirada na loja.",
    },
    {
      chave: "whats",
      nome: "Atendimento pelo WhatsApp",
      curto: "Atendimento",
      nivel: r.whats === "business" ? 2 : r.whats === "pessoal" ? 1 : 0,
      detalhe:
        r.whats === "business"
          ? "Você já usa o WhatsApp Business. Falta só salvar uma resposta pronta."
          : r.whats === "pessoal"
            ? "Você atende pelo número pessoal. O WhatsApp Business salva respostas prontas."
            : "A maioria dos pedidos começa por mensagem. Vamos criar o WhatsApp da loja.",
    },
    {
      chave: "divulga",
      nome: "Divulgação",
      curto: "Divulgação",
      nivel: r.divulga === "nao" ? 0 : 1,
      detalhe:
        r.divulga === "nao"
          ? "Seus clientes ainda não sabem que podem comprar pela internet."
          : `Você já divulga ${canal}. Falta dizer como comprar pela internet.`,
    },
    {
      chave: "online",
      nome: "Loja na internet",
      curto: "Loja online",
      nivel: r.online === "fisica" ? 0 : 1,
      detalhe:
        r.online === "fisica"
          ? "Sua loja ainda não está na internet. Bastam poucos produtos para começar."
          : r.online === "loja"
            ? "A loja já existe. Falta a primeira venda."
            : "Você vende em marketplace. Na loja própria, o cliente do bairro compra direto de você.",
    },
  ];
}

export function prontidao(areas) {
  const nota = Math.round((areas.reduce((s, a) => s + a.nivel, 0) / 12) * 100);
  const faixa = nota < 34 ? "Inicial" : nota < 67 ? "Intermediária" : "Avançada";
  return { nota, faixa };
}

export const areaMaisFraca = (areas) => [...areas].sort((a, b) => a.nivel - b.nivel)[0];

// Monta os 7 passos. A ordem muda conforme a preocupação e o estágio da loja.
export function montarPlano(r) {
  const qtd = r.tempo === 10 ? 5 : 10;
  const limite = (m) => (r.tempo === 10 ? Math.min(m, 10) : m);
  const link = linkLoja(r);
  const p = segmento(r).produtos;
  const nome = r.nome || "loja";
  const temPix = (r.paga || []).includes("pix");
  const bio = `Peça pelo celular e retire na loja no mesmo dia: ${link}`;

  const passos = {};

  passos.produtos =
    r.online === "fisica"
      ? {
          titulo: `Coloque seus ${qtd} produtos mais vendidos na internet`,
          curto: `${qtd} produtos na internet`,
          minutos: limite(15),
          porque: "Você não precisa da loja inteira na internet. Poucos produtos, os que mais saem, bastam para a primeira venda.",
          comoFazer: [
            `Separe os ${qtd} produtos que mais saem no balcão.`,
            "Tire uma foto de cada um, perto de uma janela.",
            "Cadastre o nome, a foto e o preço de cada um na sua loja Tray.",
          ],
        }
      : {
          titulo: `Deixe seus ${qtd} produtos mais vendidos com foto e preço`,
          curto: `Fotos de ${qtd} produtos`,
          minutos: limite(15),
          porque: "O cliente só compra o que consegue ver. Boas fotos dos campeões de venda fazem a diferença.",
          comoFazer: [
            `Separe os ${qtd} produtos que mais saem no balcão.`,
            "Leve para perto de uma janela, com um fundo liso atrás.",
            "Tire uma foto de frente e outra de perto.",
            r.online === "market"
              ? "Coloque as fotos e os preços na sua loja própria da Tray."
              : "Troque as fotos antigas pelas novas e confira os preços.",
          ],
        };

  passos.retirada = {
    titulo: r.entrega === "bairro" ? "Ligue a retirada na loja e a entrega no bairro" : "Ligue a opção de retirar na loja",
    curto: "Retirar na loja",
    minutos: 5,
    porque:
      r.entrega === "correio"
        ? "Correios e transportadora pedem embalagem e cálculo de frete. Deixe isso para depois da primeira venda."
        : "É a forma mais simples de entregar. O cliente compra pelo celular e busca no balcão.",
    comoFazer: [
      "Abra o painel da sua loja.",
      "Nas formas de entrega, ligue a retirada na loja.",
      "Escolha até que horas o cliente pode buscar. Por exemplo, até as 18h.",
      r.entrega === "bairro"
        ? "Para a entrega no bairro, defina uma taxa fixa. Por exemplo, R$ 6."
        : "Separe um lugar no balcão para os pedidos prontos.",
    ],
  };

  passos.pix = temPix
    ? {
        titulo: r.pixpreco === "desconto" ? "Mostre o desconto do Pix na loja" : "Mostre como pagar e como receber",
        curto: "Pix e condições",
        minutos: 10,
        porque: "O cliente decide mais rápido quando vê o preço e a forma de pagar sem precisar perguntar.",
        comoFazer: ["Toque em “Copiar texto”.", "Confira se os valores estão certos.", "Cole o texto na página da loja."],
        botaoCopiar: "Copiar texto",
        texto: `${
          r.pixpreco === "desconto"
            ? `Pagando no Pix você tem desconto de ${r.pixdesc || "até 5%"}.`
            : "Pagamento no Pix, aprovado na hora."
        }\nRetirada na loja no mesmo dia, para pedidos feitos até as 16h.\nTroca em até 7 dias, direto no balcão.`,
      }
    : {
        titulo: "Passe a receber no Pix",
        curto: "Receber no Pix",
        minutos: 10,
        porque: "Na internet o cliente precisa pagar sozinho. Com o Pix, o pedido já chega pago.",
        comoFazer: [
          "Abra o painel da sua loja.",
          "Nas formas de pagamento, ligue o Pix.",
          "Informe a chave Pix da conta da loja.",
          "Faça um pedido de teste com um valor pequeno.",
        ],
      };

  passos.resposta = {
    titulo: r.whats === "business" ? "Deixe pronta a resposta para “tem esse produto?”" : "Use o WhatsApp Business com uma resposta pronta",
    curto: "Resposta pronta",
    minutos: 10,
    porque: "Quando o cliente pergunta, ele já quer comprar. Com o link na resposta, ele mesmo fecha o pedido.",
    comoFazer: [
      ...(r.whats === "business" ? [] : ["Instale o WhatsApp Business no celular da loja. Ele é gratuito."]),
      "Toque em “Copiar mensagem”.",
      "No WhatsApp Business, salve como resposta rápida.",
      "Quando perguntarem se tem um produto, envie essa resposta.",
    ],
    botaoCopiar: "Copiar mensagem",
    texto: `Oi! Temos sim. Tem ${p[0]} disponível.\nVocê pode garantir o seu por este link: ${link}\nPaga no Pix e retira hoje mesmo na loja.`,
    textoFormal: `Olá! Temos ${p[0]} disponível.\nO pedido pode ser feito neste link: ${link}\nO pagamento é por Pix e a retirada é na loja, no mesmo dia.`,
  };

  passos.convite = {
    titulo: `Avise seus ${r.clientes} melhores clientes`,
    curto: `Convite a ${r.clientes} clientes`,
    minutos: limite(15),
    porque: "Quem já confia na sua loja é quem compra primeiro pela internet.",
    comoFazer: [
      `Pense nos ${r.clientes} clientes que mais compram com você.`,
      "Toque em “Copiar mensagem”.",
      "Envie para cada um pelo WhatsApp, trocando [nome] pelo nome da pessoa.",
    ],
    botaoCopiar: "Copiar mensagem",
    nota: "Envie só para quem já tem o número da loja salvo. O Radar não guarda nenhum contato.",
    texto: `Oi, [nome]! Aqui é da loja ${nome}.\nAgora você pode pedir pelo celular e retirar na loja, sem fila: ${link}\nJá tem ${p[0]}, ${p[1]} e ${p[2]} por lá. Qualquer dúvida, é só me chamar.`,
    textoFormal: `Olá, [nome]. Aqui é da loja ${nome}.\nAgora recebemos pedidos pela internet, com retirada na loja: ${link}\nJá estão disponíveis ${p[0]}, ${p[1]} e ${p[2]}. Estamos à disposição.`,
  };

  passos.divulga =
    r.divulga === "instagram"
      ? {
          titulo: "Coloque o link da loja no Instagram",
          curto: "Link no Instagram",
          minutos: 5,
          porque: "Seu perfil já mostra os produtos. Falta dizer como comprar.",
          comoFazer: [`Abra o perfil ${r.insta || "da loja"} no Instagram.`, "Toque em “Editar perfil”.", "Cole o texto abaixo na descrição do perfil."],
          botaoCopiar: "Copiar texto",
          texto: bio,
        }
      : r.divulga === "facebook"
        ? {
            titulo: "Publique o link da loja no Facebook",
            curto: "Link no Facebook",
            minutos: 5,
            porque: "Quem já acompanha a loja no Facebook precisa saber que pode comprar pelo celular.",
            comoFazer: ["Abra a página da loja no Facebook.", "Crie uma publicação com a foto de um produto.", "Cole o texto abaixo e publique."],
            botaoCopiar: "Copiar texto",
            texto: bio,
          }
        : r.divulga === "status"
          ? {
              titulo: "Publique 3 produtos no status do WhatsApp",
              curto: "Status do WhatsApp",
              minutos: 10,
              porque: "Seus contatos já olham o status. É o lugar mais fácil para mostrar que dá para comprar.",
              comoFazer: ["Escolha 3 produtos que vendem bem.", "Publique uma foto de cada um no status.", "Em cada foto, cole o texto abaixo."],
              botaoCopiar: "Copiar texto",
              texto: bio,
            }
          : {
              titulo: "Coloque um cartaz com o endereço da loja no balcão",
              curto: "Cartaz no balcão",
              minutos: 10,
              porque: "Quem já está na loja é o primeiro a saber. O cartaz avisa sem você precisar falar.",
              comoFazer: ["Copie o texto abaixo.", "Escreva em uma folha, com letra grande.", "Cole perto do caixa, onde o cliente espera."],
              botaoCopiar: "Copiar texto",
              texto: `Agora você pode pedir pelo celular e retirar aqui.\nAcesse: ${link}`,
            };

  passos.lembrete = {
    titulo: "Mande um lembrete para quem ainda não comprou",
    curto: "Lembrete final",
    minutos: 10,
    porque: "Muita gente abre o link e deixa para depois. Um lembrete gentil ajuda a fechar.",
    comoFazer: ["Toque em “Copiar mensagem”.", "Envie só para quem recebeu o convite e ainda não comprou."],
    botaoCopiar: "Copiar mensagem",
    texto: `Oi, [nome]! Só para lembrar: você pode pedir pelo celular e retirar na loja no mesmo dia.\nO link é ${link}`,
    textoFormal: `Olá, [nome]. Lembramos que os pedidos pela internet seguem disponíveis, com retirada na loja no mesmo dia: ${link}`,
  };

  const base = ["produtos", "retirada", "pix", "resposta", "convite", "divulga", "lembrete"];
  const primeiro = preocupacao(r).passo;
  let ordem = r.online === "fisica" ? ["produtos", primeiro] : [primeiro];
  ordem = [...new Set(ordem)];
  ordem = [...ordem, ...base.filter((id) => !ordem.includes(id))];
  return ordem.map((id) => ({ id, ...passos[id] }));
}

export const proximoPasso = (plano, feitos) => plano.find((p) => !feitos.includes(p.id));

export function mensagensIniciais(plano, feitos, r) {
  const prox = proximoPasso(plano, feitos);
  return [
    { de: "radar", texto: "Oi! Eu sou o assistente do Radar." },
    {
      de: "radar",
      texto: prox ? `Seu próximo passo é “${prox.titulo}”. Leva ${prox.minutos} minutos, quando você puder.` : "Você concluiu os 7 passos. Parabéns!",
    },
    {
      de: "radar",
      texto: `Pode me perguntar sobre entrega, Pix e fotos. Para atualizar o estoque, escreva assim: ${segmento(r).produtos[1]}: 80`,
    },
  ];
}

// Respostas simuladas do assistente. Retorna o texto e a nova lista de passos feitos.
export function responderAssistente(mensagem, { plano, feitos, vendeu, respostas }) {
  const x = mensagem.toLowerCase();
  const prox = proximoPasso(plano, feitos);
  const estoque = mensagem.match(/^\s*(.+?)\s*:\s*(\d+)\s*$/);

  if (estoque) return { texto: `Anotado: ${estoque[1]} com ${estoque[2]} unidades. Atualizei o estoque da loja online (simulação).`, feitos };

  if (x.includes("consegui") && !x.includes("não") && !x.includes("nao")) {
    if (!prox) return { texto: "Você já concluiu os 7 passos. Agora é continuar avisando seus clientes.", feitos };
    const novos = [...feitos, prox.id];
    const depois = proximoPasso(plano, novos);
    return {
      texto: `Boa! Marquei “${prox.titulo}” como feito. ${depois ? `O próximo é “${depois.titulo}”, ${depois.minutos} minutos.` : "Os 7 passos estão feitos!"}${
        novos.length === 3 ? " A simulação da primeira venda já está liberada na tela Plano." : ""
      }`,
      feitos: novos,
    };
  }
  if (x.includes("não consegui") || x.includes("nao consegui"))
    return {
      texto: prox
        ? `Sem problema. Faça só a primeira parte de “${prox.titulo}” hoje, ${respostas.hora}. Amanhã eu lembro você do resto.`
        : "Tudo certo, não há passo pendente.",
      feitos,
    };
  if (x.includes("falta"))
    return {
      texto: vendeu
        ? "Você já fez sua primeira venda pela internet. Falta só manter os lembretes aos clientes."
        : prox
          ? `Faltam ${7 - feitos.length} passos. O próximo é “${prox.titulo}”, ${prox.minutos} minutos.`
          : "Nada pendente. Os 7 passos estão feitos.",
      feitos,
    };
  if (x.includes("entrega") || x.includes("frete"))
    return {
      texto: "Comece só com a retirada na loja: não precisa de motoboy nem de embalagem. Entrega no bairro e Correios ficam para depois da primeira venda.",
      feitos,
    };
  if (x.includes("pix") || x.includes("pag")) return { texto: "Deixe o Pix como primeira opção: o pedido já chega pago e você separa em seguida.", feitos };
  if (x.includes("foto")) return { texto: "Perto de uma janela, com fundo liso. Uma foto de frente e outra de perto.", feitos };
  return { texto: "Posso ajudar com o passo do dia, entrega, Pix, fotos e estoque. Tente “O que falta?”.", feitos };
}
