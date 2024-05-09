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

export const getIdealTextColorFromRGB = (bgColor: string) => {
  const nThreshold = 110;
  // Extract the numeric values from the RGB string
  const rgbValues = bgColor.match(/\d+/g).map(Number);

  const components = {
    R: rgbValues[0],
    G: rgbValues[1],
    B: rgbValues[2],
  };

  // Calculate the luminance of the background color
  const bgDelta =
    components.R * 0.299 + components.G * 0.587 + components.B * 0.114;

  // Determine if the text color should be black or white based on the luminance
  return 255 - bgDelta < nThreshold ? '#000000' : '#ffffff';
};

export const isColorDark = (bgColor: string) => {
  const nThreshold = 110;
  // Extract the numeric values from the RGB string
  const rgbValues = bgColor.match(/\d+/g).map(Number);

  const components = {
    R: rgbValues[0],
    G: rgbValues[1],
    B: rgbValues[2],
  };

  // Calculate the luminance of the background color
  const bgDelta =
    components.R * 0.299 + components.G * 0.587 + components.B * 0.114;

  return 255 - bgDelta < nThreshold;
};
