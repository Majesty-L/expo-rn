import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Word} from '../types';

const {width, height} = Dimensions.get('window');

interface StrokeAnimationProps {
  word: Word;
  visible: boolean;
  onClose: () => void;
}

const StrokeAnimation: React.FC<StrokeAnimationProps> = ({
  word,
  visible,
  onClose,
}) => {
  const [currentStroke, setCurrentStroke] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [strokeOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      setCurrentStroke(0);
      setIsPlaying(false);
    }
  }, [visible]);

  const playAnimation = () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    setCurrentStroke(0);
    
    const animateStroke = (index: number) => {
      if (index >= word.strokes.length) {
        setIsPlaying(false);
        return;
      }

      setCurrentStroke(index);
      
      Animated.sequence([
        Animated.timing(strokeOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(strokeOpacity, {
          toValue: 0.3,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(() => animateStroke(index + 1), 500);
      });
    };

    animateStroke(0);
  };

  const resetAnimation = () => {
    setCurrentStroke(0);
    setIsPlaying(false);
    strokeOpacity.setValue(0);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>笔画顺序</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={30} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Character display */}
          <View style={styles.characterContainer}>
            <Text style={styles.character}>{word?.character}</Text>
            <Text style={styles.pinyin}>{word.pinyin}</Text>
          </View>

          {/* Stroke information */}
          <View style={styles.strokeInfo}>
            <Text style={styles.strokeCount}>
              总笔画数: {word.strokes.length}
            </Text>
            <Text style={styles.currentStroke}>
              当前笔画: {currentStroke + 1} / {word.strokes.length}
            </Text>
          </View>

          {/* Animation area */}
          <View style={styles.animationArea}>
            <View style={styles.strokeDisplay}>
              {word.strokes.map((stroke, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.strokeElement,
                    {
                      opacity: index <= currentStroke ? 1 : 0.1,
                      backgroundColor: index === currentStroke ? '#FF5722' : '#2196F3',
                    },
                  ]}>
                  <Text style={styles.strokeText}>{stroke}</Text>
                </Animated.View>
              ))}
            </View>
          </View>

          {/* Control buttons */}
          <View style={styles.controls}>
            <TouchableOpacity
              style={[styles.controlButton, styles.playButton]}
              onPress={playAnimation}
              disabled={isPlaying}>
              <Icon name="play-arrow" size={30} color="white" />
              <Text style={styles.controlButtonText}>
                {isPlaying ? '播放中...' : '播放动画'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, styles.resetButton]}
              onPress={resetAnimation}>
              <Icon name="refresh" size={30} color="white" />
              <Text style={styles.controlButtonText}>重新开始</Text>
            </TouchableOpacity>
          </View>

          {/* Stroke order tips */}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>笔画规则:</Text>
            <Text style={styles.tipText}>• 从上到下，从左到右</Text>
            <Text style={styles.tipText}>• 先横后竖，先撇后捺</Text>
            <Text style={styles.tipText}>• 先外后内，最后封口</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: width * 0.9,
    maxHeight: height * 0.8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  characterContainer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
  },
  character: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  pinyin: {
    fontSize: 20,
    color: '#e65100',
    marginTop: 10,
  },
  strokeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  strokeCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
  },
  currentStroke: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF5722',
  },
  animationArea: {
    minHeight: 120,
    backgroundColor: '#fafafa',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  strokeDisplay: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  strokeElement: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  strokeText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 120,
  },
  playButton: {
    backgroundColor: '#4CAF50',
  },
  resetButton: {
    backgroundColor: '#FF9800',
  },
  controlButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  tipsContainer: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 10,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#1976d2',
    marginBottom: 4,
  },
});
export default StrokeAnimation;

