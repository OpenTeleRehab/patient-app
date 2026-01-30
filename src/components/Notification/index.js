import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Icon} from 'react-native-elements';
import ProgressBar from './ProgressBar';
import {theme} from '../../../App';
import {useSelector} from 'react-redux';
import {ROUTES} from '../../variables/constants';
import {useNavigation} from '@react-navigation/native';

export default function Notification(patientDetail) {

  const navigation = useNavigation();
  const {chatRooms} = useSelector((state) => state.rocketchat);
  const room = chatRooms?.find(r => r?.rid?.includes(patientDetail?.chat_user_id));
  const percent = patientDetail?.percent;
  const painThreshold = patientDetail?.total_pain_threshold;
  const unread = room ? room?.unread : 0;
  const appointmentCount = patientDetail?.invited_appointment_count + patientDetail?.unread_appointment_count;
  const chatText = unread > 99 ? '99+' : String(unread);

  return (
    <View>
      <View style={styles.iconsRow}>
        {percent>0&&
          <ProgressBar percent={percent} width={120} />
        }
        {painThreshold > 0 && (
          <View style={styles.iconItem}>
            <Icon
              name="alert-triangle"
              type="feather"
              size={20}
              color={theme.colors.orangeDark}
            />
            <Badge value={painThreshold} />
          </View>
        )}
        {unread > 0 && (
          <TouchableOpacity
            style={styles.iconItem}
            onPress={()=>{navigation.navigate(ROUTES.CHAT_ROOM_LIST)}}
            activeOpacity={0.7}
          >
            <Icon
              name="comment-dots"
              type="font-awesome-5"
              size={20}
              color={theme.colors.primary}
            />
            <Badge value={chatText} />
          </TouchableOpacity>
         )}
        {appointmentCount > 0 && (
          <TouchableOpacity
            style={styles.iconItem}
            onPress={() => navigation.navigate(ROUTES.PHC_APPOINTMENT)}
            activeOpacity={0.7}
          >
            <Icon
              name="calendar-alt"
              type="font-awesome-5"
              size={20}
              color={theme.colors.primary}
            />
            <Badge value={appointmentCount} />
          </TouchableOpacity>
         )}
      </View>
    </View>
  );
}

function Badge({value}) {
  if (value === 0 || value === null || value === undefined) return null;

  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{String(value)}</Text>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderRadius: 10,
    backgroundColor: '#fff',
  },



  iconsRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  iconItem: {
    position: 'relative',
    padding: 6,
    borderRadius: 999,
  },

  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});
