import { addons } from "storybook/manager-api";
import { create, themes } from "storybook/theming";

const labels: Record<string, string> = {
  "Getting Started": "Comece por aqui", Introduction: "Apresentação", Installation: "Instalação", Contributing: "Contribuição", Usage: "Guia de uso",
  Foundations: "Fundamentos", Overview: "Visão geral", Colors: "Cores", Illustrations: "Ilustrações", Typography: "Tipografia", Spacing: "Espaçamento", Shadows: "Sombras", Responsive: "Responsividade", Borders: "Bordas e raios", Icons: "Ícones",
  Components: "Componentes", Actions: "Ações", Forms: "Formulários", "Data Display": "Exibição de dados", Feedback: "Feedback", Navigation: "Navegação", Layout: "Layout", Documents: "Documentos", Overlay: "Sobreposições", Accessibility: "Acessibilidade", Utilities: "Utilitários",
  Patterns: "Padrões de uso", Themes: "Temas", Clients: "Clientes", BrandAccents: "Acentos de marca", Comparison: "Comparação", Guidelines: "Orientações", ComponentChoice: "Escolha do componente", Laboratory: "Laboratório", Compatibility: "Compatibilidade",
  ThemeLab: "Laboratório de temas", UploadFlow: "Envio de documentos", Data: "Dados", Table: "Tabela",
  PlaceholderComparison: "Comparação histórica de placeholders", ValidationLayout: "Alternativas de layout de validação", ValidationStates: "Estados de validação", FormStates: "Estados dos campos", FormValidation: "Validação por linha", InputStandalone: "Input · sem Formik", Formik: "Integração Formik",
};

addons.setConfig({
  sidebar: { renderLabel: (item) => labels[item.name] ?? item.name },
  theme: create(
    {
      ...themes.light,
      base: "light",
      brandTitle: "VERSI Design System",
      brandUrl: "/",
      brandImage: "/brand/versi-logo-primary.svg",
      colorPrimary: "#0f62c1",
      colorSecondary: "#07448a",
      appBg: "#f4f7f8",
      appContentBg: "#ffffff",
      appBorderColor: "#c9ced4",
      barBg: "#ffffff",
      barTextColor: "#5c5c5c",
      barSelectedColor: "#0f62c1",
      textMutedColor: "#707780",
      inputBg: "#ffffff",
      inputBorder: "#c9ced4",
      inputTextColor: "#181818",
      fontBase: '"Nunito Sans", system-ui, sans-serif',
      fontCode: '"IBM Plex Mono", ui-monospace, monospace',
    },
    { brandTarget: "_self" },
  ),
});
