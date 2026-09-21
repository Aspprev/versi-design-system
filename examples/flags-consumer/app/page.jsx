import React from "react";
import { getCountryFlagUrl } from "@aspprev/versi-ds/countries";
import Controls from "./controls";
export default function Page() {
  return <main><h1>Bandeiras autocontidas</h1><img id="server-flag" src={getCountryFlagUrl("BR")} alt="Brasil" /><Controls /></main>;
}
