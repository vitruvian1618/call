export const playAudio = async (audioUrl?: string) => {
  if (!audioUrl) return;
  const audio = new Audio(audioUrl);
  await audio.play();
};
