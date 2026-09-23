"use client";
import React from "react";
import { PHONE_COUNTRY_OPTIONS } from "@aspprev/versi-ds/countries";
import { Formik } from "formik";
import { InputPhone, SelectCountry } from "@aspprev/versi-ds/forms";
export default function Controls() {
  const sampleFlags = PHONE_COUNTRY_OPTIONS.filter((country) => ["AF", "AL", "AD"].includes(country.cca2));

  return <Formik initialValues={{ country: "Brasil", phone: { ddi: 55, ddd: "11", numero: "999999999" } }} onSubmit={() => {}}>
    <form>
      <div id="browser-country-flags" aria-label="Amostra de bandeiras">
        {sampleFlags.map((country) => <img key={country.cca2} data-country={country.cca2} src={country.flags.svg} alt={country.label} />)}
      </div>
      <SelectCountry name="country" label="País" options={PHONE_COUNTRY_OPTIONS} />
      <InputPhone name="phone" label="Telefone" countries={PHONE_COUNTRY_OPTIONS} />
    </form>
  </Formik>;
}
