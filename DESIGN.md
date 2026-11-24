# Origem MS · Caderno de estrada

## Ideia

As histórias, os pratos e os caminhos de Mato Grosso do Sul aparecem como páginas de um caderno de viagem. A interface deve facilitar escolhas práticas e deixar as fotografias locais explicarem o assunto.

## Público e hierarquia

Viajantes usam o guia para descobrir destinos e reunir referências para o próprio roteiro. Restaurantes são o principal público comercial; hotéis e outros estabelecimentos também poderão apresentar informações e cardápios quando a área comercial for lançada. Enquanto ela não existe, a interface deixa esse estado explícito.

## Linguagem visual

- Página de papel mineral verde-cinza (`#F1F3EE`) com texto verde-floresta (`#202B27`), superfícies de papel mais escuro (`#E7E8DF`) e azul-rio (`#38616A`) para navegação e ações.
- Ocre (`#A86D36`) aparece em detalhes de rota, sem virar cor promocional genérica.
- Newsreader dá caráter aos títulos; IBM Plex Sans mantém menu, corpo, legendas e dados práticos legíveis.
- Fotografias são reais, contextualizadas e creditadas. Preferir imagens abertas e identificadas de paisagens, comida, fauna e patrimônio do estado. Não usar imagem gerada para simular restaurante, prato, estabelecimento ou atração existente.
- Composição editorial assimétrica, recortes definidos pelo conteúdo e cantos retos. Evitar fileiras repetidas de cartões, gradientes, selos decorativos e rótulos em caixa alta sem função.

## Componentes e comportamento

- Cabeçalho compacto e consistente, com links diretos para Gastronomia, Lugares, Cultura, Rota Bioceânica e Para estabelecimentos.
- Em telas estreitas, um menu acessível com `aria-expanded`, fechamento por Escape e fechamento após selecionar uma página.
- Na página inicial, filtros mostram somente histórias já publicadas, sincronizam o assunto com a URL e atualizam o estado acessível.
- O percurso usa um esquema textual legível em celular e separa o trajeto por Jama da alternativa por Sico. O esquema não é mapa de navegação.
- Fotografias sempre mantêm legenda próxima. Texto alternativo descreve o conteúdo real da imagem.
- Blocos editoriais aparecem suavemente ao entrar na tela, com uma pequena diferença de tempo entre foto e texto. A entrada é acionada uma vez e não se aplica com `prefers-reduced-motion`.
- Nas composições lado a lado, a fotografia pode avançar até a borda externa da tela, acompanha a altura do texto e se dissolve gradualmente no lado voltado à descrição. Em celular, ocupa a largura toda e dispensa o fade lateral.
- Respeitar `prefers-reduced-motion`; não adicionar animações sem função.

## Tipografia e espaçamento

- Títulos serifados com largura e escala editorial, sem ocupar mais de duas ou três linhas no celular.
- Texto corrido confortável para leitura, com largura de linha moderada e corpo mínimo de 15px.
- Espaços generosos entre seções; grupos de texto relacionados permanecem compactos.
- Bordas finas indicam separação estrutural. Não depender apenas de cor para mostrar seleção ou estado.

## Revisão final

- As seis páginas foram inspecionadas em navegador real a 1440, 768 e 390 pixels. Não houve rolagem horizontal, imagens quebradas nem erros no console; os títulos principais ocupam no máximo duas linhas.
- O menu móvel fecha com Escape e após escolher um link. Os filtros da página inicial são acessíveis, aceitam link direto por assunto e acompanham voltar/avançar no navegador.
- Os créditos das imagens mantêm contexto, autoria e licença. A foto de pequi mostra o fruto aberto na palma da mão em Luziânia (GO). O percurso diferencia Jama e Sico, inclui San Pedro de Atacama na passagem por Jama e separa os portos das paradas em sequência.
- A página comercial usa fotos de contexto identificadas, sem simular restaurantes ou hotéis cadastrados. As entradas ao rolar apoiam a leitura com um movimento curto, ocorrem uma vez e deixam o conteúdo visível para quem prefere movimento reduzido.
- As regras visuais restantes separam o cabeçalho, as informações comerciais e as duas alternativas do percurso. O contraste do texto corrido medido pelo inspetor foi 5,8:1.
