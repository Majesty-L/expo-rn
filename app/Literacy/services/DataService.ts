import AsyncStorage from '@react-native-async-storage/async-storage';
import {Word, LearningProgress, UserSettings, LessonData} from '../types';

// Sample vocabulary data for different difficulty levels
const sampleWords: Word[] = [
  // Level 1 - Basic characters
  {
    id: '1',
    character: '人',
    pinyin: 'rén',
    meaning: '人类，人员',
    difficulty: 1,
    strokes: ['丿', '乀'],
    imageUrl: 'person.jpg',
  },
  {
    id: '2',
    character: '大',
    pinyin: 'dà',
    meaning: '大的，巨大',
    difficulty: 1,
    strokes: ['一', '丿', '乀'],
    imageUrl: 'big.jpg',
  },
  {
    id: '3',
    character: '小',
    pinyin: 'xiǎo',
    meaning: '小的，微小',
    difficulty: 1,
    strokes: ['丨', '八', '丶'],
    imageUrl: 'small.jpg',
  },
  // Level 2 - Common daily words
  {
    id: '4',
    character: '家',
    pinyin: 'jiā',
    meaning: '家庭，家里',
    difficulty: 2,
    strokes: ['宀', '豕'],
    imageUrl: 'home.jpg',
  },
  {
    id: '5',
    character: '水',
    pinyin: 'shuǐ',
    meaning: '水，液体',
    difficulty: 2,
    strokes: ['丨', '乀', '丿', '乀'],
    imageUrl: 'water.jpg',
  },
  // Level 3 - More complex characters
  {
    id: '6',
    character: '学习',
    pinyin: 'xué xí',
    meaning: '学习，学会',
    difficulty: 3,
    strokes: [],
    imageUrl: 'study.jpg',
  },
];

const sampleLessons: LessonData[] = [
  {
    id: 'lesson1',
    title: '基础汉字',
    words: sampleWords.slice(0, 3),
    difficulty: 1,
    category: '基础',
  },
  {
    id: 'lesson2',
    title: '日常用字',
    words: sampleWords.slice(3, 5),
    difficulty: 2,
    category: '日常',
  },
  {
    id: 'lesson3',
    title: '学习词汇',
    words: sampleWords.slice(5),
    difficulty: 3,
    category: '学习',
  },
];

class DataService {
  private static instance: DataService;
  
  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  // Word management
  async getWordsByDifficulty(difficulty: number): Promise<Word[]> {
    return sampleWords.filter(word => word.difficulty === difficulty);
  }

  async getAllWords(): Promise<Word[]> {
    return sampleWords;
  }

  async getWordById(id: string): Promise<Word | null> {
    return sampleWords.find(word => word.id === id) || null;
  }

  // Lesson management
  async getLessons(): Promise<LessonData[]> {
    return sampleLessons;
  }

  async getLessonById(id: string): Promise<LessonData | null> {
    return sampleLessons.find(lesson => lesson.id === id) || null;
  }

  // Progress management
  async saveProgress(progress: LearningProgress): Promise<void> {
    try {
      const key = `progress_${progress.userId}_${progress.wordId}`;
      await AsyncStorage.setItem(key, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }

  async getProgress(userId: string, wordId: string): Promise<LearningProgress | null> {
    try {
      const key = `progress_${userId}_${wordId}`;
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting progress:', error);
      return null;
    }
  }

  async getAllProgress(userId: string): Promise<LearningProgress[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const progressKeys = keys.filter(key => key.startsWith(`progress_${userId}_`));
      const progressData = await AsyncStorage.multiGet(progressKeys);
      
      return progressData
        .map(([_, value]) => value ? JSON.parse(value) : null)
        .filter(Boolean);
    } catch (error) {
      console.error('Error getting all progress:', error);
      return [];
    }
  }

  // Settings management
  async saveSettings(settings: UserSettings): Promise<void> {
    try {
      await AsyncStorage.setItem('userSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  async getSettings(): Promise<UserSettings> {
    try {
      const data = await AsyncStorage.getItem('userSettings');
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error getting settings:', error);
    }
    
    // Return default settings
    return {
      fontSize: 'large',
      voiceEnabled: true,
      difficulty: 1,
      dailyGoal: 10,
    };
  }

  // Recommendation system
  async getRecommendedWords(userId: string, count: number = 5): Promise<Word[]> {
    const allProgress = await this.getAllProgress(userId);
    const settings = await this.getSettings();
    
    // Get words that need more practice (low mastery level)
    const wordsNeedingPractice = allProgress
      .filter(p => p.masteryLevel < 80)
      .sort((a, b) => a.masteryLevel - b.masteryLevel)
      .slice(0, count);

    const recommendedWordIds = wordsNeedingPractice.map(p => p.wordId);
    
    // If we don't have enough words needing practice, add new words
    if (recommendedWordIds.length < count) {
      const studiedWordIds = allProgress.map(p => p.wordId);
      const newWords = sampleWords
        .filter(w => !studiedWordIds.includes(w.id) && w.difficulty <= settings.difficulty)
        .slice(0, count - recommendedWordIds.length);
      
      recommendedWordIds.push(...newWords.map(w => w.id));
    }

    return sampleWords.filter(w => recommendedWordIds.includes(w.id));
  }

  // Update mastery level based on performance
  async updateMasteryLevel(userId: string, wordId: string, correct: boolean): Promise<void> {
    let progress = await this.getProgress(userId, wordId);
    
    if (!progress) {
      progress = {
        userId,
        wordId,
        correctCount: 0,
        totalAttempts: 0,
        lastStudied: new Date(),
        masteryLevel: 0,
      };
    }

    progress.totalAttempts++;
    if (correct) {
      progress.correctCount++;
    }
    progress.lastStudied = new Date();

    // Calculate mastery level (0-100)
    const accuracy = progress.correctCount / progress.totalAttempts;
    progress.masteryLevel = Math.min(100, Math.floor(accuracy * 100));

    await this.saveProgress(progress);
  }
}

export default DataService;
