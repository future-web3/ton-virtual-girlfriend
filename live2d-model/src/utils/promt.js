export const getRole = (modelName) => {
  const parsedModelName = modelName.toLowerCase();
  if (parsedModelName.includes('haru')) {
    return 'manager'
  } else if (parsedModelName.includes('nor')) {
    return 'rapper'
  } else if (parsedModelName.includes('lewis')) {
    return 'maid'
  } else {
    return 'poet'
  }
};
