import RNFS from 'react-native-fs';
import settings from '../../config/settings';

export const getCachedImage = async (file) => {
  if (!file?.id) return null;

  const localPath = `${RNFS.DocumentDirectoryPath}/${file.id}.jpg`;

  const exists = await RNFS.exists(localPath);
  if (exists) return 'file://' + localPath;

  try {
    await RNFS.downloadFile({
      fromUrl: `${settings.adminApiBaseURL}/file/${file.id}`,
      toFile: localPath,
    }).promise;

    return 'file://' + localPath;
  } catch (err) {
    return `${settings.adminApiBaseURL}/file/${file.id}`;
  }
};
