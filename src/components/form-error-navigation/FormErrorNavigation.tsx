"use client";

import { useEffect } from "react";

function shouldReduceMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

const INVALID_FIELD_SELECTOR = [
  '[aria-invalid="true"]',
  "input:invalid",
  "select:invalid",
  "textarea:invalid",
].join(",");

const RETRY_DELAYS = [50, 150, 300, 600, 1000];

function isVisible(element: HTMLElement) {
  const styles = window.getComputedStyle(element);
  const bounds = element.getBoundingClientRect();

  return (
    styles.display !== "none" &&
    styles.visibility !== "hidden" &&
    bounds.width > 0 &&
    bounds.height > 0
  );
}

function getFocusTarget(field: HTMLElement) {
  if (
    field.matches(
      "input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex='-1'])",
    )
  ) {
    return field;
  }

  return field.querySelector<HTMLElement>(
    "input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex='-1'])",
  );
}

export function findFirstInvalidField(form: HTMLFormElement) {
  return [...form.querySelectorAll<HTMLElement>(INVALID_FIELD_SELECTOR)]
    .filter(isVisible)
    .sort((first, second) => {
      const firstBounds = first.getBoundingClientRect();
      const secondBounds = second.getBoundingClientRect();

      if (firstBounds.top !== secondBounds.top) {
        return firstBounds.top - secondBounds.top;
      }

      return firstBounds.left - secondBounds.left;
    })[0];
}

function navigateToInvalidField(field: HTMLElement) {
  const focusTarget = getFocusTarget(field);
  const behavior = shouldReduceMotion() ? "auto" : "smooth";

  focusTarget?.focus({ preventScroll: true });
  field.scrollIntoView({ behavior, block: "center", inline: "nearest" });
}

export function FormErrorNavigation() {
  useEffect(() => {
    let cleanupPendingNavigation: (() => void) | undefined;

    const handleSubmit = (event: SubmitEvent) => {
      if (!(event.target instanceof HTMLFormElement)) return;

      cleanupPendingNavigation?.();

      const form = event.target;
      let handled = false;
      let observer: MutationObserver | undefined;
      const timers: number[] = [];

      const cleanup = () => {
        observer?.disconnect();
        timers.forEach(window.clearTimeout);
      };

      const tryNavigate = () => {
        if (handled || !form.isConnected) return;

        const field = findFirstInvalidField(form);
        if (!field) return;

        handled = true;
        cleanup();
        navigateToInvalidField(field);
      };

      observer = new MutationObserver(tryNavigate);
      observer.observe(form, {
        attributeFilter: ["aria-invalid"],
        attributes: true,
        subtree: true,
      });

      RETRY_DELAYS.forEach((delay) => {
        timers.push(window.setTimeout(tryNavigate, delay));
      });

      cleanupPendingNavigation = cleanup;
    };

    document.addEventListener("submit", handleSubmit, true);

    return () => {
      cleanupPendingNavigation?.();
      document.removeEventListener("submit", handleSubmit, true);
    };
  }, []);

  return null;
}
