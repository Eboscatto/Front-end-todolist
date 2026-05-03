// =============================
// Ajusta timezone para backend (evita +3h)
// =============================
export const toLocalISOString = (dateString) => {
  if (!dateString) return null;

  const date = new Date(dateString);
  const offset = date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - offset)
    .toISOString()
    .slice(0, -1); // remove o "Z"
};

// =============================
// Formata data para input datetime-local
// =============================
export const formatDateToInput = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const offset = date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - offset)
    .toISOString()
    .slice(0, 16); // yyyy-MM-ddTHH:mm
};