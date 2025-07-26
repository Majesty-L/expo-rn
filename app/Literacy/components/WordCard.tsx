import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Word} from '../types';

const {width} = Dimensions.get('window');

interface WordCardProps {
  word: Word;
  onSpeakWord: () => void;
  onSpeakPinyin: () => void;
  onSpeakMeaning: () => void;
  onShowStrokes: () => void;
}

const WordCard: React.FC<WordCardProps> = ({
  word,
  onSpeakWord,
  onSpeakPinyin,
  onSpeakMeaning,
  onShowStrokes,
}) => {
  if (!word) return <Text>暂无词语</Text>;
  return (
    <View style={styles.container}>
      {/* Main character display */}
      <TouchableOpacity style={styles.characterContainer} onPress={onSpeakWord}>
        <Text style={styles.character}>{word?.character}</Text>
        <Icon name="volume-up" size={30} color="#2196F3" style={styles.speakIcon} />
      </TouchableOpacity>

      {/* Pinyin display */}
      <TouchableOpacity style={styles.pinyinContainer} onPress={onSpeakPinyin}>
        <Text style={styles.pinyin}>{word.pinyin}</Text>
        <Icon name="hearing" size={20} color="#FF9800" style={styles.pinyinIcon} />
      </TouchableOpacity>

      {/* Meaning display */}
      <TouchableOpacity style={styles.meaningContainer} onPress={onSpeakMeaning}>
        <Text style={styles.meaning}>{word.meaning}</Text>
        <Icon name="translate" size={20} color="#4CAF50" style={styles.meaningIcon} />
      </TouchableOpacity>

      {/* Difficulty indicator */}
      <View style={styles.difficultyContainer}>
        <Text style={styles.difficultyLabel}>难度:</Text>
        {Array.from({length: 5}, (_, index) => (
          <Icon
            key={index}
            name="star"
            size={20}
            color={index < word.difficulty ? '#FFD700' : '#E0E0E0'}
          />
        ))}
      </View>

      {/* Stroke count */}
      {word.strokes && word.strokes.length > 0 && (
        <TouchableOpacity style={styles.strokeContainer} onPress={onShowStrokes}>
          <Icon name="edit" size={20} color="#9C27B0" />
          <Text style={styles.strokeText}>
            笔画数: {word.strokes.length}
          </Text>
          <Text style={styles.strokeHint}>点击查看笔顺</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    margin: 10,
    alignItems: 'center',
    elevation: 5,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    minHeight: 300,
  },
  characterContainer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    minWidth: width * 0.6,
    position: 'relative',
  },
  character: {
    fontSize: 120,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  speakIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  pinyinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fff3e0',
    borderRadius: 10,
    minWidth: width * 0.5,
    justifyContent: 'center',
  },
  pinyin: {
    fontSize: 28,
    color: '#e65100',
    fontWeight: '600',
    marginRight: 10,
  },
  pinyinIcon: {
    marginLeft: 5,
  },
  meaningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#e8f5e8',
    borderRadius: 10,
    minWidth: width * 0.5,
    justifyContent: 'center',
  },
  meaning: {
    fontSize: 20,
    color: '#2e7d32',
    fontWeight: '500',
    marginRight: 10,
    textAlign: 'center',
  },
  meaningIcon: {
    marginLeft: 5,
  },
  difficultyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  difficultyLabel: {
    fontSize: 16,
    color: '#666',
    marginRight: 10,
    fontWeight: '500',
  },
  strokeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f3e5f5',
    borderRadius: 10,
    marginTop: 10,
  },
  strokeText: {
    fontSize: 16,
    color: '#7b1fa2',
    marginLeft: 8,
    marginRight: 10,
    fontWeight: '500',
  },
  strokeHint: {
    fontSize: 12,
    color: '#9c27b0',
    fontStyle: 'italic',
  },
});

export default WordCard;
