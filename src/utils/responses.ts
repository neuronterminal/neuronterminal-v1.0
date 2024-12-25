const responses = {
  greetings: [
    "Hello! How can I help you today?",
    "Hi there! What's on your mind?",
    "Greetings! How may I assist you?"
  ],
  farewell: [
    "Goodbye! Have a great day!",
    "Take care! Let me know if you need anything else.",
    "Until next time!"
  ],
  unknown: [
    "I'm not sure I understand. Could you please rephrase that?",
    "I'm still learning. Could you explain that differently?",
    "I'm not quite following. Can you clarify?"
  ]
};

export function getResponse(type: keyof typeof responses): string {
  const options = responses[type];
  return options[Math.floor(Math.random() * options.length)];
}