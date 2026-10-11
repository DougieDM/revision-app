// Keep stored topic identifiers stable so existing results and saved links still work.
export function topicLabel(topic: string) {
  return topic === "Year 8 Organisms" ? "Organisms" : topic;
}
