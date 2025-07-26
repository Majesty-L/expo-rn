import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {Word} from './types';
import DataService from './services/DataService';
import AudioService from './services/AudioService';
import WordCard from './components/WordCard';
import StrokeAnimation from './components/StrokeAnimation';
import DifficultySelector from './components/DifficultySelector';

const {width, height} = Dimensions.get('window');

const LiteracyScreen: React.FC = () => {
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [showStrokeAnimation, setShowStrokeAnimation] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const dataService = DataService.getInstance();
  const audioService = AudioService.getInstance();

  useEffect(() => {
    loadWords();
  }, [difficulty]);

  useEffect(() => {
    if (words.length > 0) {
      setCurrentWord(words[currentIndex]);
    }
  }, [words, currentIndex]);

  const loadWords = async () => {
    try {
      const wordsData = await dataService.getWordsByDifficulty(difficulty);
      setWords(wordsData);
      setCurrentIndex(0);
      setScore(0);
      setTotalQuestions(0);
    } catch (error) {
      console.error('Error loading words:', error);
      Alert.alert('错误', '加载词汇失败，请重试');
    }
  };

  const speakCurrentWord = async () => {
    if (currentWord) {
      await audioService.speakText(currentWord.character);
    }
  };

  const speakPinyin = async () => {
    if (currentWord) {
      await audioService.speakPinyin(currentWord.pinyin);
    }
  };

  const speakMeaning = async () => {
    if (currentWord) {
      await audioService.speakMeaning(currentWord.meaning);
    }
  };

  const showStrokeOrder = () => {
    setShowStrokeAnimation(true);
    audioService.speakInstruction('请看笔画顺序');
  };

  const nextWord = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // End of lesson
      Alert.alert(
        '学习完成',
        `恭喜完成学习！\n正确率：${totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0}%`,
        [
          {text: '重新开始', onPress: () => setCurrentIndex(0)},
          {text: '选择难度', onPress: () => {}},
        ]
      );
    }
  };

  const handleAnswer = async (correct: boolean) => {
    setTotalQuestions(prev => prev + 1);
    if (correct) {
      setScore(prev => prev + 1);
      await audioService.speakInstruction('回答正确！');
    } else {
      await audioService.speakInstruction('再试一次');
    }

    // Update progress
    if (currentWord) {
      await dataService.updateMasteryLevel('user1', currentWord.id, correct);
    }

    if (correct) {
      setTimeout(nextWord, 1500);
    }
  };

  const onDifficultyChange = (newDifficulty: 1 | 2 | 3 | 4 | 5) => {
    setDifficulty(newDifficulty);
  };

  if (!currentWord) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>加载中...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with difficulty selector */}
        <View style={styles.header}>
          <DifficultySelector
            currentDifficulty={difficulty}
            onDifficultyChange={onDifficultyChange}
          />
          <Text style={styles.progressText}>
            {currentIndex + 1} / {words.length}
          </Text>
        </View>

        {/* Main word display */}
        <WordCard
          word={currentWord}
          onSpeakWord={speakCurrentWord}
          onSpeakPinyin={speakPinyin}
          onSpeakMeaning={speakMeaning}
          onShowStrokes={showStrokeOrder}
        />

        {/* Control buttons */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={[styles.controlButton, styles.speakButton]}
            onPress={speakCurrentWord}>
            <Icon name="volume-up" size={40} color="white" />
            <Text style={styles.buttonText}>朗读</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.pinyinButton]}
            onPress={speakPinyin}>
            <Icon name="text-fields" size={40} color="white" />
            <Text style={styles.buttonText}>拼音</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.strokeButton]}
            onPress={showStrokeOrder}>
            <Icon name="edit" size={40} color="white" />
            <Text style={styles.buttonText}>笔画</Text>
          </TouchableOpacity>
        </View>

        {/* Answer buttons */}
        <View style={styles.answerContainer}>
          <TouchableOpacity
            style={[styles.answerButton, styles.correctButton]}
            onPress={() => handleAnswer(true)}>
            <Icon name="check" size={50} color="white" />
            <Text style={styles.answerButtonText}>认识</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.answerButton, styles.incorrectButton]}
            onPress={() => handleAnswer(false)}>
            <Icon name="close" size={50} color="white" />
            <Text style={styles.answerButtonText}>不认识</Text>
          </TouchableOpacity>
        </View>

        {/* Score display */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>
            正确率: {totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0}%
          </Text>
        </View>
      </ScrollView>

      {/* Stroke animation modal */}
      {showStrokeAnimation && currentWord && (
        <StrokeAnimation
          word={currentWord}
          visible={showStrokeAnimation}
          onClose={() => setShowStrokeAnimation(false)}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
  },
  loadingText: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 30,
  },
  controlButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    elevation: 3,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  speakButton: {
    backgroundColor: '#4CAF50',
  },
  pinyinButton: {
    backgroundColor: '#FF9800',
  },
  strokeButton: {
    backgroundColor: '#9C27B0',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  answerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 30,
  },
  answerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.35,
    height: 100,
    borderRadius: 15,
    elevation: 5,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  correctButton: {
    backgroundColor: '#4CAF50',
  },
  incorrectButton: {
    backgroundColor: '#F44336',
  },
  answerButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  scoreContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
});

export default LiteracyScreen;
