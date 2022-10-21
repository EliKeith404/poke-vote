type enumType = { [s: string]: string };

function getRandomEnum(input: enumType): enumType[keyof enumType] {
  const enumValues = Object.keys(input).map((key) => input[key]);
  const randomIndex = Math.floor(Math.random() * enumValues.length);

  return enumValues[randomIndex] || 'roundest'; //returns default value if for some reason enum is undefined
}

export default getRandomEnum;
