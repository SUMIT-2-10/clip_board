import { customAlphabet } from "nanoid";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

// generator function
const generateCode = customAlphabet(alphabet, 6);

// usage
const code = generateCode();
console.log(code); // e.g. "aZ3kP9"
 const generateLink = () => {
  return generateCode();
};

export default generateLink;