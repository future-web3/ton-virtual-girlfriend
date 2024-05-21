export const parseResponseMessage = (response) => {
  const resMessage = response.data.message;
  const parts = resMessage.split("\n");

  let content = parts[0].substring("Content: ".length);
  let mood = "Natural";

  for (let i = 1; i < parts.length; i++) {
    if (!parts[i].startsWith("Mood:")) {
      content += parts[i];
    } else {
      mood = parts[i].substring("Mood: ".length);
    }
  }

  return { content, mood };
};
