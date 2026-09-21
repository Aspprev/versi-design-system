"use client";
import React from "react";
import { Formik } from "formik";
import { InputPhone, SelectCountry } from "@aspprev/versi-ds/forms";
export default function Controls() {
  return <Formik initialValues={{ country: "Brasil", phone: { ddi: 55, ddd: "11", numero: "999999999" } }} onSubmit={() => {}}>
    <form><SelectCountry name="country" label="País" /><InputPhone name="phone" label="Telefone" /></form>
  </Formik>;
}
