import * as Speech from 'expo-speech';

class AudioService {
  private static instance: AudioService;

  // private constructor() {}

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  async speakText(text: string): Promise<void> {
    try {
      Speech.speak(text, {
        language: 'zh-CN',
        rate: 0.5,
        pitch: 1.0,
      });
    } catch (error) {
      console.error('TTS Error:', error);
    }
  }

  async speakPinyin(pinyin: string): Promise<void> {
    try {
      Speech.speak(`拼音：${pinyin}`, {
        language: 'zh-CN',
        rate: 0.5,
        pitch: 1.0,
      });
    } catch (error) {
      console.error('TTS Pinyin Error:', error);
    }
  }

  async speakMeaning(meaning: string): Promise<void> {
    try {
      Speech.speak(`意思是：${meaning}`, {
        language: 'zh-CN',
        rate: 0.5,
        pitch: 1.0,
      });
    } catch (error) {
      console.error('TTS Meaning Error:', error);
    }
  }

  stopSpeaking(): void {
    Speech.stop();
  }

  async speakInstruction(instruction: string): Promise<void> {
    try {
      Speech.speak(instruction, {
        language: 'zh-CN',
        rate: 0.5,
        pitch: 1.0,
      });
    } catch (error) {
      console.error('TTS Instruction Error:', error);
    }
  }
}

export default AudioService;
