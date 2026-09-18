import {
  Button,
  FormActions,
  FormGrid,
  Notice,
  SkipLink,
  StatusBadge,
  Surface,
  Table,
  Typography,
  type ITableColumnConfig,
} from "@aspprev/versi-ds/core";
import {
  Input,
  InputPhone,
  SelectCountry,
  type PhoneValue,
} from "@aspprev/versi-ds/forms";
import { Modal } from "@aspprev/versi-ds/overlays";
import "@aspprev/versi-ds/styles.css";
import "@aspprev/versi-ds/themes.css";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./app.css";

type Contact = { nome: string; pais: string };
type Values = Contact & { telefone: PhoneValue };
const columns: ITableColumnConfig<Contact>[] = [
  { key: "nome", title: "Nome", accessor: (contact) => contact.nome },
  { key: "pais", title: "País", accessor: (contact) => contact.pais },
];

function App() {
  const [scheme, setScheme] = useState("light");
  const [contrast, setContrast] = useState("normal");
  const [scale, setScale] = useState("default");
  const [palette, setPalette] = useState("default");
  const [saved, setSaved] = useState<Values | null>(null);
  const [open, setOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([
    { nome: "Ana Martins", pais: "Brasil" },
  ]);
  useEffect(() => {
    Object.assign(document.documentElement.dataset, {
      colorScheme: scheme,
      contrast,
      contrastTheme: scheme,
      fontScale: scale,
      dsTheme: palette,
      motion: "reduce",
    });
  }, [scheme, contrast, scale, palette]);

  return (
    <>
      <SkipLink targetId="conteudo" label="Ir para o conteúdo" />
      <main id="conteudo" tabIndex={-1} className="pilot">
        <header className="pilot-heading">
          <Typography element="h1" semanticRole="page-title">
            Cadastro de contatos
          </Typography>
          <Typography variant="secondary">
            Organize seus contatos e escolha como prefere visualizar as
            informações.
          </Typography>
          <StatusBadge tone="info" appearance="soft">
            Demonstração local
          </StatusBadge>
        </header>
        <Surface
          className="preferences"
          tone="subtle"
          aria-label="Preferências de aparência"
        >
          <Typography element="h2" semanticRole="section-title">
            Aparência
          </Typography>
          <div className="preferences-grid">
            <label>
              Esquema de cores
              <select
                value={scheme}
                onChange={(e) => setScheme(e.target.value)}
              >
                <option value="light">Claro</option>
                <option value="dark">Escuro</option>
              </select>
            </label>
            <label>
              Contraste
              <select
                value={contrast}
                onChange={(e) => setContrast(e.target.value)}
              >
                <option value="normal">Normal</option>
                <option value="high">Alto contraste</option>
              </select>
            </label>
            <label>
              Tamanho da fonte
              <select value={scale} onChange={(e) => setScale(e.target.value)}>
                <option value="default">Padrão</option>
                <option value="large">Grande</option>
                <option value="extra-large">Extra grande</option>
              </select>
            </label>
            <label>
              Paleta
              <select
                value={palette}
                onChange={(e) => setPalette(e.target.value)}
              >
                <option value="default">Padrão</option>
                <option value="azul1">Azul</option>
                <option value="verde1">Verde</option>
              </select>
            </label>
          </div>
        </Surface>
        <Surface className="contact-form">
          <Typography element="h2" semanticRole="section-title">
            Novo contato
          </Typography>
          <Typography variant="secondary">
            Preencha os dados. Eles permanecem somente nesta página.
          </Typography>
          <Formik<Values>
            initialValues={{
              nome: "",
              pais: "Brasil",
              telefone: { ddi: 55, ddd: "", numero: "" },
            }}
            validate={(values) =>
              !values.nome.trim() ? { nome: "Informe o nome completo." } : {}
            }
            onSubmit={async (values) => {
              setSaved(values);
              setContacts((current) => [
                ...current,
                { nome: values.nome, pais: values.pais },
              ]);
              setOpen(true);
            }}
          >
            <Form>
              <FormGrid columns={2}>
                <Input name="nome" label="Nome completo" autoComplete="name" />
                <SelectCountry
                  name="pais"
                  label="País de residência"
                  countryList={{ mode: "include", codes: ["BR", "PT", "US"] }}
                />
                <InputPhone
                  name="telefone"
                  label="Telefone"
                  countryList={{ mode: "include", codes: ["BR", "PT", "US"] }}
                />
              </FormGrid>
              <FormActions>
                <Button type="submit">Salvar contato</Button>
              </FormActions>
            </Form>
          </Formik>
        </Surface>
        <Surface className="contacts">
          <Typography element="h2" semanticRole="section-title">
            Contatos cadastrados
          </Typography>
          <Table
            header={columns}
            data={contacts}
            accessibleName="Contatos cadastrados"
            rowVariant="striped"
            density="compact"
            showPagination={false}
          />
          {saved && (
            <Notice role="status" type="success">
              {saved.nome} foi adicionado à lista.
            </Notice>
          )}
        </Surface>
        <Modal
          title="Contato salvo"
          isOpen={open}
          onClose={() => setOpen(false)}
          showIcon={false}
        >
          <Typography>
            O contato de {saved?.nome} foi salvo nesta demonstração.
          </Typography>
          <Button type="button" onClick={() => setOpen(false)}>
            Voltar aos contatos
          </Button>
        </Modal>
      </main>
    </>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
