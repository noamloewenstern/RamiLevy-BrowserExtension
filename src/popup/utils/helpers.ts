export const downloadAsFile = async (textContent: string, filename = 'data.txt') => {
  const blob = new Blob([textContent], { type: 'text' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
