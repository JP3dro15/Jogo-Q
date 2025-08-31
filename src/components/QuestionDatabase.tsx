export interface Question {
  id: string;
  scenario: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  molecules: string[];
  contextImage?: string;
  timeLimit?: number;
}

export const questionDatabase: Question[] = [
  {
    id: 'survival-001',
    scenario: "EMERGÊNCIA: ÁGUA CONTAMINADA",
    question: "Você encontrou um reservatório subterrâneo, mas a água contém metais pesados tóxicos. Qual processo químico você deve usar para purificá-la e salvar sua vida?",
    options: [
      "Precipitação química com agentes quelantes",
      "Simples fervura da água",
      "Adição de açúcar para neutralizar",
      "Filtração com pano comum"
    ],
    correctAnswer: 0,
    explanation: "A precipitação química com agentes quelantes é o único método eficaz para remover metais pesados. Os quelantes se ligam aos metais, formando complexos insolúveis que podem ser filtrados.",
    difficulty: 'medium',
    molecules: ['H2O', 'Pb', 'Cd', 'Hg'],
    timeLimit: 45
  },
  {
    id: 'survival-002',
    scenario: "SITUAÇÃO CRÍTICA: SINALIZAÇÃO DE RESGATE",
    question: "Você precisa criar um sinal de fumaça visível para equipes de resgate. Qual reação química gera CO₂ rapidamente para inflar um balão de sinalização?",
    options: [
      "NaHCO₃ + Ácido acético → CO₂ + H₂O + Acetato",
      "NaCl + H₂O → Solução salina",
      "Mg + O₂ → MgO (combustão)",
      "H₂O₂ → H₂O + O₂ (decomposição)"
    ],
    correctAnswer: 0,
    explanation: "O bicarbonato de sódio (NaHCO₃) reagindo com ácido produz CO₂ rapidamente, permitindo inflar balões ou criar sinais de fumaça eficazes.",
    difficulty: 'easy',
    molecules: ['NaHCO3', 'CO2', 'H2O'],
    timeLimit: 30
  },
  {
    id: 'survival-003',
    scenario: "ALERTA TÓXICO: VAZAMENTO QUÍMICO",
    question: "Gases tóxicos estão se espalhando pelo seu abrigo após um vazamento industrial. Que substância você deve usar em sua máscara improvisada para adsorver esses poluentes?",
    options: [
      "Carvão ativado com elevada área superficial",
      "Algodão comum embebido em água",
      "Papel alumínio como barreira",
      "Tecido sintético qualquer"
    ],
    correctAnswer: 0,
    explanation: "O carvão ativado possui uma área superficial enorme (até 2000 m²/g) que permite adsorver eficientemente gases tóxicos e vapores químicos perigosos.",
    difficulty: 'medium',
    molecules: ['C', 'NH3', 'SO2', 'NO2'],
    timeLimit: 40
  },
  {
    id: 'survival-004',
    scenario: "NEUTRALIZAÇÃO DE EMERGÊNCIA",
    question: "Um derramamento de ácido sulfúrico está corroendo o piso do laboratório e ameaça suas reservas de comida. Qual base você deve usar para neutralizar o ácido com segurança?",
    options: [
      "NaOH (hidróxido de sódio) em pequenas quantidades",
      "Água em grande volume",
      "Bicarbonato de sódio (NaHCO₃)",
      "Vinagre para diluir"
    ],
    correctAnswer: 2,
    explanation: "O bicarbonato de sódio é mais seguro que NaOH puro, pois neutraliza ácidos gradualmente sem gerar calor excessivo. A reação: NaHCO₃ + H₂SO₄ → Na₂SO₄ + CO₂ + H₂O",
    difficulty: 'hard',
    molecules: ['H2SO4', 'NaHCO3', 'CO2', 'H2O'],
    timeLimit: 50
  },
  {
    id: 'survival-005',
    scenario: "GERAÇÃO DE ENERGIA CRÍTICA",
    question: "Sua fonte de energia falhou e você precisa gerar eletricidade para manter equipamentos médicos funcionando. Qual reação eletroquímica você pode usar com materiais disponíveis?",
    options: [
      "Pilha de Daniell: Zn + Cu²⁺ → Zn²⁺ + Cu",
      "Combustão de madeira para vapor",
      "Mistura de água com sal comum",
      "Atrito entre materiais plásticos"
    ],
    correctAnswer: 0,
    explanation: "A pilha de Daniell utiliza a diferença de potencial entre zinco e cobre para gerar eletricidade. É uma das formas mais eficazes de produzir energia com materiais básicos.",
    difficulty: 'hard',
    molecules: ['Zn', 'Cu', 'H2SO4', 'ZnSO4'],
    timeLimit: 60
  },
  {
    id: 'survival-006',
    scenario: "PURIFICAÇÃO DO AR",
    question: "O ar do bunker está se tornando irrespirável devido ao acúmulo de CO₂. Que processo químico você pode usar para absorver o dióxido de carbono e produzir oxigênio?",
    options: [
      "Fotossíntese artificial com plantas sobreviventes",
      "Eletrólise da água: 2H₂O → 2H₂ + O₂",
      "Ca(OH)₂ absorve CO₂: Ca(OH)₂ + CO₂ → CaCO₃ + H₂O",
      "Simples ventilação do ambiente"
    ],
    correctAnswer: 2,
    explanation: "Cal hidratada Ca(OH)₂ absorve CO₂ do ar, formando carbonato de cálcio. Este é um método prático para purificar o ar em espaços confinados.",
    difficulty: 'medium',
    molecules: ['CO2', 'CaOH2', 'CaCO3', 'H2O'],
    timeLimit: 45
  },
  {
    id: 'survival-007',
    scenario: "DESINFECÇÃO VITAL",
    question: "Você encontrou suprimentos médicos contaminados por bactérias. Qual composto químico pode ser sintetizado para desinfetar equipamentos sem danificá-los?",
    options: [
      "Peróxido de hidrogênio (H₂O₂) como oxidante",
      "Álcool etílico concentrado",
      "Hipoclorito de sódio (água sanitária diluída)",
      "Todas as alternativas acima são válidas"
    ],
    correctAnswer: 3,
    explanation: "Todos os compostos mencionados são desinfetantes eficazes: H₂O₂ oxida membranas celulares, álcool desnatura proteínas e hipoclorito destrói enzimas vitais dos patógenos.",
    difficulty: 'easy',
    molecules: ['H2O2', 'C2H5OH', 'NaClO'],
    timeLimit: 35
  },
  {
    id: 'survival-008',
    scenario: "TRATAMENTO DE QUEIMADURAS QUÍMICAS",
    question: "Você sofreu uma queimadura por base forte (NaOH) na pele. Qual é o primeiro tratamento químico correto para neutralizar e minimizar os danos?",
    options: [
      "Aplicar ácido fraco para neutralizar",
      "Lavar abundantemente com água por 20+ minutos",
      "Aplicar bicarbonato para absorver a base",
      "Usar álcool para limpar a região"
    ],
    correctAnswer: 1,
    explanation: "NUNCA neutralize bases na pele com ácidos! A reação pode gerar calor e piorar a queimadura. Apenas água abundante remove o agente químico com segurança.",
    difficulty: 'hard',
    molecules: ['NaOH', 'H2O'],
    timeLimit: 25
  },
  {
    id: 'survival-009',
    scenario: "CONSERVAÇÃO DE ALIMENTOS",
    question: "Seus alimentos estão apodrecendo rapidamente no calor pós-apocalíptico. Qual processo químico pode preservá-los por mais tempo sem refrigeração?",
    options: [
      "Desidratação osmótica com sal (NaCl)",
      "Adição de conservantes antioxidantes",
      "Processo de cura e defumação",
      "Todas as alternativas preservam alimentos"
    ],
    correctAnswer: 3,
    explanation: "Sal remove água por osmose, antioxidantes previnem rancificação, e a defumação adiciona compostos antibacterianos. Todos são métodos químicos válidos de preservação.",
    difficulty: 'medium',
    molecules: ['NaCl', 'H2O'],
    timeLimit: 40
  },
  {
    id: 'survival-010',
    scenario: "SÍNTESE DE MEDICAMENTOS ESSENCIAIS",
    question: "Você precisa sintetizar aspirina (ácido acetilsalicílico) para tratar inflamações. Qual é a reação química principal para sua produção?",
    options: [
      "Ácido salicílico + Anidrido acético → Aspirina + Ácido acético",
      "Fenol + Ácido acético → Aspirina",
      "Benzeno + Ácido sulfúrico → Aspirina",
      "Não é possível sintetizar medicamentos"
    ],
    correctAnswer: 0,
    explanation: "A síntese da aspirina envolve a acetilação do ácido salicílico com anidrido acético, produzindo ácido acetilsalicílico (aspirina) e ácido acético como subproduto.",
    difficulty: 'hard',
    molecules: ['C7H6O3', 'C4H6O3', 'C9H8O4'],
    timeLimit: 55
  }
];

export const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const shuffleQuestions = (questions: Question[]): Question[] => {
  return shuffleArray(questions).map(question => ({
    ...question,
    options: shuffleArray(question.options.map((opt, idx) => ({ text: opt, originalIndex: idx })))
      .map(item => item.text),
    correctAnswer: question.options.findIndex(opt => 
      opt === question.options[question.correctAnswer]
    )
  }));
};

export const getQuestionsByDifficulty = (difficulty?: 'easy' | 'medium' | 'hard'): Question[] => {
  if (!difficulty) return questionDatabase;
  return questionDatabase.filter(q => q.difficulty === difficulty);
};

export const getRandomQuestions = (count: number, difficulty?: 'easy' | 'medium' | 'hard'): Question[] => {
  const questions = getQuestionsByDifficulty(difficulty);
  return shuffleArray(questions).slice(0, count);
};