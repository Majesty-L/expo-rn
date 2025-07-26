import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface DifficultySelectorProps {
  currentDifficulty: 1 | 2 | 3 | 4 | 5;
  onDifficultyChange: (difficulty: 1 | 2 | 3 | 4 | 5) => void;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  currentDifficulty,
  onDifficultyChange,
}) => {
  const difficultyLabels = {
    1: '入门',
    2: '初级',
    3: '中级',
    4: '高级',
    5: '专家',
  };

  const difficultyColors = {
    1: '#4CAF50',
    2: '#8BC34A',
    3: '#FF9800',
    4: '#FF5722',
    5: '#9C27B0',
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>难度选择:</Text>
      <View style={styles.buttonContainer}>
        {([1, 2, 3, 4, 5] as const).map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.difficultyButton,
              {
                backgroundColor: currentDifficulty === level 
                  ? difficultyColors[level] 
                  : '#E0E0E0'
              }
            ]}
            onPress={() => onDifficultyChange(level)}>
            <Text style={[
              styles.difficultyText,
              {
                color: currentDifficulty === level ? 'white' : '#666'
              }
            ]}>
              {level}
            </Text>
            <Text style={[
              styles.difficultyLabel,
              {
                color: currentDifficulty === level ? 'white' : '#666'
              }
            ]}>
              {difficultyLabels[level]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  difficultyButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    elevation: 2,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  difficultyText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  difficultyLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
});

export default DifficultySelector;
