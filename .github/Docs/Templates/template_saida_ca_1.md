File name: [NUMERO_DA_ATIVIDADE]_ca.md
Language: 
### Criterios de Aceitacao - [Titulo da Atividade]

---

#### Informacoes Gerais

| Campo               | Descricao                          |
|---------------------|------------------------------------|
| Titulo da Atividade | [Titulo da atividade]              |
| Locais              | [Modulo > Submódulo > Funcionalidade (`identificador_tecnico`)] |
|                     | [Modulo > Submódulo > Funcionalidade (`identificador_tecnico`)] |
| Tipo                | [Correcao de Bug / Melhoria / Nova Funcionalidade] |

---

#### Bug [NN] - [Titulo descritivo do bug]

##### Descricao do Bug

[Descricao tecnica e objetiva do comportamento incorreto, incluindo as condicoes que disparam o problema]

---

##### Cenario [NN] - [Titulo do cenario] ([validacao do erro corrigido / regressao - descricao])

```gherkin
Dado que [contexto inicial do sistema]
E [condicao adicional do contexto, se houver]
Quando [acao principal realizada]
E [acao complementar, se houver]
Entao o sistema deve [resultado esperado principal]
E deve [resultado esperado complementar]
```

#### Premissas Adotadas

- [Premissa 1: formula de calculo utilizada, se aplicavel]
- [Premissa 1: estados do registro envolvidos, se aplicável]
- [Premissa 2: regra de negocio assumida para determinacao de estados]
- [Premissa 3: finalidade dos cenarios de regressao]