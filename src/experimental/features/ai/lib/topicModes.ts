export const FOUND_INSTRUCTION = `When you find the object the user is looking for, include [FOUND] in your response.`;

export const HIGHLIGHT_INSTRUCTION = `To highlight specific text in green, wrap it with [mark]text[/mark].`;

const OBJECT_SEARCH_KEYWORDS = ['look for', 'find', 'search for', 'where is', 'locate', 'spot'];

export function isObjectSearchTopic(topic: string): boolean {
  const lower = topic.toLowerCase();
  return OBJECT_SEARCH_KEYWORDS.some((kw) => lower.includes(kw));
}
