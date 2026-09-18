import { Formik } from "formik";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  Button,
  Checkbox,
  Input,
  InputSelect,
  InputSwitch,
  Modal,
  Notice,
  Table,
  Typography,
} from "../../src";

describe("componentes essenciais do Design System standalone", () => {
  it("renderiza o Checkbox como controle quadrado e preserva a selecao atual", () => {
    const html = renderToStaticMarkup(
      <Checkbox
        options={[{ label: "Básica", value: "basica" }]}
        value="basica"
        onChange={() => undefined}
        name="contribuicao"
      />,
    );

    expect(html).toContain('type="checkbox"');
    expect(html).toContain('class="checkbox-control"');
    expect(html).toContain('checked=""');
    expect(html).not.toContain('type="radio"');
    expect(html).not.toContain("radio-control");
  });

  it("expõe as variantes de tema e terciária do InputSwitch", () => {
    const themeHtml = renderToStaticMarkup(
      <InputSwitch aria-label="Tema" defaultEnable variant="theme" />,
    );
    const tertiaryHtml = renderToStaticMarkup(
      <InputSwitch aria-label="Terciário" defaultEnable variant="tertiary" />,
    );

    expect(themeHtml).toContain("bg-switch-track-theme-on");
    expect(tertiaryHtml).toContain("bg-switch-track-tertiary-on");
  });

  it("mantém o contrato acessível do Button durante o carregamento", () => {
    const html = renderToStaticMarkup(
      <Button loading loadingLabel="Salvando dados" aria-label="Salvar">
        Salvar
      </Button>,
    );

    expect(html).toContain('disabled=""');
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain('role="status"');
    expect(html).toContain("Salvando dados");
    expect(html).not.toContain(">Salvar</button>");
  });

  it("integra Input e InputSelect ao Formik com estados inválidos anunciados", () => {
    const html = renderToStaticMarkup(
      <Formik
        initialValues={{ email: "", plano: "" }}
        initialErrors={{
          email: "Informe um e-mail válido.",
          plano: "Selecione um plano.",
        }}
        initialTouched={{ email: true, plano: true }}
        onSubmit={() => undefined}
      >
        <form>
          <Input name="email" label="E-mail" type="email" />
          <InputSelect
            name="plano"
            label="Plano"
            options={[{ label: "Plano básico", value: "basico" }]}
          />
        </form>
      </Formik>,
    );

    expect(html).toContain('<label for="email"');
    expect(html).toContain('id="email"');
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('role="combobox"');
    expect(html).toContain("Informe um e-mail válido.");
    expect(html).toContain("Selecione um plano.");
  });

  it("expõe ações auxiliares do Notice com nomes acessíveis e tokens semânticos", () => {
    const html = renderToStaticMarkup(
      <Notice
        type="warning"
        textColor="color"
        onDismiss={() => undefined}
        onTriggerHelp={() => undefined}
      >
        Atenção: revise os dados.
      </Notice>,
    );

    expect(html).toContain("bg-feedback-warning-soft");
    expect(html).toContain("text-feedback-warning-content");
    expect(html).toContain('aria-label="Fechar aviso"');
    expect(html).toContain('aria-label="Obter ajuda sobre este aviso"');
    expect(html).toContain("Atenção: revise os dados.");
  });

  it("mantém Modal renderizável no SSR e não expõe conteúdo fechado", () => {
    expect(() =>
      renderToStaticMarkup(
        <Modal
          isOpen
          title="Confirmar alteração"
          variant="warning"
          onClose={() => undefined}
        >
          Deseja continuar?
        </Modal>,
      ),
    ).not.toThrow();

    const closedHtml = renderToStaticMarkup(
      <Modal
        isOpen={false}
        title="Conteúdo fechado"
        onClose={() => undefined}
      >
        Não deve aparecer no SSR.
      </Modal>,
    );

    expect(closedHtml).not.toContain("Conteúdo fechado");
    expect(closedHtml).not.toContain("Não deve aparecer no SSR.");
  });

  it("mantém nome acessível e estado vazio na Table", () => {
    const html = renderToStaticMarkup(
      <Table
        accessibleName="Lista de planos"
        header={[{ key: "nome", title: "Nome", accessor: () => "" }]}
        data={[]}
        emptyMessage="Nenhum plano encontrado"
      />,
    );

    expect(html).toContain("<table");
    expect(html).toContain('aria-label="Lista de planos"');
    expect(html).toContain('scope="col"');
    expect(html).toContain("Nenhum plano encontrado");
  });

  it("aplica a semântica de título e os tokens de tipografia", () => {
    const html = renderToStaticMarkup(
      <Typography semanticRole="section-title">Dados pessoais</Typography>,
    );

    expect(html).toContain("<p");
    expect(html).toContain("text-xl");
    expect(html).toContain("font-extrabold");
    expect(html).toContain("text-content-primary");
    expect(html).toContain("Dados pessoais");
  });
});
