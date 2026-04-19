// 8 curated backgrounds — verified 200 on images.unsplash.com
// Rotate by quote.id % 8
const BASE = 'https://images.unsplash.com/photo-';
const PARAMS = '?w=1080&q=85&auto=format&fit=crop';
export const BACKGROUNDS = [
  `${BASE}1506905925346-21bda4d32df4${PARAMS}`, // 0 — mountain reflection, Swiss Alps
  `${BASE}1469474968028-56623f02e42e${PARAMS}`, // 1 — forest with golden sunrays
  `${BASE}1507525428034-b723cf961d3e${PARAMS}`, // 2 — ocean
  `${BASE}1501854140801-50d01698950b${PARAMS}`, // 3 — aerial mountain range
  `${BASE}1519681393784-d120267933ba${PARAMS}`, // 4 — mountain + milky way
  `${BASE}1476231682828-37e571bc172f${PARAMS}`, // 5 — aurora borealis
  `${BASE}1441974231531-c6227db76b6e${PARAMS}`, // 6 — sunlit forest path
  `${BASE}1464822759023-fed622ff2c3b${PARAMS}`, // 7 — glacier lake
];

export const QUOTES = [
  { id: 0,  text: "You have power over your mind, not outside events. Realise this, and you will find strength.", author: "Marcus Aurelius", source: "Meditations" },
  { id: 1,  text: "The happiness of your life depends upon the quality of your thoughts.", author: "Marcus Aurelius", source: "Meditations" },
  { id: 2,  text: "Very little is needed to make a happy life; it is all within yourself, in your way of thinking.", author: "Marcus Aurelius", source: "Meditations" },
  { id: 3,  text: "Waste no more time arguing what a good man should be. Be one.", author: "Marcus Aurelius", source: "Meditations" },
  { id: 4,  text: "When you arise in the morning, think of what a precious privilege it is to be alive — to breathe, to think, to enjoy, to love.", author: "Marcus Aurelius", source: "Meditations" },
  { id: 5,  text: "Begin at once to live, and count each separate day as a separate life.", author: "Seneca", source: "Letters" },
  { id: 6,  text: "True happiness is to enjoy the present, without anxious dependence upon the future.", author: "Seneca", source: "Letters" },
  { id: 7,  text: "It is not that I'm so smart. But I stay with the questions much longer.", author: "Albert Einstein" },
  { id: 8,  text: "Wealth consists not in having great possessions, but in having few wants.", author: "Epictetus" },
  { id: 9,  text: "He who fears death will never do anything worthy of a man who is alive.", author: "Seneca" },
  { id: 10, text: "Make the best use of what is in your power, and take the rest as it happens.", author: "Epictetus", source: "Enchiridion" },
  { id: 11, text: "First say to yourself what you would be; and then do what you have to do.", author: "Epictetus" },
  { id: 12, text: "We suffer more in imagination than in reality.", author: "Seneca" },
  { id: 13, text: "Nothing can bring you peace but yourself.", author: "Ralph Waldo Emerson" },
  { id: 14, text: "The only way out of the labyrinth of suffering is to forgive.", author: "John Green" },
  { id: 15, text: "You can't go back and change the beginning, but you can start where you are and change the ending.", author: "C.S. Lewis" },
  { id: 16, text: "My mission in life is not merely to survive, but to thrive — with some passion, some compassion, some humor, and some style.", author: "Maya Angelou" },
  { id: 17, text: "If you don't like something, change it. If you can't change it, change your attitude.", author: "Maya Angelou" },
  { id: 18, text: "We delight in the beauty of the butterfly, but rarely admit the changes it has gone through to achieve that beauty.", author: "Maya Angelou" },
  { id: 19, text: "Out of difficulties grow miracles.", author: "Jean de la Bruyère" },
  { id: 20, text: "Happiness is not something ready-made. It comes from your own actions.", author: "Dalai Lama" },
  { id: 21, text: "The present moment is the only moment available to us, and it is the door to all moments.", author: "Thich Nhat Hanh" },
  { id: 22, text: "Drink your tea slowly and reverently, as if it is the axis on which the world earth revolves.", author: "Thich Nhat Hanh" },
  { id: 23, text: "The most important thing is to enjoy your life — to be happy. It's all that matters.", author: "Audrey Hepburn" },
  { id: 24, text: "Between stimulus and response there is a space. In that space is our power to choose our response.", author: "Viktor Frankl" },
  { id: 25, text: "When we are no longer able to change a situation, we are challenged to change ourselves.", author: "Viktor Frankl", source: "Man's Search for Meaning" },
  { id: 26, text: "Everything can be taken from a man but one thing: the last of human freedoms — to choose one's attitude in any given set of circumstances.", author: "Viktor Frankl" },
  { id: 27, text: "Desire is a contract you make with yourself to be unhappy until you get what you want.", author: "Naval Ravikant" },
  { id: 28, text: "A calm mind, a fit body, and a house full of love — these things cannot be bought. They must be earned.", author: "Naval Ravikant" },
  { id: 29, text: "Happiness is a choice and a skill, and if you keep practising it gets easier and easier.", author: "Naval Ravikant" },
  { id: 30, text: "The quality of your attention determines the quality of your experience.", author: "Naval Ravikant" },
  { id: 31, text: "Read what you love until you love to read.", author: "Naval Ravikant" },
  { id: 32, text: "Out beyond ideas of wrongdoing and rightdoing there is a field. I'll meet you there.", author: "Rumi" },
  { id: 33, text: "Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.", author: "Rumi" },
  { id: 34, text: "Sell your cleverness and buy bewilderment.", author: "Rumi" },
  { id: 35, text: "The cure for the pain is in the pain.", author: "Rumi" },
  { id: 36, text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { id: 37, text: "Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world.", author: "Albert Einstein" },
  { id: 38, text: "A person who never made a mistake never tried anything new.", author: "Albert Einstein" },
  { id: 39, text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { id: 40, text: "Not everything that is faced can be changed, but nothing can be changed until it is faced.", author: "James Baldwin" },
  { id: 41, text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
  { id: 42, text: "Do not go where the path may lead; go instead where there is no path and leave a trail.", author: "Ralph Waldo Emerson" },
  { id: 43, text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
  { id: 44, text: "Joy is not in things; it is in us.", author: "Richard Wagner" },
  { id: 45, text: "This too shall pass.", author: "Persian Proverb" },
];
