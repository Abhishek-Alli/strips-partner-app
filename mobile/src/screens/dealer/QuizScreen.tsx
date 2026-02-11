/**
 * Quiz Screen
 *
 * Grid of question sets, quiz taking with radio buttons, and results with score gauge
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDrawer } from '../../contexts/DrawerContext';
import { MaterialIcons } from '@expo/vector-icons';

interface QuizSet {
  id: string;
  title: string;
  description: string;
  questionsCount: number;
  timeMinutes: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  attempts: number;
  bestScore: number | null;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

const quizSets: QuizSet[] = [
  { id: '1', title: 'Steel Grades Basics', description: 'Test your knowledge about different steel grades and their applications', questionsCount: 10, timeMinutes: 15, difficulty: 'easy', category: 'Steel', attempts: 3, bestScore: 80 },
  { id: '2', title: 'Cement Types & Uses', description: 'Understanding different cement types and their construction uses', questionsCount: 8, timeMinutes: 12, difficulty: 'easy', category: 'Cement', attempts: 1, bestScore: 60 },
  { id: '3', title: 'Construction Safety', description: 'Essential safety knowledge for construction sites', questionsCount: 15, timeMinutes: 20, difficulty: 'medium', category: 'Safety', attempts: 0, bestScore: null },
  { id: '4', title: 'IS Standards', description: 'Indian Standards for construction materials', questionsCount: 12, timeMinutes: 18, difficulty: 'hard', category: 'Standards', attempts: 2, bestScore: 45 },
  { id: '5', title: 'Building Materials', description: 'General knowledge about various building materials', questionsCount: 10, timeMinutes: 15, difficulty: 'medium', category: 'Materials', attempts: 0, bestScore: null },
  { id: '6', title: 'Dealer Business', description: 'Business management for construction material dealers', questionsCount: 8, timeMinutes: 10, difficulty: 'easy', category: 'Business', attempts: 0, bestScore: null },
];

const sampleQuestions: Question[] = [
  { id: '1', question: 'What is the full form of TMT in steel?', options: ['Thermo Mechanically Treated', 'Temperature Modified Treatment', 'Thermal Mechanical Testing', 'Tensile Metal Treatment'], correctAnswer: 0 },
  { id: '2', question: 'Which grade of TMT bar is most commonly used in residential construction?', options: ['Fe 415', 'Fe 500', 'Fe 550', 'Fe 600'], correctAnswer: 1 },
  { id: '3', question: 'What does BIS stand for?', options: ['Bureau of International Standards', 'Bureau of Indian Standards', 'Board of Industrial Standards', 'Bureau of Industrial Safety'], correctAnswer: 1 },
  { id: '4', question: 'Which type of cement is best for underwater construction?', options: ['OPC', 'PPC', 'Sulfate Resistant Cement', 'White Cement'], correctAnswer: 2 },
  { id: '5', question: 'What is the standard curing period for concrete?', options: ['7 days', '14 days', '21 days', '28 days'], correctAnswer: 3 },
];

const QuizScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [activeQuiz, setActiveQuiz] = useState<QuizSet | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const { openDrawer: handleOpenDrawer } = useDrawer();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      default: return '#FF5722';
    }
  };

  const startQuiz = (quiz: QuizSet) => {
    setActiveQuiz(quiz);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setQuizStarted(true);
  };

  const selectAnswer = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [questionIndex]: answerIndex }));
  };

  const goToNextQuestion = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitQuiz = () => {
    setShowResults(true);
  };

  const getScore = () => {
    let correct = 0;
    sampleQuestions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) correct++;
    });
    return correct;
  };

  const getScorePercentage = () => {
    return Math.round((getScore() / sampleQuestions.length) * 100);
  };

  const closeQuiz = () => {
    setActiveQuiz(null);
    setQuizStarted(false);
    setShowResults(false);
  };

  const getScoreColor = (pct: number) => {
    if (pct >= 80) return '#4CAF50';
    if (pct >= 50) return '#FF9800';
    return '#FF5722';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quiz</Text>
        <TouchableOpacity style={styles.menuButton} onPress={handleOpenDrawer}>
          <MaterialIcons name="menu" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Quiz Sets Grid */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {quizSets.map(quiz => (
            <TouchableOpacity
              key={quiz.id}
              style={styles.quizCard}
              onPress={() => startQuiz(quiz)}
            >
              <View style={styles.quizCardTop}>
                <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(quiz.difficulty) + '15' }]}>
                  <Text style={[styles.difficultyText, { color: getDifficultyColor(quiz.difficulty) }]}>
                    {quiz.difficulty.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.categoryTag}>{quiz.category}</Text>
              </View>

              <Text style={styles.quizTitle}>{quiz.title}</Text>
              <Text style={styles.quizDesc} numberOfLines={2}>{quiz.description}</Text>

              <View style={styles.quizMeta}>
                <View style={styles.metaItem}>
                  <MaterialIcons name="help" size={14} color="#666" />
                  <Text style={styles.metaText}>{quiz.questionsCount} Qs</Text>
                </View>
                <View style={styles.metaItem}>
                  <MaterialIcons name="schedule" size={14} color="#666" />
                  <Text style={styles.metaText}>{quiz.timeMinutes} min</Text>
                </View>
              </View>

              {quiz.bestScore !== null && (
                <View style={styles.scoreRow}>
                  <Text style={styles.scoreLabel}>Best: </Text>
                  <Text style={[styles.scoreValue, { color: getScoreColor(quiz.bestScore) }]}>
                    {quiz.bestScore}%
                  </Text>
                </View>
              )}

              <TouchableOpacity style={styles.startButton} onPress={() => startQuiz(quiz)}>
                <Text style={styles.startButtonText}>
                  {quiz.attempts > 0 ? 'Retake' : 'Start'}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Quiz Modal */}
      <Modal
        visible={quizStarted}
        animationType="slide"
        onRequestClose={closeQuiz}
      >
        <SafeAreaView style={styles.quizModalContainer}>
          {!showResults ? (
            <>
              {/* Quiz Header */}
              <View style={styles.quizHeader}>
                <TouchableOpacity onPress={closeQuiz}>
                  <MaterialIcons name="close" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.quizHeaderTitle}>{activeQuiz?.title}</Text>
                <Text style={styles.questionCount}>
                  {currentQuestion + 1}/{sampleQuestions.length}
                </Text>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${((currentQuestion + 1) / sampleQuestions.length) * 100}%` }]} />
              </View>

              {/* Question */}
              <ScrollView style={styles.questionContainer}>
                <Text style={styles.questionText}>
                  Q{currentQuestion + 1}. {sampleQuestions[currentQuestion]?.question}
                </Text>

                {/* Options */}
                {sampleQuestions[currentQuestion]?.options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.optionItem,
                      selectedAnswers[currentQuestion] === index && styles.optionSelected,
                    ]}
                    onPress={() => selectAnswer(currentQuestion, index)}
                  >
                    <View style={[
                      styles.radioOuter,
                      selectedAnswers[currentQuestion] === index && styles.radioOuterSelected,
                    ]}>
                      {selectedAnswers[currentQuestion] === index && <View style={styles.radioInner} />}
                    </View>
                    <Text style={[
                      styles.optionText,
                      selectedAnswers[currentQuestion] === index && styles.optionTextSelected,
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Navigation */}
              <View style={styles.quizNav}>
                <TouchableOpacity
                  style={[styles.navBtn, currentQuestion === 0 && styles.navBtnDisabled]}
                  onPress={goToPrevQuestion}
                  disabled={currentQuestion === 0}
                >
                  <Text style={[styles.navBtnText, currentQuestion === 0 && styles.navBtnTextDisabled]}>Previous</Text>
                </TouchableOpacity>

                {currentQuestion < sampleQuestions.length - 1 ? (
                  <TouchableOpacity style={styles.navBtnPrimary} onPress={goToNextQuestion}>
                    <Text style={styles.navBtnPrimaryText}>Next</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.submitBtn} onPress={submitQuiz}>
                    <Text style={styles.submitBtnText}>Submit</Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          ) : (
            /* Results */
            <ScrollView contentContainerStyle={styles.resultsContainer}>
              <View style={styles.resultsHeader}>
                <TouchableOpacity onPress={closeQuiz} style={styles.closeResults}>
                  <MaterialIcons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              <View style={styles.scoreCircle}>
                <View style={[styles.scoreCircleInner, { borderColor: getScoreColor(getScorePercentage()) }]}>
                  <Text style={[styles.scorePercentage, { color: getScoreColor(getScorePercentage()) }]}>
                    {getScorePercentage()}%
                  </Text>
                  <Text style={styles.scoreSubtext}>
                    {getScore()}/{sampleQuestions.length} correct
                  </Text>
                </View>
              </View>

              <Text style={styles.resultTitle}>
                {getScorePercentage() >= 80 ? 'Excellent!' : getScorePercentage() >= 50 ? 'Good Job!' : 'Keep Learning!'}
              </Text>
              <Text style={styles.resultDesc}>
                {getScorePercentage() >= 80
                  ? 'Great performance! You have a strong understanding of the topic.'
                  : getScorePercentage() >= 50
                  ? 'Good effort! Review the incorrect answers to improve.'
                  : 'Don\'t worry! Review the material and try again.'}
              </Text>

              {/* Answer Review */}
              <View style={styles.reviewSection}>
                <Text style={styles.reviewTitle}>Answer Review</Text>
                {sampleQuestions.map((q, index) => {
                  const isCorrect = selectedAnswers[index] === q.correctAnswer;
                  return (
                    <View key={q.id} style={styles.reviewItem}>
                      <View style={styles.reviewHeader}>
                        <MaterialIcons
                          name={isCorrect ? 'check-circle' : 'cancel'}
                          size={20}
                          color={isCorrect ? '#4CAF50' : '#FF5722'}
                        />
                        <Text style={styles.reviewQuestion} numberOfLines={1}>
                          Q{index + 1}. {q.question}
                        </Text>
                      </View>
                      {!isCorrect && (
                        <Text style={styles.correctAnswer}>
                          Correct: {q.options[q.correctAnswer]}
                        </Text>
                      )}
                    </View>
                  );
                })}
              </View>

              <TouchableOpacity style={styles.retakeButton} onPress={() => activeQuiz && startQuiz(activeQuiz)}>
                <Text style={styles.retakeButtonText}>Retake Quiz</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.doneButton} onPress={closeQuiz}>
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>

              <View style={{ height: 40 }} />
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A1A' },
  menuButton: { padding: 4 },
  content: { flex: 1, padding: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  quizCard: {
    width: '47%', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  quizCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  difficultyBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  difficultyText: { fontSize: 10, fontWeight: '700' },
  categoryTag: { fontSize: 11, color: '#999' },
  quizTitle: { fontSize: 14, fontWeight: '600', color: '#1A1A1A', marginBottom: 4 },
  quizDesc: { fontSize: 11, color: '#666', lineHeight: 15, marginBottom: 8 },
  quizMeta: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 11, color: '#666' },
  scoreRow: { flexDirection: 'row', marginBottom: 8 },
  scoreLabel: { fontSize: 12, color: '#666' },
  scoreValue: { fontSize: 12, fontWeight: '700' },
  startButton: { backgroundColor: '#FF6B35', paddingVertical: 8, borderRadius: 20, alignItems: 'center' },
  startButtonText: { fontSize: 13, fontWeight: '600', color: '#FFFFFF' },

  // Quiz Modal
  quizModalContainer: { flex: 1, backgroundColor: '#FFFFFF' },
  quizHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  quizHeaderTitle: { fontSize: 16, fontWeight: '600', color: '#1A1A1A' },
  questionCount: { fontSize: 14, color: '#666', fontWeight: '500' },
  progressBar: { height: 4, backgroundColor: '#F0F0F0' },
  progressFill: { height: 4, backgroundColor: '#FF6B35' },
  questionContainer: { flex: 1, padding: 20 },
  questionText: { fontSize: 18, fontWeight: '600', color: '#1A1A1A', lineHeight: 26, marginBottom: 24 },
  optionItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16,
    backgroundColor: '#F9F9F9', borderRadius: 12, marginBottom: 12,
    borderWidth: 1, borderColor: '#F0F0F0',
  },
  optionSelected: { backgroundColor: '#FFF5F2', borderColor: '#FF6B35' },
  radioOuter: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#CCC',
    alignItems: 'center', justifyContent: 'center',
  },
  radioOuterSelected: { borderColor: '#FF6B35' },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#FF6B35' },
  optionText: { fontSize: 15, color: '#333', flex: 1 },
  optionTextSelected: { color: '#FF6B35', fontWeight: '500' },
  quizNav: {
    flexDirection: 'row', justifyContent: 'space-between', padding: 16,
    borderTopWidth: 1, borderTopColor: '#F0F0F0',
  },
  navBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 25, backgroundColor: '#F5F5F5' },
  navBtnDisabled: { opacity: 0.4 },
  navBtnText: { fontSize: 15, fontWeight: '500', color: '#333' },
  navBtnTextDisabled: { color: '#999' },
  navBtnPrimary: { paddingHorizontal: 32, paddingVertical: 12, borderRadius: 25, backgroundColor: '#FF6B35' },
  navBtnPrimaryText: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
  submitBtn: { paddingHorizontal: 32, paddingVertical: 12, borderRadius: 25, backgroundColor: '#333' },
  submitBtnText: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },

  // Results
  resultsContainer: { padding: 20, alignItems: 'center' },
  resultsHeader: { width: '100%', alignItems: 'flex-end', marginBottom: 20 },
  closeResults: { padding: 4 },
  scoreCircle: { marginBottom: 20 },
  scoreCircleInner: {
    width: 140, height: 140, borderRadius: 70, borderWidth: 6,
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAFA',
  },
  scorePercentage: { fontSize: 36, fontWeight: '700' },
  scoreSubtext: { fontSize: 13, color: '#666', marginTop: 2 },
  resultTitle: { fontSize: 24, fontWeight: '700', color: '#1A1A1A', marginBottom: 8 },
  resultDesc: { fontSize: 15, color: '#666', textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  reviewSection: { width: '100%', marginBottom: 24 },
  reviewTitle: { fontSize: 18, fontWeight: '600', color: '#1A1A1A', marginBottom: 12 },
  reviewItem: {
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F5F5F5',
  },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  reviewQuestion: { fontSize: 14, color: '#333', flex: 1 },
  correctAnswer: { fontSize: 13, color: '#4CAF50', marginTop: 4, marginLeft: 28 },
  retakeButton: {
    width: '100%', backgroundColor: '#FF6B35', paddingVertical: 14, borderRadius: 30, alignItems: 'center', marginBottom: 12,
  },
  retakeButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  doneButton: {
    width: '100%', backgroundColor: '#F5F5F5', paddingVertical: 14, borderRadius: 30, alignItems: 'center',
  },
  doneButtonText: { fontSize: 16, fontWeight: '600', color: '#333' },
});

export default QuizScreen;
