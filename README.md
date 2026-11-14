# Radar da Primeira Venda

Protótipo de hackathon para o desafio Tray "Da loja física à primeira venda online".
Não é um produto oficial da Tray. Todos os dados são fictícios e nada sai do navegador.

Feito em React 18 com Vite e CSS puro, pensado como app de celular (coluna de até 480px).

## Como rodar

Precisa do Node.js 18 ou mais novo.

```bash
npm install
npm run dev
```

Abra o endereço que aparecer no terminal (normalmente http://localhost:5173).
Para testar no celular na mesma rede Wi-Fi, use `npm run dev -- --host` e abra o endereço "Network" no celular.

Para gerar a versão final:

```bash
npm run build
```

O resultado fica na pasta `dist/` e pode ser publicado em qualquer hospedagem estática (Vercel, Netlify, GitHub Pages).

## Estrutura

```
src/
  App.jsx               estado do app, navegação e ações
  main.jsx              ponto de entrada
  data/conteudo.js      perguntas, segmentos, preocupações e números do piloto
  logic/radar.js        regras: radar das 6 áreas, plano de 7 dias e respostas do assistente
  components/
    Topo.jsx            logo, fachada e trilha dos 7 dias
    Fachada.jsx         desenho da loja, que aparece aos poucos com as respostas
    Menu.jsx            menu fixo no rodapé
    Status.jsx          texto de status com bolinha colorida
    Rodape.jsx          link "Recomeçar do zero"
    Icones.jsx          ícones em SVG
  screens/
    Inicio.jsx          tela inicial
    Diagnostico.jsx     perguntas em formato de conversa
    Radar.jsx           prontidão, gráfico, áreas, diferenciais e divulgação
    Plano.jsx           os 7 dias e a simulação da primeira venda
    Assistente.jsx      chat simulado no estilo WhatsApp
    VisaoTray.jsx       painel interno da Tray (dados fictícios)
    SemDiagnostico.jsx  aviso para responder as perguntas primeiro
  styles/global.css     todo o visual
public/tray-logo.png    logo
```

## Onde mexer

- Trocar ou adicionar perguntas: `src/data/conteudo.js`, lista `PERGUNTAS`.
- Mudar os passos do plano ou a ordem deles: `montarPlano` em `src/logic/radar.js`.
- Mudar cores: variáveis no começo de `src/styles/global.css`.

O progresso fica salvo no `localStorage` do navegador. Para começar do zero, use "Recomeçar do zero" no app.

## O que é simulado

- A análise do Instagram, o pedido da primeira venda, o estoque e as respostas do assistente.
- Na versão real, uma IA escolheria e personalizaria os passos a partir de um catálogo curado pela Tray. Aqui isso é feito por regras em `src/logic/radar.js`.
