export const getIdealTextColor = (bgColor: string) => {
  const nThreshold = 110;
  const components = {
    R: parseInt(bgColor.substring(1, 3), 16),
    G: parseInt(bgColor.substring(3, 5), 16),
    B: parseInt(bgColor.substring(5, 7), 16),
  };
  const bgDelta =
    components.R * 0.299 + components.G * 0.587 + components.B * 0.114;
  return 255 - bgDelta < nThreshold ? '#000000' : '#ffffff';
};
