import { customAlphabet } from "nanoid";

const alphabet = "0123456789";

// generator function
const generateCode = customAlphabet(alphabet, 6);

const generateLink = () => {
  return generateCode();
};

export default generateLink;