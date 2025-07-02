# 🎯 Gerador Inteligente de Apresentações

Uma aplicação web completa que permite criar apresentações PowerPoint de forma inteligente, combinando correção ortográfica, melhoria de conteúdo com IA e geração automática de slides.

## ✨ Funcionalidades

- **📝 Correção Ortográfica**: Sistema automatizado de correção de erros comuns em português
- **🤖 Melhoria com IA**: Aprimoramento do conteúdo usando GPT-4 com diferentes tons de voz
- **📊 Geração de PowerPoint**: Criação automática de apresentações com múltiplos templates
- **🎨 Templates Visuais**: 8 diferentes estilos de apresentação (Clássico, Moderno, Escuro, etc.)
- **⚙️ Personalização**: Controle sobre número de slides, tom de voz e formato do conteúdo

## 🚀 Instalação e Configuração

### 1. Clone o repositório e instale as dependências:

```bash
git clone [seu-repositorio]
cd [nome-do-projeto]
npm install
```

### 2. Configure as variáveis de ambiente:

```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` e adicione sua chave da OpenAI:

```env
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### 3. Execute o projeto:

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) para ver a aplicação.

## 🎯 Como Usar

1. **Cole o texto**: Insira o conteúdo que deseja transformar em apresentação
2. **Corrija a ortografia**: Clique em "📝 Corrigir Ortografia" para corrigir erros automáticamente
3. **Configure as opções**:
   - **Tom de voz**: Escolha entre 10 opções (Profissional, Didático, Criativo, etc.)
   - **Formato**: Bullet points ou blocos de texto
   - **Número de slides**: De 1 a 20 slides
   - **Template visual**: 8 opções diferentes de design
4. **Melhore com IA**: Clique em "✨ Melhorar com IA" para aprimorar o conteúdo
5. **Exporte a apresentação**: Clique em "📊 Exportar PPTX" para baixar o arquivo

## 🎨 Templates Disponíveis

- **Clássico**: Estrutura tradicional e legível
- **Moderno**: Visual limpo e contemporâneo
- **Escuro**: Estilo noturno com alto contraste
- **Minimalista**: Foco no conteúdo, design enxuto
- **Colorido**: Visual vibrante e expressivo
- **Corporativo**: Elegante e institucional
- **Gradiente**: Fundos com transições suaves
- **Ilustrado**: Com suporte a imagens baseadas no conteúdo

## 🎤 Tons de Voz Disponíveis

- **Profissional**: Objetivo, direto e formal
- **Didático**: Explicativo, foco no aprendizado
- **Técnico**: Preciso, com terminologia específica
- **Executivo**: Clareza e foco em resultados
- **Criativo**: Inovador, com analogias e metáforas
- **Motivacional**: Inspirador e energizante
- **Persuasivo**: Voltado à conversão
- **Institucional**: Formal, voz organizacional
- **Acadêmico**: Estruturado, embasamento teórico
- **Descontraído**: Informal, conversa entre amigos

## 🔧 Tecnologias Utilizadas

- **Next.js 15**: Framework React com App Router
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Estilização utilitária
- **OpenAI GPT-4**: Melhoria inteligente de conteúdo
- **PptxGenJS**: Geração de arquivos PowerPoint
- **React**: Interface de usuário reativa

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── api/
│   │   ├── rewrite/          # API de melhoria com IA
│   │   └── spell-check/      # API de correção ortográfica
│   ├── utils/
│   │   └── exportPptx.ts     # Utilitário de geração PPTX
│   ├── page.tsx              # Página principal
│   └── layout.tsx            # Layout da aplicação
├── components/
│   └── ui/                   # Componentes de interface
```

## 🔄 APIs Disponíveis

### `/api/spell-check`
Corrige erros ortográficos e de formatação em português.

### `/api/rewrite`
Melhora o conteúdo usando GPT-4 com base no tom de voz selecionado.

### `/api/generate-image`
Gera imagens para complementar o conteúdo (para template "Ilustrado").

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure a variável de ambiente `OPENAI_API_KEY`
3. Deploy automático

### Outras plataformas

1. Build do projeto: `npm run build`
2. Configure as variáveis de ambiente
3. Execute: `npm start`

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📞 Suporte

Se você tiver dúvidas ou problemas:

1. Verifique se a chave da OpenAI está configurada corretamente
2. Certifique-se de que todas as dependências estão instaladas
3. Consulte os logs de erro no console do navegador

---

**Desenvolvido com ❤️ usando Next.js e IA**
