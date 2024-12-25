import { Pattern } from './types';

export const patterns: Pattern[] = [
  {
    pattern: /\b(hi|hello|hey)\b/i,
    responses: [
      "Hello! How are you feeling today?",
      "Hi there! What brings you here today?",
      "Hello. Please tell me what's on your mind."
    ],
    priority: 1,
    followUp: false
  },
  {
    pattern: /\b(I am|I'm) (.*?)(sad|depressed|unhappy|angry|mad|frustrated|upset)/i,
    responses: [
      "I understand you're feeling %3. What specific events or situations led to these feelings?",
      "When did you start feeling %3? Has anything changed recently?",
      "It must be difficult feeling %3. Could you share more about what's troubling you?"
    ],
    priority: 3,
    followUp: true
  },
  {
    pattern: /\b(I am|I'm) (.*?)(happy|good|great|excellent|fantastic|wonderful)/i,
    responses: [
      "I'm glad you're feeling %3! What's contributing to your positive mood?",
      "That's wonderful to hear! What's been going well for you?",
      "It's great that you're feeling %3! Would you like to share what's made your day better?"
    ],
    priority: 3,
    followUp: true
  },
  {
    pattern: /\b(because|since|due to) (.*)/i,
    responses: [
      "How long has %2 been affecting you?",
      "What aspects of %2 impact you the most?",
      "Have you considered different ways to approach %2?"
    ],
    priority: 4,
    followUp: true
  },
  {
    pattern: /\b(I feel|I think) (.*)/i,
    responses: [
      "What makes you %1 %2?",
      "How long have you felt this way about %2?",
      "Let's explore why you %1 %2. Can you elaborate?"
    ],
    priority: 3,
    followUp: true
  },
  {
    pattern: /.*/,
    responses: [
      "Could you elaborate on that?",
      "What aspects of this situation stand out to you the most?",
      "How does this affect your daily life?",
      "What thoughts or feelings come up when you think about this?"
    ],
    priority: 0,
    followUp: true
  }
];