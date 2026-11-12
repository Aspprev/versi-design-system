import { readFileSync } from "node:fs";
import postcss from "postcss";
import { describe, expect, it } from "vitest";
import { contrastRatio } from "../helpers/contrast";

const {tokens} = JSON.parse(readFileSync("docs/high-contrast-dark/policy.json", "utf8")) as {tokens:Record<string,string>};
const color=(name:string)=>tokens[`--${name}`];
const ratio=(a:string,b:string)=>contrastRatio(color(a),color(b));
describe("política universal Escuro + Alto contraste",()=>{
  it("preserva hierarquia e atinge as metas de texto, estados e seleção",()=>{
    expect(new Set([color("surface-page"),color("surface-card-semantic"),color("surface-muted")]).size).toBe(3);
    for(const surface of ["surface-page","surface-card-semantic","surface-muted"]) for(const foreground of ["content-primary","content-secondary","content-muted","content-link","content-disabled"]) expect(ratio(foreground,surface),`${foreground}/${surface}`).toBeGreaterThanOrEqual(7);
    for(const role of ["primary","secondary","danger","warning","success","info"]) for(const state of ["","-hover","-active"]) expect(ratio(`action-${role}-content${state}`,`action-${role}-background${state}`)).toBeGreaterThanOrEqual(7);
    for(const role of ["danger","warning","success","info"]) expect(ratio(`feedback-${role}-content`,`feedback-${role}-soft`)).toBeGreaterThanOrEqual(7);
    for(const foreground of ["field-content","field-placeholder","field-assistive","field-assistive-error"])expect(ratio(foreground,"field-surface")).toBeGreaterThanOrEqual(7);
    for(const status of ["blue","green","orange","yellow","red","slate","black","primary"]) for(const variant of ["soft","solid","outline"]) expect(ratio(`status-${status}-${variant}-foreground`,`status-${status}-${variant}-background`)).toBeGreaterThanOrEqual(7);
    expect(ratio("selection-content","selection-background")).toBeGreaterThanOrEqual(7);
    expect(ratio("content-inverse","surface-tooltip")).toBe(21);
  });
  it("mantém doze séries intensas e cinzas distintos sem suavização",()=>{
    const series=Array.from({length:12},(_,i)=>color(`chart-${i+1}`));
    expect(new Set(series).size).toBe(12);
    expect(Array.from({length:12},(_,i)=>color(`chart-donut-${i+1}`))).toEqual(series);
    for(let i=1;i<=12;i++) for(const surface of ["surface-page","surface-card-semantic","surface-muted"]) expect(ratio(`chart-${i}`,surface),`${i}/${surface}`).toBeGreaterThanOrEqual(7);
    expect(new Set(Array.from({length:4},(_,i)=>color(`chart-muted-${i+1}`))).size).toBe(4);
    expect(color("chart-balance")).not.toBe(color("chart-invested"));
  });
  it("restringe toda prioridade nova à combinação exata e mantém o formato das cores",()=>{
    const sheet=postcss.parse(readFileSync("src/high-contrast-dark.css","utf8"));
    sheet.walkRules(rule=>{ for(const selector of rule.selectors) expect(selector).toContain('html[data-color-scheme="dark"][data-contrast="high"]'); });
    sheet.walkDecls(d=>{if(/^--illustration-(primary-content|brand-accent-\d-content)$/.test(d.prop)) expect(d.value).toMatch(/^\d+, \d+, \d+$/);});
    expect(color("illustration-primary-content")).toBe("0, 0, 0");
    expect(Object.keys(tokens).some(key=>/^--(?:tertiary-|action-tertiary-|portal-)/.test(key))).toBe(false);
  });
});
