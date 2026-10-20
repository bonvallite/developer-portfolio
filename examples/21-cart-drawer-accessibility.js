// Standalone illustration: manage a dialog's initial focus and restore focus.
export function focusDialog(dialog, trigger) {
  if (!dialog || !trigger) throw Error("Dialog and trigger required");
  const candidate = dialog.querySelector('button, a[href], input, [tabindex="0"]');
  (candidate ?? dialog).focus();
  return () => trigger.focus();
}
// Use native <dialog> and showModal() for built-in focus containment.
