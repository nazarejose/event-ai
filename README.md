# Event AI

![Event AI Header](./public/fotoHero.jpg)

**Event AI** é uma aplicação web moderna projetada para revolucionar a forma como os usuários descobrem eventos. De shows a conferências corporativas locais e globais, a plataforma entrega uma experiência fluida, responsiva e altamente visual, suportada pela robusta API da Ticketmaster.

> **Status:** MVP Finalizado ✅

---

## 🎯 Arquitetura & Decisões do Projeto

Como desenvolvedor fullstack, projetei esta aplicação focando em performance, experiência do usuário (UX) e manutenção de código a longo prazo. Abaixo, detalho as respostas para as principais questões arquiteturais desta aplicação.

### A. O que foi desenvolvido e com quais tecnologias?
O **Event AI** é uma Single Page Application (SPA) focada na exploração geolocalizada e textual de eventos culturais e de entretenimento.

A stack tecnológica principal consiste em:
- **Core:** React 18, TypeScript, Vite.
- **Estilização e UI:** Tailwind CSS v4, Lucide React (ícones), Headless UI concepts.
- **Animações:** GSAP (para stagger dinâmico nas listas de cards) e **Magic UI** (para o cursor contextual inteligente via React Portals).
- **Gerenciamento de Estado & Cache (Data Fetching):** TanStack Query (React Query) foi idealizado na arquitetura para prover cacheamento assíncrono avançado (stale-time e revalidação), garantindo fluidez massiva nas mudanças das pesquisas locais.
- **Roteamento & Hooks:** React Router DOM, Custom Hooks nativos (`useEvents`, `useLocalStorage`).
- **APIs Externas:**
  - **Ticketmaster Discovery API v2:** Motor principal de busca de eventos globais.
  - **Nominatim / OpenStreetMap:** API utilizada para Resolução de Geolocalização Reversa (Descobrindo cidade baseada em Latitude/Longitude do navegador) e para a engine do Autocomplete em debouncing na busca por cidades.

### B. Como funciona a aplicação de ponta a ponta?
1. **Bootstrap e Geolocalização:** Ao abrir o site, a aplicação solicita acesso à localização (GPS) nativa do navegador do usuário.
2. **Reverse Geocoding:** Se autorizado, o hook se comunica com o OSM (Nominatim) convertendo as coordenadas GPS na cidade atual do usuário (ex: "São Paulo").
3. **Fluxo de Busca (Service Layer):** A arquitetura intercepta o trigger de busca (via GPS detectado no `SearchBar.tsx`). O custom hook `useEvents` gerencia os estados transicionais (`loading`, `error`, `isEmpty`) e repassa a query para `ticketmaster.ts`.
4. **Proxy Local:** A requisição é enviada para `/api/ticketmaster`, onde o Vite atua como um Reverse Proxy, reescrevendo a requisição diretamente para `app.ticketmaster.com`. Isso blinda a aplicação de bloqueios de CORS por tratar requisições client-side que normalmente falhariam pela política rigorosa da API pública.
5. **Parseamento Resiliente:** Os dados brutos injetam-se em nossos Componentes. O `EventCard` implementa _Fallbacks Hierárquicos_ e heurísticas robustas. Por exemplo: se a API não retornar uma tag explícita de Artista, nosso algoritmo faz split de strings, checa atrações embutidas ou classifica o título do card para evitar telas "quebradas". Removemos imagens genéricas (placeholders default da API da TM) para garantir a consistência de UI.
6. **Favoritos e Retenção:** Usando o `useLocalStorage`, eventos podem ser favoritados via interação contextual e são gravados no cache do navegador persistindo recarregamentos; podem ser consultados na aba interna `/favorites`.

### C. Principais decisões tomadas e como poderia escalar?

**Decisões Principais:**
1. **Autonomia do Componente de Busca (`SearchBar`):** Implementação de Debounce de 300ms no autocomplete do _Nominatim_ impede o spam de requisições, evitando ser barrado por *Rate Limit* de uma API gratuita.
2. **Clean Architecture e Tipagens:** Centralizar toda a interface do Ticketmaster API em `src/types/index.ts`. Se no futuro quisermos injetar uma _Eventbrite_, as assinaturas do TypeScript isolarão o esforço.
3. **Prevenção Visual (Ghost Images):** Imagens provenientes do Ticketmaster foram filtradas caso acusassem flag de "fallback". Foco estrito em assets originais usando heurísticas de `aspect-ratio` coerentes.
4. **Cultura de Caching Robusta:** O uso de estratégias do **TanStack Query** permitiu minimizar requests abusivos e reaproveitar dados imutáveis (evitando re-fetches desnecessários durante a navegação).

**Plano de Escala Institucional & Business Vision:**
- **Inversão de Proxy (BFF):** Para escalar sob tráfego real, eu não proxyaria pelo Vite (que é voltado a Dev), mas sim criaria um _Backend For Frontend_ (Node.js/Go) usando Cloudflare Workers, a fim de proteger completamente o token da API da TM e aplicar um cache global no Redis.
- **Integração Real com IA (Analytics & Preços):** Como visão de negócio, este sistema interligaria um LLM responsável por analisar a relação show vs. preço. O modelo atuaria sugerindo eventos sub-precificados (ex: artistas emergentes) que podem lotar de forma similar a eventos badalados, avaliando o comportamento sócio-econômico das cidades em tempo real.
- **Caso de Uso Comercial (Aplicações para a Mude):** Refazer o ecossistema com foco no universo interativo e de alto impacto da Mude. Construir isso para consolidar como um **Showcase**, permitindo que novos clientes vislumbrem os serviços da Mude de maneira hiper-visceral, exibindo todo o portfólio de eventos que a Mude opera ao vivo de forma interativa.
- **Gerenciamento de Estado de Usuários:** A funcionalidade de "Favoritos" sairia do `localStorage` do dispositivo e migraríamos o usuário para autenticação via OAuth/JWT vinculando seus shows favoritos em um banco PostgreSQL (como Supabase).

### D. O que eu faria diferente com mais tempo?
- **Server Side Rendering (SSR) & SEO:** Migraria o scaffolding do Vite puro para o **Next.js**. Em uma plataforma focada em eventos, indexação do Google (SEO) e compartilhamento dinâmico no WhatsApp (OpenGraph Tags) são decisivos para ranquear bem.
- **Páginas Específicas (`/event/:id`):** Hoje direcionamos o usuário diretamente ao Ticketmaster. Ter uma página aninhada nativa permitiria expor mapa de assentos locais, previsão do tempo na data, entre outros widgets de engajamento.
- **Cobertura de Testes (TDD/E2E):** Implementaria uma suíte severa rodando test runners com **Vitest / React Testing Library** focado no motor de parser da Ticketmaster, além de **Cypress / Playwright** para emular a concessão fluida (e negativação de permissão) do GPS e garantir o render dos fallbacks dinâmicos se o GPS falhar.
- **Monitoramento:** Adicionaria um Sentry para observar como a API se comporta frente aos milhares de formatos não-padronizados devolvidos pela Ticketmaster.

---
*Criado com dedicação e boas práticas no Front-End.*
