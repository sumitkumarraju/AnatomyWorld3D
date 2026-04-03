export interface QuizQuestion {
  id: string;
  organSlug: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const quizQuestions: QuizQuestion[] = [
  // Heart
  {
    id: 'heart-1',
    organSlug: 'heart',
    question: 'How many chambers does the human heart have?',
    options: ['2', '3', '4', '6'],
    correctIndex: 2,
    explanation: 'The heart has 4 chambers: right atrium, right ventricle, left atrium, and left ventricle.',
  },
  {
    id: 'heart-2',
    organSlug: 'heart',
    question: 'What is the largest artery in the human body?',
    options: ['Pulmonary artery', 'Aorta', 'Carotid artery', 'Femoral artery'],
    correctIndex: 1,
    explanation: 'The aorta is the largest artery, carrying oxygenated blood from the left ventricle to the rest of the body.',
  },
  {
    id: 'heart-3',
    organSlug: 'heart',
    question: 'Which valve separates the left atrium from the left ventricle?',
    options: ['Tricuspid', 'Mitral (Bicuspid)', 'Aortic', 'Pulmonary'],
    correctIndex: 1,
    explanation: 'The mitral (bicuspid) valve has two flaps and separates the left atrium from the left ventricle.',
  },
  {
    id: 'heart-4',
    organSlug: 'heart',
    question: 'What is the natural pacemaker of the heart?',
    options: ['AV Node', 'SA Node', 'Bundle of His', 'Purkinje Fibers'],
    correctIndex: 1,
    explanation: 'The sinoatrial (SA) node generates electrical impulses that set the heart rate.',
  },
  {
    id: 'heart-5',
    organSlug: 'heart',
    question: 'Approximately how many times does the heart beat per day?',
    options: ['50,000', '75,000', '100,000', '150,000'],
    correctIndex: 2,
    explanation: 'The heart beats approximately 100,000 times per day, pumping about 2,000 gallons of blood.',
  },
  // Lungs
  {
    id: 'lungs-1',
    organSlug: 'lungs',
    question: 'How many lobes does the right lung have?',
    options: ['1', '2', '3', '4'],
    correctIndex: 2,
    explanation: 'The right lung has 3 lobes (superior, middle, inferior), while the left has 2 lobes.',
  },
  {
    id: 'lungs-2',
    organSlug: 'lungs',
    question: 'Where does gas exchange occur in the lungs?',
    options: ['Bronchi', 'Trachea', 'Alveoli', 'Bronchioles'],
    correctIndex: 2,
    explanation: 'Gas exchange occurs in the alveoli — tiny air sacs surrounded by capillaries.',
  },
  {
    id: 'lungs-3',
    organSlug: 'lungs',
    question: 'What is the dome-shaped muscle that aids in breathing?',
    options: ['Intercostal muscles', 'Diaphragm', 'Pectoralis', 'Rectus abdominis'],
    correctIndex: 1,
    explanation: 'The diaphragm contracts and flattens during inhalation, creating negative pressure that draws air in.',
  },
  {
    id: 'lungs-4',
    organSlug: 'lungs',
    question: 'What substance reduces surface tension in the alveoli?',
    options: ['Mucus', 'Surfactant', 'Bile', 'Plasma'],
    correctIndex: 1,
    explanation: 'Pulmonary surfactant prevents alveoli from collapsing during expiration.',
  },
  {
    id: 'lungs-5',
    organSlug: 'lungs',
    question: 'Approximately how many alveoli are in both lungs?',
    options: ['30 million', '100 million', '300 million', '1 billion'],
    correctIndex: 2,
    explanation: 'The human lungs contain approximately 300 million alveoli, providing a huge surface area for gas exchange.',
  },
  // Brain
  {
    id: 'brain-1',
    organSlug: 'brain',
    question: 'Which part of the brain controls balance and coordination?',
    options: ['Cerebrum', 'Cerebellum', 'Brain stem', 'Hypothalamus'],
    correctIndex: 1,
    explanation: 'The cerebellum coordinates voluntary movements, balance, and motor learning.',
  },
  {
    id: 'brain-2',
    organSlug: 'brain',
    question: 'What percentage of the body\'s energy does the brain use?',
    options: ['5%', '10%', '20%', '35%'],
    correctIndex: 2,
    explanation: 'Despite being only 2% of body weight, the brain uses about 20% of the body\'s total energy.',
  },
  {
    id: 'brain-3',
    organSlug: 'brain',
    question: 'Which lobe of the brain is responsible for vision?',
    options: ['Frontal', 'Parietal', 'Temporal', 'Occipital'],
    correctIndex: 3,
    explanation: 'The occipital lobe, located at the back of the brain, processes visual information.',
  },
  {
    id: 'brain-4',
    organSlug: 'brain',
    question: 'How many neurons are present in the human brain?',
    options: ['1 billion', '10 billion', '86 billion', '200 billion'],
    correctIndex: 2,
    explanation: 'The human brain contains approximately 86 billion neurons.',
  },
  {
    id: 'brain-5',
    organSlug: 'brain',
    question: 'What protects the brain inside the skull?',
    options: ['Myelin', 'Meninges', 'Periosteum', 'Cartilage'],
    correctIndex: 1,
    explanation: 'The meninges are three protective membranes (dura mater, arachnoid, pia mater) surrounding the brain.',
  },
  // Liver
  {
    id: 'liver-1',
    organSlug: 'liver',
    question: 'The liver is the largest _____ organ in the body.',
    options: ['External', 'Internal', 'Muscular', 'Hollow'],
    correctIndex: 1,
    explanation: 'The liver is the largest internal organ and the largest gland in the human body.',
  },
  {
    id: 'liver-2',
    organSlug: 'liver',
    question: 'What does the liver produce to help digest fats?',
    options: ['Insulin', 'Bile', 'Pepsin', 'Amylase'],
    correctIndex: 1,
    explanation: 'The liver produces bile, which is stored in the gallbladder and helps emulsify fats during digestion.',
  },
  {
    id: 'liver-3',
    organSlug: 'liver',
    question: 'How many lobes does the liver have?',
    options: ['2', '3', '4', '5'],
    correctIndex: 0,
    explanation: 'The liver has two main lobes: the larger right lobe and the smaller left lobe.',
  },
  {
    id: 'liver-4',
    organSlug: 'liver',
    question: 'Which percentage of the liver can regenerate if removed?',
    options: ['25%', '50%', '75%', '90%'],
    correctIndex: 2,
    explanation: 'The liver can regenerate even if up to 75% of it is removed surgically.',
  },
  {
    id: 'liver-5',
    organSlug: 'liver',
    question: 'What is the main vein that brings blood to the liver from the digestive organs?',
    options: ['Hepatic vein', 'Portal vein', 'Inferior vena cava', 'Renal vein'],
    correctIndex: 1,
    explanation: 'The hepatic portal vein carries nutrient-rich blood from the digestive organs to the liver for processing.',
  },
  // Kidney
  {
    id: 'kidney-1',
    organSlug: 'kidney',
    question: 'What is the functional unit of the kidney?',
    options: ['Glomerulus', 'Nephron', 'Alveolus', 'Neuron'],
    correctIndex: 1,
    explanation: 'The nephron is the functional unit of the kidney, each kidney containing about 1 million nephrons.',
  },
  {
    id: 'kidney-2',
    organSlug: 'kidney',
    question: 'How much blood do the kidneys filter per day?',
    options: ['50 liters', '100 liters', '200 liters', '500 liters'],
    correctIndex: 2,
    explanation: 'The kidneys filter approximately 200 liters (about 50 gallons) of blood per day.',
  },
  {
    id: 'kidney-3',
    organSlug: 'kidney',
    question: 'Which hormone produced by kidneys stimulates red blood cell production?',
    options: ['Renin', 'Aldosterone', 'Erythropoietin', 'ADH'],
    correctIndex: 2,
    explanation: 'Erythropoietin (EPO) is produced by the kidneys and stimulates the bone marrow to produce red blood cells.',
  },
  {
    id: 'kidney-4',
    organSlug: 'kidney',
    question: 'Where does filtration of blood primarily occur in the kidney?',
    options: ['Loop of Henle', 'Collecting duct', 'Glomerulus', 'Renal pelvis'],
    correctIndex: 2,
    explanation: 'The glomerulus is a network of capillaries where blood is filtered under pressure.',
  },
  {
    id: 'kidney-5',
    organSlug: 'kidney',
    question: 'What is the approximate size of a human kidney?',
    options: ['2-3 inches', '4-5 inches', '7-8 inches', '10-12 inches'],
    correctIndex: 1,
    explanation: 'Each kidney is about 4-5 inches (10-12 cm) long, roughly the size of a fist.',
  },
  // Stomach
  {
    id: 'stomach-1',
    organSlug: 'stomach',
    question: 'What is the pH range of stomach acid?',
    options: ['1.5 - 3.5', '4 - 6', '7 - 8', '9 - 11'],
    correctIndex: 0,
    explanation: 'Stomach acid (hydrochloric acid) has a pH of 1.5 to 3.5, making it highly acidic.',
  },
  {
    id: 'stomach-2',
    organSlug: 'stomach',
    question: 'What enzyme begins protein digestion in the stomach?',
    options: ['Amylase', 'Lipase', 'Pepsin', 'Trypsin'],
    correctIndex: 2,
    explanation: 'Pepsin is the main enzyme in the stomach that breaks down proteins into smaller peptides.',
  },
  {
    id: 'stomach-3',
    organSlug: 'stomach',
    question: 'How often does the stomach lining replace itself?',
    options: ['Every day', 'Every 3-4 days', 'Every week', 'Every month'],
    correctIndex: 1,
    explanation: 'The stomach lining renews itself every 3-4 days to protect against its own digestive acid.',
  },
  {
    id: 'stomach-4',
    organSlug: 'stomach',
    question: 'What is the muscular movement that mixes food in the stomach called?',
    options: ['Peristalsis', 'Segmentation', 'Churning', 'Absorption'],
    correctIndex: 0,
    explanation: 'Peristalsis involves wave-like muscle contractions that mix and move food through the digestive tract.',
  },
  {
    id: 'stomach-5',
    organSlug: 'stomach',
    question: 'What bacteria commonly cause stomach ulcers?',
    options: ['E. coli', 'Staphylococcus', 'Helicobacter pylori', 'Streptococcus'],
    correctIndex: 2,
    explanation: 'Helicobacter pylori (H. pylori) is the most common cause of peptic ulcers.',
  },
];

export function getQuizByOrgan(organSlug: string): QuizQuestion[] {
  return quizQuestions.filter((q) => q.organSlug === organSlug);
}

export function getAllQuizQuestions(): QuizQuestion[] {
  return quizQuestions;
}

export function getRandomQuiz(count: number = 10): QuizQuestion[] {
  const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
