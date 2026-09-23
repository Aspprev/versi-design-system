"use client";

import UnifiedDatePicker from "./UnifiedDatePicker";
import type {
  DatePickerNavigationVariant as DatePickerNavigationVariantType,
  UnifiedDatePickerProps,
} from "./UnifiedDatePicker";

export const DatePicker = UnifiedDatePicker;
export { UnifiedDatePicker };
export type {
  DatePickerNavigationVariant,
  DatePickerSelectionMode,
  UnifiedDatePickerProps as DatePickerProps,
  UnifiedDatePickerProps,
} from "./UnifiedDatePicker";
/** @deprecated Use DatePicker. */
export const Datepicker = DatePicker;
/** @deprecated Use DatePickerProps. */
export type DatepickerProps = UnifiedDatePickerProps;
/** @deprecated Use DatePickerNavigationVariant. */
export type DatepickerNavigationVariant = DatePickerNavigationVariantType;

export default DatePicker;
