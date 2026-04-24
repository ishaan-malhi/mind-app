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
  // ── Stoics ──────────────────────────────────────────────────────────────
  { id: 0,   text: "You have power over your mind, not outside events. Realise this, and you will find strength.", author: "Marcus Aurelius", source: "Meditations" },
  { id: 1,   text: "The happiness of your life depends upon the quality of your thoughts.", author: "Marcus Aurelius", source: "Meditations" },
  { id: 2,   text: "Very little is needed to make a happy life; it is all within yourself, in your way of thinking.", author: "Marcus Aurelius", source: "Meditations" },
  { id: 3,   text: "Waste no more time arguing what a good man should be. Be one.", author: "Marcus Aurelius", source: "Meditations" },
  { id: 4,   text: "When you arise in the morning, think of what a precious privilege it is to be alive — to breathe, to think, to enjoy, to love.", author: "Marcus Aurelius", source: "Meditations" },
  { id: 5,   text: "Loss is nothing else but change, and change is Nature's delight.", author: "Marcus Aurelius" },
  { id: 6,   text: "He who lives in harmony with himself lives in harmony with the universe.", author: "Marcus Aurelius" },
  { id: 7,   text: "Begin at once to live, and count each separate day as a separate life.", author: "Seneca", source: "Letters" },
  { id: 8,   text: "True happiness is to enjoy the present, without anxious dependence upon the future.", author: "Seneca", source: "Letters" },
  { id: 9,   text: "We suffer more in imagination than in reality.", author: "Seneca" },
  { id: 10,  text: "He who fears death will never do anything worthy of a man who is alive.", author: "Seneca" },
  { id: 11,  text: "It's not what happens to you, but how you react to it that matters.", author: "Epictetus" },
  { id: 12,  text: "Wealth consists not in having great possessions, but in having few wants.", author: "Epictetus" },
  { id: 13,  text: "Make the best use of what is in your power, and take the rest as it happens.", author: "Epictetus", source: "Enchiridion" },
  { id: 14,  text: "First say to yourself what you would be; and then do what you have to do.", author: "Epictetus" },
  { id: 15,  text: "It is the nature of the wise to resist pleasures, but the foolish to be a slave to them.", author: "Epictetus" },
  { id: 16,  text: "The key is to keep company only with people who uplift you, whose presence calls forth your best.", author: "Epictetus" },

  // ── Eastern philosophy ──────────────────────────────────────────────────
  { id: 17,  text: "He who knows himself is enlightened.", author: "Laozi" },
  { id: 18,  text: "Silence is a source of great strength.", author: "Laozi" },
  { id: 19,  text: "From wonder into wonder existence opens.", author: "Laozi" },
  { id: 20,  text: "Great acts are made up of small deeds.", author: "Laozi" },
  { id: 21,  text: "To see things in the seed, that is genius.", author: "Laozi" },
  { id: 22,  text: "Music in the soul can be heard by the universe.", author: "Laozi" },
  { id: 23,  text: "The journey of a thousand miles begins with one step.", author: "Laozi" },
  { id: 24,  text: "When I let go of what I am, I become what I might be.", author: "Laozi" },
  { id: 25,  text: "He who knows that enough is enough will always have enough.", author: "Laozi" },
  { id: 26,  text: "He who conquers others is strong; he who conquers himself is mighty.", author: "Laozi" },
  { id: 27,  text: "Knowing others is wisdom, knowing yourself is enlightenment.", author: "Laozi" },
  { id: 28,  text: "If you correct your mind, the rest of your life will fall into place.", author: "Laozi" },
  { id: 29,  text: "Nothing is softer or more flexible than water, yet nothing can resist it.", author: "Laozi" },
  { id: 30,  text: "When you realize there is nothing lacking, the whole world belongs to you.", author: "Laozi" },
  { id: 31,  text: "If you do not change direction, you may end up where you are heading.", author: "Laozi" },
  { id: 32,  text: "When you are content to be simply yourself and don't compare or compete, everybody will respect you.", author: "Laozi" },
  { id: 33,  text: "At the center of your being you have the answer; you know who you are and you know what you want.", author: "Laozi" },
  { id: 34,  text: "Wherever you go, go with all your heart.", author: "Confucius" },
  { id: 35,  text: "Everything has beauty, but not everyone sees it.", author: "Confucius" },
  { id: 36,  text: "The more you know yourself, the more you forgive yourself.", author: "Confucius" },
  { id: 37,  text: "Life is really simple, but we insist on making it complicated.", author: "Confucius" },
  { id: 38,  text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { id: 39,  text: "Our greatest glory is not in never falling, but in rising every time we fall.", author: "Confucius" },
  { id: 40,  text: "Silence is the true friend that never betrays.", author: "Confucius" },
  { id: 41,  text: "The root of suffering is attachment.", author: "The Buddha" },
  { id: 42,  text: "Three things cannot be long hidden: the sun, the moon, and the truth.", author: "The Buddha" },
  { id: 43,  text: "Your worst enemy cannot harm you as much as your own unguarded thoughts.", author: "The Buddha" },
  { id: 44,  text: "Better than a thousand hollow words is one word that brings peace.", author: "The Buddha" },
  { id: 45,  text: "Those who are free of resentful thoughts surely find peace.", author: "The Buddha" },
  { id: 46,  text: "A single lamp may light hundreds of thousands of lamps without itself being diminished.", author: "The Buddha" },
  { id: 47,  text: "There is nothing permanent except change.", author: "Heraclitus" },

  // ── Rumi & Eastern poets ────────────────────────────────────────────────
  { id: 48,  text: "Out beyond ideas of wrongdoing and rightdoing there is a field. I'll meet you there.", author: "Rumi" },
  { id: 49,  text: "Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.", author: "Rumi" },
  { id: 50,  text: "The cure for the pain is in the pain.", author: "Rumi" },
  { id: 51,  text: "Sell your cleverness and buy bewilderment.", author: "Rumi" },
  { id: 52,  text: "Beauty is not in the face; beauty is a light in the heart.", author: "Kahlil Gibran" },
  { id: 53,  text: "A little knowledge that acts is worth infinitely more than much knowledge that is idle.", author: "Kahlil Gibran" },
  { id: 54,  text: "You can't cross the sea merely by standing and staring at the water.", author: "Rabindranath Tagore" },
  { id: 55,  text: "The present moment is the only moment available to us, and it is the door to all moments.", author: "Thich Nhat Hanh" },
  { id: 56,  text: "Drink your tea slowly and reverently, as if it is the axis on which the world revolves.", author: "Thich Nhat Hanh" },
  { id: 57,  text: "Happiness is not something ready-made. It comes from your own actions.", author: "Dalai Lama" },

  // ── Emerson & American transcendentalists ───────────────────────────────
  { id: 58,  text: "Nothing can bring you peace but yourself.", author: "Ralph Waldo Emerson" },
  { id: 59,  text: "Adopt the pace of nature: her secret is patience.", author: "Ralph Waldo Emerson" },
  { id: 60,  text: "The invariable mark of wisdom is to see the miraculous in the common.", author: "Ralph Waldo Emerson" },
  { id: 61,  text: "Life is a succession of lessons which must be lived to be understood.", author: "Ralph Waldo Emerson" },
  { id: 62,  text: "Do not go where the path may lead; go instead where there is no path and leave a trail.", author: "Ralph Waldo Emerson" },
  { id: 63,  text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
  { id: 64,  text: "It's not what you look at that matters, it's what you see.", author: "Henry David Thoreau" },
  { id: 65,  text: "It is a characteristic of wisdom not to do desperate things.", author: "Henry David Thoreau" },

  // ── Viktor Frankl ───────────────────────────────────────────────────────
  { id: 66,  text: "Between stimulus and response there is a space. In that space is our power to choose our response.", author: "Viktor Frankl" },
  { id: 67,  text: "When we are no longer able to change a situation, we are challenged to change ourselves.", author: "Viktor Frankl", source: "Man's Search for Meaning" },
  { id: 68,  text: "Everything can be taken from a man but one thing: the last of human freedoms — to choose one's attitude in any given set of circumstances.", author: "Viktor Frankl" },

  // ── Carl Jung & William James ────────────────────────────────────────────
  { id: 69,  text: "Everything that irritates us about others can lead us to an understanding of ourselves.", author: "Carl Jung" },
  { id: 70,  text: "The least of things with a meaning is worth more in life than the greatest of things without it.", author: "Carl Jung" },
  { id: 71,  text: "To change one's life, start immediately, do it flamboyantly, no exceptions.", author: "William James" },

  // ── Einstein ────────────────────────────────────────────────────────────
  { id: 72,  text: "Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world.", author: "Albert Einstein" },
  { id: 73,  text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
  { id: 74,  text: "A person who never made a mistake never tried anything new.", author: "Albert Einstein" },
  { id: 75,  text: "Learn from yesterday, live for today, hope for tomorrow.", author: "Albert Einstein" },
  { id: 76,  text: "Life is like riding a bicycle. To keep your balance you must keep moving.", author: "Albert Einstein" },
  { id: 77,  text: "Once we accept our limits, we go beyond them.", author: "Albert Einstein" },
  { id: 78,  text: "Try not to become a man of success, but rather try to become a man of value.", author: "Albert Einstein" },

  // ── Camus & existentialists ─────────────────────────────────────────────
  { id: 79,  text: "In the depth of winter, I finally learned that there was within me an invincible summer.", author: "Albert Camus" },
  { id: 80,  text: "There is more wisdom in your body than in your deepest philosophy.", author: "Friedrich Nietzsche" },
  { id: 81,  text: "Start with what is right rather than what is acceptable.", author: "Franz Kafka" },

  // ── Statesmen & leaders ─────────────────────────────────────────────────
  { id: 82,  text: "Most folks are as happy as they make up their minds to be.", author: "Abraham Lincoln" },
  { id: 83,  text: "I walk slowly, but I never walk backward.", author: "Abraham Lincoln" },
  { id: 84,  text: "The best thing about the future is that it only comes one day at a time.", author: "Abraham Lincoln" },
  { id: 85,  text: "If you're going through hell, keep going.", author: "Winston Churchill" },
  { id: 86,  text: "To improve is to change; to be perfect is to change often.", author: "Winston Churchill" },
  { id: 87,  text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { id: 88,  text: "A good head and a good heart are always a formidable combination.", author: "Nelson Mandela" },
  { id: 89,  text: "To conquer fear is the beginning of wisdom.", author: "Bertrand Russell" },
  { id: 90,  text: "The weak can never forgive. Forgiveness is the attribute of the strong.", author: "Mahatma Gandhi" },
  { id: 91,  text: "Happiness is when what you think, what you say, and what you do are in harmony.", author: "Mahatma Gandhi" },
  { id: 92,  text: "Be the change that you want to see in the world.", author: "Mahatma Gandhi" },

  // ── Writers & poets ─────────────────────────────────────────────────────
  { id: 93,  text: "My mission in life is not merely to survive, but to thrive — with some passion, some compassion, some humor, and some style.", author: "Maya Angelou" },
  { id: 94,  text: "If you don't like something, change it. If you can't change it, change your attitude.", author: "Maya Angelou" },
  { id: 95,  text: "Not everything that is faced can be changed, but nothing can be changed until it is faced.", author: "James Baldwin" },
  { id: 96,  text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { id: 97,  text: "Honesty is the first chapter in the book of wisdom.", author: "Thomas Jefferson" },
  { id: 98,  text: "By failing to prepare, you are preparing to fail.", author: "Benjamin Franklin" },
  { id: 99,  text: "The doorstep to the temple of wisdom is a knowledge of our own ignorance.", author: "Benjamin Franklin" },
  { id: 100, text: "The secret of getting ahead is getting started.", author: "Mark Twain" },

  // ── Ancient Greece ──────────────────────────────────────────────────────
  { id: 101, text: "Quality is not an act; it is a habit.", author: "Aristotle" },
  { id: 102, text: "Those that know, do. Those that understand, teach.", author: "Aristotle" },
  { id: 103, text: "Keep your eyes on the stars and your feet on the ground.", author: "Theodore Roosevelt" },
  { id: 104, text: "The higher we are placed, the more humbly we should walk.", author: "Cicero" },
  { id: 105, text: "The function of wisdom is to discriminate between good and evil.", author: "Cicero" },

  // ── Contemporary ────────────────────────────────────────────────────────
  { id: 106, text: "A calm mind, a fit body, and a house full of love — these things cannot be bought. They must be earned.", author: "Naval Ravikant" },
  { id: 107, text: "Happiness is a choice and a skill, and if you keep practising it gets easier and easier.", author: "Naval Ravikant" },
  { id: 108, text: "Desire is a contract you make with yourself to be unhappy until you get what you want.", author: "Naval Ravikant" },
  { id: 109, text: "The quality of your attention determines the quality of your experience.", author: "Naval Ravikant" },
  { id: 110, text: "What wisdom can you find that is greater than kindness?", author: "Jean-Jacques Rousseau" },
  { id: 111, text: "Out of difficulties grow miracles.", author: "Jean de la Bruyère" },
  { id: 112, text: "The universe is full of magical things, patiently waiting for our wits to grow sharper.", author: "Eden Phillpotts" },
];
