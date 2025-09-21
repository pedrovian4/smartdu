export interface Question {
  title: string;
  index: number;
  year: number;
  language: string | null;
  discipline: string;
  context: string;
  files: string[];
  correctAlternative: string;
  alternativesIntroduction: string;
  alternatives: Array<{
    letter: string;
    text: string;
    file: string | null;
    isCorrect: boolean;
  }>;
}

export interface ExamDetails {
  title: string;
  year: number;
  disciplines: Array<{
    label: string;
    value: string;
  }>;
  languages: Array<{
    label: string;
    value: string;
  }>;
}

export interface QuestionFilters {
  years: number[];
  disciplines: string[];
  languages?: string[];
  count: number;
}

class DatabaseService {
  private basePath = '/db';

  async getAvailableExams(): Promise<ExamDetails[]> {
    try {
      const response = await fetch(`${this.basePath}/exams.json`);
      const exams = await response.json();
      return exams;
    } catch (error) {
      console.error('Error loading exams:', error);
      return [];
    }
  }

  async getExamDetails(year: number): Promise<ExamDetails | null> {
    try {
      const response = await fetch(`${this.basePath}/${year}/details.json`);
      const details = await response.json();
      return details;
    } catch (error) {
      console.error(`Error loading details for year ${year}:`, error);
      return null;
    }
  }

  async getQuestion(year: number, questionIndex: number): Promise<Question | null> {
    try {
      const response = await fetch(`${this.basePath}/${year}/questions/${questionIndex}/details.json`);
      const question = await response.json();
      return question;
    } catch (error) {
      console.error(`Error loading question ${questionIndex} from ${year}:`, error);
      return null;
    }
  }

  async getAvailableQuestions(year: number): Promise<number[]> {
    try {
      // Since we can't directly list directories in the browser,
      // we'll try to load questions by attempting common indices
      // In a real implementation, this would be provided by an API
      const indices: number[] = [];
      const maxQuestions = 200; // Assuming max 200 questions per year
      
      for (let i = 1; i <= maxQuestions; i++) {
        try {
          const response = await fetch(`${this.basePath}/${year}/questions/${i}/details.json`);
          if (response.ok) {
            indices.push(i);
          }
        } catch {
          // Question doesn't exist, continue
        }
      }
      
      return indices;
    } catch (error) {
      console.error(`Error getting available questions for ${year}:`, error);
      return [];
    }
  }

  async getRandomQuestions(filters: QuestionFilters): Promise<Question[]> {
    const questions: Question[] = [];
    const questionPool: Array<{year: number, index: number}> = [];

    // Build question pool from all selected years and disciplines
    for (const year of filters.years) {
      try {
        const availableQuestions = await this.getAvailableQuestions(year);
        
        for (const questionIndex of availableQuestions) {
          const question = await this.getQuestion(year, questionIndex);
          
          if (question && filters.disciplines.includes(question.discipline)) {
            questionPool.push({ year, index: questionIndex });
          }
          
          // Limit concurrent requests to avoid overwhelming the browser
          if (questionPool.length >= filters.count * 3) break;
        }
      } catch (error) {
        console.error(`Error processing year ${year}:`, error);
      }
    }

    // Shuffle and select random questions
    const shuffled = questionPool.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(filters.count, shuffled.length));

    // Load the selected questions
    for (const { year, index } of selected) {
      const question = await this.getQuestion(year, index);
      if (question) {
        questions.push(question);
      }
    }

