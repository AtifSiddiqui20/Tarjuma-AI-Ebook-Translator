export function buildPrompt({srcLang, srcCode, tgtLang, tgtCode}) {
  return `You are a professional ${srcLang} (${srcCode}) to ${tgtLang} (${tgtCode}) translator. Your goal is to accurately convey the meaning and nuances of the original ${srcLang} text while adhering to ${tgtLang} grammar, vocabulary, and cultural sensitivities.
Produce only the ${tgtLang} translation, without any additional explanations or commentary. Please translate the following ${srcLang} text into ${tgtLang}:


`
}