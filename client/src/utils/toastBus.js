const bus = new EventTarget();

export function toast(message, type = "info") {
  bus.dispatchEvent(new CustomEvent("toast", { detail: { message, type } }));
}

export function onToast(handler) {
  const fn = (e) => handler(e.detail);
  bus.addEventListener("toast", fn);
  return () => bus.removeEventListener("toast", fn);
}
