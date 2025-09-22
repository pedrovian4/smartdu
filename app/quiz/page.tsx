"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  Flag, 
  BookOpen, 
  CheckCircle, 
  XCircle,
  Home,
  FileText,
  Play
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Question {
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

interface QuizResult {
  questionIndex: number;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
}

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [score, setScore] = useState(0);
  const [selectedQuestionReview, setSelectedQuestionReview] = useState<number | null>(null);

  // Load questions based on URL parameters
  useEffect(() => {
    const loadQuestions = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const count = parseInt(urlParams.get('count') || '10');
      const years = urlParams.get('years')?.split(',').map(Number) || [2023];
      const disciplines = urlParams.get('disciplines')?.split(',') || ['matematica'];

      try {
        const { database } = await import('@/lib/database');
        const loadedQuestions = await database.getRandomQuestionsOptimized({
          count,
          years,
          disciplines
        });
        
        setQuestions(loadedQuestions);
        setTimeRemaining(loadedQuestions.length * 150); // 2.5 minutes per question
      } catch (error) {
        console.error('Error loading questions:', error);
        // Fallback to mock data if database fails
        const mockQuestions: Question[] = [
          {
            title: "Questão 1 - ENEM 2023",
            index: 1,
            year: 2023,
            language: null,
            discipline: "matematica",
            context: "Um comerciante comprou uma mercadoria por R$ 100,00 e a vendeu com um lucro de 20%. Posteriormente, ele deu um desconto de 10% sobre o preço de venda. Qual foi o valor final de venda da mercadoria?",
            files: [],
            correctAlternative: "C",
            alternativesIntroduction: "O valor final de venda foi:",
            alternatives: [
              { letter: "A", text: "R$ 105,00", file: null, isCorrect: false },
              { letter: "B", text: "R$ 107,00", file: null, isCorrect: false },
              { letter: "C", text: "R$ 108,00", file: null, isCorrect: true },
              { letter: "D", text: "R$ 110,00", file: null, isCorrect: false },
              { letter: "E", text: "R$ 112,00", file: null, isCorrect: false }
            ]
          }
        ];
        setQuestions(mockQuestions);
        setTimeRemaining(mockQuestions.length * 150);
      }
    };

    loadQuestions();
  }, []);

  // Timer effect
  useEffect(() => {
    if (isQuizStarted && !isQuizFinished && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeRemaining === 0 && isQuizStarted) {
      finishQuiz();
    }
  }, [isQuizStarted, isQuizFinished, timeRemaining]);

  const startQuiz = () => {
    setIsQuizStarted(true);
  };

  const finishQuiz = () => {
    setIsQuizFinished(true);
    calculateResults();
  };

  const calculateResults = () => {
    const quizResults: QuizResult[] = questions.map((question, index) => {
      const selectedAnswer = selectedAnswers[index] || "";
      const correctAnswer = question.correctAlternative;
      const isCorrect = selectedAnswer === correctAnswer;
      
      return {
        questionIndex: index,
        selectedAnswer,
        correctAnswer,
        isCorrect,
        timeSpent: 150 // Mock time
      };
    });
    
    setResults(quizResults);
    setScore(quizResults.filter(r => r.isCorrect).length);
  };

  const selectAnswer = (questionIndex: number, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
    
    // Auto-advance to next question after a short delay (except on last question)
    if (questionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, 800);
    }
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestion(index);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 70) return "text-green-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando questões...</p>
        </div>
      </div>
    );
  }

  if (!isQuizStarted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-lg mx-auto w-full">
          <Card className="border border-slate-200 bg-white">
            <CardHeader className="text-center pb-8 pt-12">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-rose-100 rounded-full">
                  <BookOpen className="h-12 w-12 text-rose-600" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-slate-900 mb-2">
                Pronto para começar?
              </CardTitle>
              <p className="text-slate-600 text-lg">
                Seu simulado está configurado e pronto para iniciar
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6 sm:space-y-8 px-6 sm:px-8 lg:px-12 pb-8 sm:pb-12">
              {/* Quiz Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="text-center p-4 sm:p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <FileText className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-emerald-800 mb-1">
                    {questions.length}
                  </div>
                  <div className="text-sm font-medium text-emerald-700">
                    Questões
                  </div>
                </div>
                
                <div className="text-center p-4 sm:p-6 bg-violet-50 rounded-2xl border border-violet-100">
                  <Clock className="h-8 w-8 text-violet-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-violet-800 mb-1 font-mono">
                    {formatTime(timeRemaining)}
                  </div>
                  <div className="text-sm font-medium text-violet-700">
                    Tempo Total
                  </div>
                </div>
              </div>
              
              {/* Instructions */}
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-100">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-slate-600" />
                  <h3 className="font-semibold text-slate-900">
                    Instruções
                  </h3>
                </div>
                <div className="space-y-3 text-sm text-slate-700">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-rose-500 mt-0.5 flex-shrink-0" />
                    <span>Leia cada questão com atenção antes de responder</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-rose-500 mt-0.5 flex-shrink-0" />
                    <span>Você pode navegar entre as questões livremente</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-rose-500 mt-0.5 flex-shrink-0" />
                    <span>O cronômetro iniciará após clicar em "Iniciar"</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-rose-500 mt-0.5 flex-shrink-0" />
                    <span>Você pode finalizar o simulado a qualquer momento</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={startQuiz}
                className="w-full h-12 sm:h-16 text-lg sm:text-xl font-semibold bg-rose-500 hover:bg-rose-600 border-0 rounded-2xl transition-colors duration-200 flex items-center justify-center gap-3"
              >
                <Play className="h-6 w-6" />
                Iniciar Simulado
              </Button>
              
              <p className="text-center text-sm text-slate-500">
                Boa sorte nos seus estudos!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isQuizFinished) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <Image src="/image.png" alt="ENEM Logo" width={36} height={36} className="rounded-lg" />
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Resultado do Simulado</h1>
                  <p className="text-xs sm:text-sm text-slate-600">Confira seu desempenho e revise as questões</p>
                </div>
              </div>
              <Link href="/">
                <Button variant="outline" className="border-slate-200 hover:bg-slate-50">
                  <Home className="h-4 w-4 mr-2" />
                  Início
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Score Summary */}
          <div className="text-center mb-12">
            <div className={`text-4xl sm:text-6xl lg:text-7xl font-bold ${getScoreColor()} mb-4`}>
              {score}/{questions.length}
            </div>
            <div className="text-lg sm:text-xl lg:text-2xl text-slate-700 mb-6">
              Você acertou {Math.round((score / questions.length) * 100)}% das questões
            </div>
            <Progress 
              value={(score / questions.length) * 100} 
              className="w-64 sm:w-80 mx-auto h-3 sm:h-4"
            />
            
            {/* Performance Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12 max-w-2xl mx-auto">
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-100">
                <div className="text-2xl sm:text-3xl font-semibold text-emerald-600 mb-2">{score}</div>
                <div className="text-sm font-medium text-slate-700">Acertos</div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-100">
                <div className="text-2xl sm:text-3xl font-semibold text-red-500 mb-2">{questions.length - score}</div>
                <div className="text-sm font-medium text-slate-700">Erros</div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-100">
                <div className="text-2xl sm:text-3xl font-semibold text-indigo-600 mb-2">{Math.round((score / questions.length) * 100)}%</div>
                <div className="text-sm font-medium text-slate-700">Aproveitamento</div>
              </div>
            </div>
          </div>

          {/* Question Review */}
          <Card className="border border-slate-200 mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-900">
                Revisão das Questões
              </CardTitle>
              <p className="text-slate-600">Clique em uma questão para ver os detalhes</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 sm:gap-3 mb-6">
                {results.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedQuestionReview(selectedQuestionReview === index ? null : index)}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                      result.isCorrect 
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-300 hover:bg-emerald-200" 
                        : "bg-red-100 text-red-700 border border-red-300 hover:bg-red-200"
                    } ${selectedQuestionReview === index ? "ring-2 ring-indigo-500" : ""}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              {/* Question Detail */}
              {selectedQuestionReview !== null && (
                <div className="border-t border-slate-100 pt-6">
                  <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-100">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge className="px-3 py-1 bg-slate-100 text-slate-700 border-0">
                        {questions[selectedQuestionReview].year}
                      </Badge>
                      <Badge className="px-3 py-1 bg-indigo-100 text-indigo-700 border-0">
                        {questions[selectedQuestionReview].discipline}
                      </Badge>
                      {results[selectedQuestionReview].isCorrect ? (
                        <CheckCircle className="h-6 w-6 text-emerald-600" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-600" />
                      )}
                    </div>
                    
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">
                      {questions[selectedQuestionReview].title}
                    </h3>
                    
                    <div className="prose max-w-none mb-6">
                      <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                        {questions[selectedQuestionReview].context}
                      </p>
                    </div>

                    <div className="font-semibold text-slate-900 mb-4">
                      {questions[selectedQuestionReview].alternativesIntroduction}
                    </div>

                    <div className="space-y-3">
                      {questions[selectedQuestionReview].alternatives.map((alt) => (
                        <div
                          key={alt.letter}
                          className={`flex items-start space-x-4 p-4 rounded-xl border transition-all ${
                            alt.isCorrect
                              ? "border-emerald-500 bg-emerald-50"
                              : results[selectedQuestionReview].selectedAnswer === alt.letter && !alt.isCorrect
                              ? "border-red-500 bg-red-50"
                              : "border-slate-200 bg-white"
                          }`}
                        >
                          <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 mt-1 flex items-center justify-center ${
                            alt.isCorrect
                              ? "border-emerald-500 bg-emerald-500"
                              : results[selectedQuestionReview].selectedAnswer === alt.letter && !alt.isCorrect
                              ? "border-red-500 bg-red-500"
                              : "border-slate-300"
                          }`}>
                            {(alt.isCorrect || (results[selectedQuestionReview].selectedAnswer === alt.letter && !alt.isCorrect)) && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                          <div className="flex-1">
                            <span className={`inline-block font-semibold mr-3 ${
                              alt.isCorrect
                                ? "text-emerald-700"
                                : results[selectedQuestionReview].selectedAnswer === alt.letter && !alt.isCorrect
                                ? "text-red-700"
                                : "text-slate-600"
                            }`}>
                              ({alt.letter})
                            </span>
                            <span className={`text-base leading-relaxed ${
                              alt.isCorrect
                                ? "text-emerald-900"
                                : results[selectedQuestionReview].selectedAnswer === alt.letter && !alt.isCorrect
                                ? "text-red-900"
                                : "text-slate-700"
                            }`}>
                              {alt.text}
                            </span>
                            {alt.isCorrect && (
                              <span className="block text-sm text-emerald-600 font-medium mt-1">
                                ✓ Resposta correta
                              </span>
                            )}
                            {results[selectedQuestionReview].selectedAnswer === alt.letter && !alt.isCorrect && (
                              <span className="block text-sm text-red-600 font-medium mt-1">
                                ✗ Sua resposta
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="text-center">
            <Link href="/">
              <Button className="bg-rose-500 hover:bg-rose-600 border-0 h-14 px-8 text-lg font-semibold rounded-2xl">
                Fazer Novo Simulado
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <Image src="/image.png" alt="ENEM Logo" width={36} height={36} className="rounded-lg" />
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-semibold text-slate-900">Simulado ENEM</h1>
                <p className="text-xs sm:text-sm text-slate-600">Questão {currentQuestion + 1} de {questions.length}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
                <Clock className="h-5 w-5 text-violet-500" />
                <span className="font-mono text-base sm:text-lg text-slate-900">{formatTime(timeRemaining)}</span>
              </div>
              <Button 
                onClick={finishQuiz} 
                variant="outline" 
                className="border-slate-200 hover:bg-slate-50 text-xs sm:text-sm px-2 sm:px-4"
              >
                <Flag className="h-4 w-4 mr-2" />
                Finalizar
              </Button>
            </div>
          </div>
          
          <Progress 
            value={((currentQuestion + 1) / questions.length) * 100} 
            className="mt-4 h-2"
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="grid lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Question Navigation */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Card className="sticky top-6 border border-slate-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold text-slate-900">Navegação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-2 sm:gap-3">
                  {questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToQuestion(index)}
                      className={`
                        w-8 h-8 sm:w-10 sm:h-10 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200
                        ${currentQuestion === index 
                          ? "bg-rose-500 text-white" 
                          : selectedAnswers[index]
                          ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }
                      `}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                
                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-rose-500 rounded-lg"></div>
                    <span className="text-slate-700">Atual</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-emerald-100 border border-emerald-300 rounded-lg"></div>
                    <span className="text-slate-700">Respondida</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-slate-100 rounded-lg"></div>
                    <span className="text-slate-700">Não respondida</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Question */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <Card className="border border-slate-200">
              <CardHeader className="pb-4 sm:pb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="px-3 py-1 bg-slate-100 text-slate-700 border-0">{currentQ.year}</Badge>
                  <Badge className="px-3 py-1 bg-rose-100 text-rose-700 border-0">{currentQ.discipline}</Badge>
                </div>
                <CardTitle className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-900">{currentQ.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4 sm:space-y-6 lg:space-y-8">
                {/* Question Context */}
                <div className="prose max-w-none">
                  <p className="text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed whitespace-pre-line">
                    {currentQ.context}
                  </p>
                </div>

                {/* Alternatives Introduction */}
                <div className="font-semibold text-slate-900 text-base sm:text-lg">
                  {currentQ.alternativesIntroduction}
                </div>

                {/* Alternatives */}
                <div className="space-y-2 sm:space-y-3">
                  {currentQ.alternatives.map((alt) => (
                    <button
                      key={alt.letter}
                      onClick={() => selectAnswer(currentQuestion, alt.letter)}
                      className={`w-full flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 lg:p-5 rounded-xl border transition-all duration-200 text-left ${
                        selectedAnswers[currentQuestion] === alt.letter
                          ? "border-rose-500 bg-rose-50 shadow-md"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 mt-1 flex items-center justify-center ${
                        selectedAnswers[currentQuestion] === alt.letter
                          ? "border-rose-500 bg-rose-500"
                          : "border-slate-300"
                      }`}>
                        {selectedAnswers[currentQuestion] === alt.letter && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <div className="flex-1">
                        <span className={`inline-block font-semibold mr-3 ${
                          selectedAnswers[currentQuestion] === alt.letter
                            ? "text-rose-700"
                            : "text-slate-600"
                        }`}>
                          ({alt.letter})
                        </span>
                        <span className={`text-sm sm:text-base leading-relaxed ${
                          selectedAnswers[currentQuestion] === alt.letter
                            ? "text-rose-900"
                            : "text-slate-700"
                        }`}>
                          {alt.text}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4 sm:pt-6 lg:pt-8 border-t border-slate-100 flex-wrap gap-4">
                  <Button 
                    onClick={previousQuestion}
                    disabled={currentQuestion === 0}
                    variant="outline"
                    className="border-slate-200 hover:bg-slate-50 text-sm sm:text-base px-3 sm:px-4"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Anterior
                  </Button>
                  
                  {currentQuestion === questions.length - 1 ? (
                    <Button 
                      onClick={finishQuiz} 
                      className="bg-emerald-500 hover:bg-emerald-600 border-0 text-sm sm:text-base px-3 sm:px-4"
                    >
                      <Flag className="h-4 w-4 mr-2" />
                      Finalizar Simulado
                    </Button>
                  ) : (
                    <Button 
                      onClick={nextQuestion}
                      className="bg-rose-500 hover:bg-rose-600 border-0 text-sm sm:text-base px-3 sm:px-4"
                    >
                      Próxima
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}