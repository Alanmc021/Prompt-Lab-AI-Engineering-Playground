# 🧠 Prompt Lab — AI Engineering Playground

Este projeto é um laboratório prático de **Engenharia de Prompt e Sistemas de IA**, focado em boas práticas de mercado como:

* Versionamento de prompts
* Observabilidade de execuções
* Avaliação de qualidade
* Comparação entre versões (A/B testing)
* Estruturação de saídas com schema

---

# 🚀 Objetivo

O objetivo deste projeto é **simular um ambiente real de AI Engineering**, permitindo:

* Criar e iterar prompts de forma controlada
* Medir custo, latência e qualidade
* Comparar versões de prompts
* Entender como sistemas baseados em LLM funcionam em produção

---

# 🧱 Arquitetura

```bash
src/
  ├── prompts/        # Definição dos prompts versionados
  ├── chains/         # Execução dos prompts (LLM)
  ├── evaluator/      # Avaliação heurística + AI Judge
  ├── router/         # Roteamento de input
  ├── runner.ts       # Orquestrador principal
```

---

# ⚙️ Como funciona

Fluxo principal da aplicação:

```text
Input → Router → Prompt (v1/v2) → LLM → Parser → Output → Evaluation + AI Judge
```

---

## 🧠 Componentes

### 🔹 Prompts (Versionamento)

Exemplo:

```ts
explainV1
explainV2
```

Permite:

* comparar respostas
* evoluir qualidade
* controlar mudanças

---

### 🔹 Chain (Execução)

Responsável por:

* enviar prompt para o modelo
* receber resposta
* integrar com observabilidade

---

### 🔹 Structured Output

Utiliza schema para garantir:

* consistência
* tipagem
* validação

Exemplo:

```json
{
  "definition": "string",
  "example": "string"
}
```

---

### 🔹 Evaluator

Camada responsável por:

* avaliar respostas
* comparar versões
* gerar feedback

---

### 🔹 AI Judge (implementado)

Camada automática de avaliação baseada em LLM com saída estruturada:

```json
{
  "score": 9,
  "label": "good",
  "clarity": 9,
  "accuracy": 10,
  "utility": 8,
  "feedback": "A explicação é clara e precisa, mas poderia incluir mais exemplos práticos."
}
```

Critérios usados:

* clareza (`clarity`)
* precisão técnica (`accuracy`)
* utilidade prática (`utility`)

---

### 🔹 Router

Classifica o input para possíveis fluxos:

```ts
route("RAG") → "rag"
```

---

# 📊 Observabilidade

O projeto utiliza rastreamento de execuções para:

* 📈 medir latência
* 💰 calcular custo
* 🔍 inspecionar prompts
* 🧪 comparar versões

Cada execução gera:

```json
{
  "input": "...",
  "output": "...",
  "tokens": 262,
  "latency": "6.97s",
  "cost": "$0.00028"
}
```

---

# 🧪 Experimentos realizados

## 🔬 Comparação de prompts

| Versão | Tokens | Tempo | Qualidade |
| ------ | ------ | ----- | --------- |
| v1     | ~223   | ~5.3s | Média     |
| v2     | ~262   | ~6.9s | Alta      |

### 💡 Insight

* v2 → melhor qualidade
* v1 → mais rápido e barato

---

# 🧠 Conceitos aplicados

* Prompt Engineering
* Structured Prompting
* Prompt Versioning
* Prompt Chaining (base)
* Observability for AI
* Evaluation Pipeline

---

# 📦 Como rodar

```bash
npm install
```

Crie um `.env`:

```env
OPENAI_API_KEY=your_key
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=your_key
```

Execute:

```bash
npm run dev -- "RAG"
```

---

# 🎯 Próximos passos

* [x] Adicionar AI Judge (avaliação automática)
* [ ] Criar dataset de testes
* [ ] Implementar Prompt Registry
* [ ] Evoluir para multi-step chaining
* [ ] Integrar com dashboard customizado
* [ ] Adicionar RAG com base de conhecimento

---

# 🧠 Aprendizados

Durante o desenvolvimento deste projeto:

* Prompt não é string → é um asset versionado
* Observabilidade é essencial para IA em produção
* Métricas (custo, latência, qualidade) guiam decisões
* Iteração controlada é mais importante que “prompt perfeito”

---

# 🚀 Sobre o projeto

Este projeto faz parte do meu estudo em:

* Engenharia de IA
* Sistemas baseados em LLM
* Arquitetura de agentes inteligentes

---

# 👨‍💻 Autor

Alan Martins
AI Engineer | Full Stack Developer

---

# ⭐ Considerações finais

Este não é apenas um projeto de testes — é uma base para evoluir para:

* sistemas de IA em produção
* agentes inteligentes
* pipelines de decisão

---