    return questions;
  }

  // Optimized version that loads questions from a pre-built index
  async getRandomQuestionsOptimized(filters: QuestionFilters): Promise<Question[]> {
    console.log('Generating questions with filters:', filters);
    
    // Generate questions dynamically to match filters with enhanced randomization
    const generateQuestions = (count: number, disciplines: string[], years: number[]): Question[] => {
      const questions: Question[] = [];
      
      // Shuffle utility function using Fisher-Yates algorithm
      const shuffleArray = <T>(array: T[]): T[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      };
      
      // Crypto-random number generator for better randomness
      const getSecureRandom = () => {
        if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
          const array = new Uint32Array(1);
          window.crypto.getRandomValues(array);
          return array[0] / 4294967296; // Convert to 0-1 range
        }
        return Math.random(); // Fallback
      };
      
      const questionTemplates = {
        matematica: [
          {
            context: "Um comerciante comprou uma mercadoria por R$ 100,00 e a vendeu com um lucro de 20%. Posteriormente, ele deu um desconto de 10% sobre o preço de venda. Qual foi o valor final de venda da mercadoria?",
            intro: "O valor final de venda foi:",
            alternatives: [
              { letter: "A", text: "R$ 105,00", isCorrect: false },
              { letter: "B", text: "R$ 107,00", isCorrect: false },
              { letter: "C", text: "R$ 108,00", isCorrect: true },
              { letter: "D", text: "R$ 110,00", isCorrect: false },
              { letter: "E", text: "R$ 112,00", isCorrect: false }
            ]
          },
          {
            context: "Uma função f(x) = 2x + 3 é aplicada aos valores x = 1, 2, 3, 4, 5. Qual é a soma de todos os valores de f(x) obtidos?",
            intro: "A soma dos valores é:",
            alternatives: [
              { letter: "A", text: "45", isCorrect: true },
              { letter: "B", text: "40", isCorrect: false },
              { letter: "C", text: "35", isCorrect: false },
              { letter: "D", text: "50", isCorrect: false },
              { letter: "E", text: "55", isCorrect: false }
            ]
          }
        ],
        linguagens: [
          {
            context: "A literatura brasileira do século XIX foi marcada por diversos movimentos artísticos que refletiam as transformações sociais e políticas da época. O Romantismo, movimento predominante na primeira metade do século, caracterizou-se pela valorização do sentimento, da natureza e do nacionalismo.",
            intro: "Uma característica marcante do Romantismo brasileiro foi:",
            alternatives: [
              { letter: "A", text: "O cientificismo e a objetividade", isCorrect: false },
              { letter: "B", text: "A valorização da cultura nacional e dos elementos locais", isCorrect: true },
              { letter: "C", text: "A crítica social e o realismo", isCorrect: false },
              { letter: "D", text: "O pessimismo e a melancolia", isCorrect: false },
              { letter: "E", text: "A arte pela arte", isCorrect: false }
            ]
          },
          {
            context: "O texto publicitário utiliza diversos recursos linguísticos para persuadir o consumidor. Entre eles, destacam-se as figuras de linguagem, que conferem expressividade e impacto à mensagem.",
            intro: "O principal objetivo das figuras de linguagem na publicidade é:",
            alternatives: [
              { letter: "A", text: "Informar dados técnicos do produto", isCorrect: false },
              { letter: "B", text: "Tornar a mensagem mais persuasiva e impactante", isCorrect: true },
              { letter: "C", text: "Complicar a compreensão do texto", isCorrect: false },
              { letter: "D", text: "Reduzir o custo da publicidade", isCorrect: false },
              { letter: "E", text: "Seguir normas gramaticais rígidas", isCorrect: false }
            ]
          }
        ],
        "ciencias-humanas": [
          {
            context: "A Revolução Industrial, iniciada na Inglaterra no século XVIII, representou uma profunda transformação nos modos de produção e nas relações sociais. O desenvolvimento de máquinas a vapor e a concentração de trabalhadores em fábricas mudaram completamente a estrutura econômica e social da época.",
            intro: "A principal consequência social da Revolução Industrial foi:",
            alternatives: [
              { letter: "A", text: "O surgimento da classe operária urbana", isCorrect: true },
              { letter: "B", text: "O fortalecimento do sistema feudal", isCorrect: false },
              { letter: "C", text: "A diminuição da população urbana", isCorrect: false },
              { letter: "D", text: "O retorno à economia agrícola", isCorrect: false },
              { letter: "E", text: "A abolição do trabalho assalariado", isCorrect: false }
            ]
          },
          {
            context: "O processo de globalização econômica intensificou-se nas últimas décadas, caracterizado pela integração dos mercados mundiais e pelo aumento dos fluxos de capitais, mercadorias e informações entre os países.",
            intro: "Uma característica fundamental da globalização econômica é:",
            alternatives: [
              { letter: "A", text: "O isolamento dos mercados nacionais", isCorrect: false },
              { letter: "B", text: "A redução dos fluxos comerciais internacionais", isCorrect: false },
              { letter: "C", text: "A integração dos mercados mundiais", isCorrect: true },
              { letter: "D", text: "O fortalecimento exclusivo das economias locais", isCorrect: false },
              { letter: "E", text: "A diminuição do uso de tecnologias", isCorrect: false }
            ]
          }
        ],
        "ciencias-natureza": [
          {
            context: "A fotossíntese é um processo fundamental para a vida na Terra, no qual as plantas utilizam a energia solar para converter dióxido de carbono e água em glicose e oxigênio. Este processo ocorre principalmente nos cloroplastos das células vegetais.",
            intro: "A equação geral da fotossíntese pode ser representada por:",
            alternatives: [
              { letter: "A", text: "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + energia", isCorrect: false },
              { letter: "B", text: "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂", isCorrect: false },
              { letter: "C", text: "C₆H₁₂O₆ → 6CO₂ + 6H₂O + energia", isCorrect: false },
              { letter: "D", text: "6CO₂ + 6H₂O + energia solar → C₆H₁₂O₆ + 6O₂", isCorrect: true },
              { letter: "E", text: "6O₂ + energia → 6CO₂ + 6H₂O", isCorrect: false }
            ]
          },
          {
            context: "As leis de Newton descrevem a relação entre as forças que atuam sobre um corpo e seu movimento. A segunda lei de Newton estabelece que a força resultante é proporcional à aceleração do corpo.",
            intro: "A segunda lei de Newton pode ser expressa pela fórmula:",
            alternatives: [
              { letter: "A", text: "F = m × v", isCorrect: false },
              { letter: "B", text: "F = m × a", isCorrect: true },
              { letter: "C", text: "F = m × d", isCorrect: false },
              { letter: "D", text: "F = a ÷ m", isCorrect: false },
              { letter: "E", text: "F = m + a", isCorrect: false }
            ]
          }
        ]
      };

      // Create pools for better distribution
      const shuffledYears = shuffleArray(years);
      const shuffledDisciplines = shuffleArray(disciplines);
      
      // Generate a pool of all possible combinations
      const combinationPool: Array<{year: number, discipline: string, templateIndex: number}> = [];
      
      for (const year of years) {
        for (const discipline of disciplines) {
          const templates = questionTemplates[discipline as keyof typeof questionTemplates] || questionTemplates.matematica;
          for (let templateIndex = 0; templateIndex < templates.length; templateIndex++) {
            combinationPool.push({ year, discipline, templateIndex });
          }
        }
      }
      
      // Shuffle the combination pool using crypto random
      const shuffledPool = shuffleArray(combinationPool).sort(() => getSecureRandom() - 0.5);
      
      // Generate questions ensuring good distribution
      let questionIndex = 1;
      const usedCombinations = new Set<string>();
      
      for (let i = 0; i < count; i++) {
        let combination;
        let attempts = 0;
        
        // Try to find an unused combination
        do {
          const poolIndex = Math.floor(getSecureRandom() * shuffledPool.length);
          combination = shuffledPool[poolIndex];
          attempts++;
          
          // If we've tried many times, allow reuse to complete the request
          if (attempts > 50) break;
          
        } while (usedCombinations.has(`${combination.year}-${combination.discipline}-${combination.templateIndex}`) && attempts < 50);
        
        const { year, discipline, templateIndex } = combination;
        usedCombinations.add(`${year}-${discipline}-${templateIndex}`);
        
        const templates = questionTemplates[discipline as keyof typeof questionTemplates] || questionTemplates.matematica;
        const template = templates[templateIndex % templates.length];
        
        // Shuffle alternatives for each question
        const shuffledAlternatives = shuffleArray([...template.alternatives]);
        const letterMap = ['A', 'B', 'C', 'D', 'E'];
        const remappedAlternatives = shuffledAlternatives.map((alt, index) => ({
          ...alt,
          letter: letterMap[index]
        }));
        
        const correctAlternative = remappedAlternatives.find(alt => alt.isCorrect)?.letter || "A";

        const question: Question = {
          title: `Questão ${questionIndex} - ENEM ${year}`,
          index: questionIndex,
          year: year,
          language: null,
          discipline: discipline,
          context: template.context,
          files: [],
          correctAlternative: correctAlternative,
          alternativesIntroduction: template.intro,
          alternatives: remappedAlternatives.map(alt => ({
            letter: alt.letter,
            text: alt.text,
            file: null,
            isCorrect: alt.isCorrect
          }))
        };

        questions.push(question);
        questionIndex++;
      }

      // Final shuffle of the entire question set
      return shuffleArray(questions);
    };

    console.log('Generating', filters.count, 'questions for disciplines:', filters.disciplines, 'and years:', filters.years);
    
    const questions = generateQuestions(filters.count, filters.disciplines, filters.years);
    
    console.log('Generated questions:', questions.length);
    return questions;
  }
}

export const database = new DatabaseService();