# Manutenção do Storybook

- **Fundamentos** apresenta tokens reais e regras visuais.
- **Componentes** documenta a API pública, com catálogo, exemplo interativo, propriedades e estados.
- **Padrões de uso** reúne composições que o consumidor adapta à aplicação.
- **Laboratório** preserva comparações e alternativas históricas.

Mantenha os nomes técnicos dos componentes. Use `name` para traduzir o título visível da história, sem mudar seu export. Ao mover um arquivo para outro grupo, preserve o prefixo anterior com `meta.id` para manter links existentes.

O modelo de autodocs está em `ComponentDocumentation.tsx`; as orientações específicas ficam em `component-guidance.ts`. Inclua os componentes novos em `stories/shared/catalog.ts`, com link para sua documentação.

Exemplos interativos devem respeitar `args`. Para valores controlados, use `useArgs` ou sincronize o estado quando a propriedade mudar. Galerias com valores fixos devem desabilitar Controls para não sugerir uma interação inexistente.

Inclua os estados pertinentes: padrão, preenchido, erro, desabilitado, carregamento e vazio. Use rótulos e textos reais. Confira teclado, largura móvel, fonte ampliada e os temas da toolbar. O Laboratório de temas usa as mesmas preferências globais.

Após gerar o Storybook, confira os links internos:

```sh
npm run build-storybook
node scripts/check-storybook-navigation.mjs
```

A verificação cobre links literais das histórias e documentos e os destinos do catálogo.
