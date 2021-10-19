/*
 * Copyright (c) 2021 Web Essentials Co., Ltd
 */
import React, {useCallback, useEffect, useState} from 'react';
import styles from '../../assets/styles';
import {Alert, Image, Platform, TouchableOpacity} from 'react-native';
import Tts from 'react-native-tts';
import {useSelector} from 'react-redux';
import {getTranslate} from 'react-localize-redux';
import {TTS} from '../../variables/constants';
import ttsIcon from '../../assets/images/tts.svg';
import {SvgUri} from 'react-native-svg';

const TTSButton = ({textsToSpeech, style}) => {
  const localize = useSelector((state) => state.localize);
  const translate = getTranslate(localize);
  const {profile} = useSelector((state) => state.user);
  const {languages} = useSelector((state) => state.language);
  const [ttsIsInitialized, setTtsIsInitialized] = useState(false);
  const [ttsHasSupportedVoice, setTtsHasSupportedVoice] = useState(true);
  const [ttsHasEngine, setTtsHasEngine] = useState(true);
  const [ttsStatus, setTtsStatus] = useState('');

  useEffect(() => {
    Tts.addEventListener('tts-start', () => {
      setTtsStatus('started');
    });
    Tts.addEventListener('tts-finish', () => {
      setTtsStatus('finished');
    });
    return () => {
      Tts.stop();
      Tts.removeEventListener('tts-start', () => {});
      Tts.removeEventListener('tts-finish', () => {});
    };
  }, []);

  const initTextToSpeech = useCallback(async () => {
    setTtsIsInitialized(true);
    const engines = await Tts.engines();
    if (!engines.length) {
      setTtsHasEngine(false);
      return false;
    }
    await Tts.setDefaultRate(TTS.DEFAULT_SPEECH_RATE);
    await Tts.setDefaultPitch(TTS.DEFAULT_SPEECH_PITCH);
    await Tts.setDucking(true);
    const voices = await Tts.voices();
    const availableVoices = voices
      .filter((v) => !v.networkConnectionRequired && !v.notInstalled)
      .map((v) => {
        return {id: v.id, name: v.name, language: v.language};
      });
    const userLang = languages.filter((l) => l.id === profile.language_id);
    const supportVoice = availableVoices.filter((av) =>
      av.language.toLowerCase().includes(userLang[0].code.toLowerCase()),
    );
    if (supportVoice.length) {
      await Tts.setDefaultLanguage(supportVoice[0].language);
      await Tts.setDefaultVoice(supportVoice[0].id);
      setTtsHasSupportedVoice(true);
      return true;
    } else {
      if (voices.length) {
        await Tts.setDefaultLanguage(voices[0].language);
        await Tts.setDefaultVoice(voices[0].id);
      }
      setTtsHasSupportedVoice(false);
      return false;
    }
  }, [languages, profile]);

  useEffect(() => {
    if (textsToSpeech.leading && !ttsIsInitialized) {
      Tts.getInitStatus().then(initTextToSpeech());
    }
  }, [textsToSpeech, ttsIsInitialized, initTextToSpeech]);

  const handleReadTextToSpeech = async () => {
    // Force stop when the second tapped
    if (ttsStatus === 'started') {
      Tts.stop();
      setTtsStatus('');
      return true;
    }
    if (!ttsHasEngine && Platform.OS === 'android') {
      Alert.alert('', translate('tts_message.no_engine_installed'), [
        {
          text: translate('common.install').toString(),
          onPress: async () => {
            await Tts.requestInstallEngine();
          },
        },
      ]);
      return false;
    } else if (!ttsHasSupportedVoice && Platform.OS === 'android') {
      Alert.alert('', translate('tts_message.no_voice_supported'), [
        {
          text: translate('common.cancel').toString(),
          onPress: async () => {
            await getTextToSpeech();
          },
        },
        {
          text: translate('common.install').toString(),
          onPress: async () => {
            await Tts.requestInstallData();
          },
        },
      ]);
      return false;
    } else {
      await getTextToSpeech();
      return true;
    }
  };

  const getTextToSpeech = async () => {
    await Tts.stop();
    textsToSpeech.forEach((text) => {
      Tts.speak(text);
    });
  };

  return (
    <TouchableOpacity style={style} onPress={handleReadTextToSpeech}>
      <SvgUri
        uri={Image.resolveAssetSource(ttsIcon).uri}
        style={styles.marginTop}
      />
    </TouchableOpacity>
  );
};

export default TTSButton;
