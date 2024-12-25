import { Script } from './types';

export const script: Script = {
  initial: "Hello. How are you feeling today?",
  final: "Goodbye. Thank you for talking with me.",
  quit: ["bye", "goodbye", "quit", "exit"],
  pre: {
    "dont": "don't",
    "cant": "can't",
    "wont": "won't",
    "recollect": "remember",
    "dreamt": "dreamed",
    "dreams": "dream",
    "maybe": "perhaps",
    "how": "what",
    "when": "what",
    "certainly": "yes",
    "machine": "computer",
    "computers": "computer",
    "were": "was",
    "you're": "you are",
    "i'm": "i am",
    "same": "alike"
  },
  post: {
    "am": "are",
    "your": "my",
    "me": "you",
    "myself": "yourself",
    "yourself": "myself",
    "i": "you",
    "you": "I",
    "my": "your",
    "i'm": "you are"
  },
  synonyms: {
    "belief": ["feel", "think", "believe", "wish"],
    "family": ["mother", "father", "sister", "brother", "wife", "children"],
    "desire": ["want", "need", "wish"],
    "sad": ["unhappy", "depressed", "sick", "upset"],
    "happy": ["elated", "glad", "better"],
    "cannot": ["can't"],
    "everyone": ["everybody", "nobody", "noone"],
    "be": ["am", "is", "are", "was"]
  },
  keywords: [
    {
      word: "sorry",
      rank: 1,
      rules: [
        {
          pattern: "*",
          responses: [
            { format: "Please don't apologize." },
            { format: "Apologies are not necessary." },
            { format: "What feelings do you have when you apologize?" }
          ]
        }
      ]
    },
    {
      word: "remember",
      rank: 5,
      rules: [
        {
          pattern: "* i remember *",
          responses: [
            { format: "Do you often think of (2)?" },
            { format: "Does thinking of (2) bring anything else to mind?" },
            { format: "What else do you remember?" },
            { format: "Why do you recall (2) right now?" }
          ]
        },
        {
          pattern: "* do you remember *",
          responses: [
            { format: "Did you think I would forget (2)?" },
            { format: "Why do you think I should recall (2) now?" },
            { format: "What about (2)?" }
          ]
        }
      ]
    },
    {
      word: "if",
      rank: 3,
      rules: [
        {
          pattern: "* if *",
          responses: [
            { format: "Do you think it's likely that (2)?" },
            { format: "Do you wish that (2)?" },
            { format: "What do you know about (2)?" }
          ]
        }
      ]
    },
    {
      word: "dreamed",
      rank: 4,
      rules: [
        {
          pattern: "* i dreamed *",
          responses: [
            { format: "Really, (2)?" },
            { format: "Have you ever fantasized (2) while you were awake?" },
            { format: "Have you dreamed (2) before?" }
          ]
        }
      ]
    },
    {
      word: "dream",
      rank: 3,
      rules: [
        {
          pattern: "*",
          responses: [
            { format: "What does that dream suggest to you?" },
            { format: "Do you dream often?" },
            { format: "What persons appear in your dreams?" }
          ]
        }
      ]
    },
    {
      word: "perhaps",
      rank: 1,
      rules: [
        {
          pattern: "*",
          responses: [
            { format: "You don't seem quite certain." },
            { format: "Why the uncertain tone?" },
            { format: "Can't you be more positive?" }
          ]
        }
      ]
    },
    {
      word: "hello",
      rank: 1,
      rules: [
        {
          pattern: "*",
          responses: [
            { format: "How do you do. Please state your problem." },
            { format: "Hi. What seems to be your concern?" }
          ]
        }
      ]
    },
    {
      word: "computer",
      rank: 2,
      rules: [
        {
          pattern: "*",
          responses: [
            { format: "Do computers worry you?" },
            { format: "Why do you mention computers?" },
            { format: "What do you think machines have to do with your problem?" }
          ]
        }
      ]
    },
    {
      word: "am",
      rank: 1,
      rules: [
        {
          pattern: "* am i *",
          responses: [
            { format: "Do you believe you are (2)?" },
            { format: "Would you want to be (2)?" },
            { format: "You wish I would tell you you are (2)?" }
          ]
        },
        {
          pattern: "* i am *",
          responses: [
            { format: "Why do you say 'I am (2)'?" },
            { format: "I don't understand how you are (2)." }
          ]
        }
      ]
    }
  ]
};