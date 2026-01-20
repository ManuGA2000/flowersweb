// Date Picker Component - Required Delivery Date
// src/components/DatePicker.js
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SIZES } from '../utils/theme';

// Helper functions defined BEFORE the component
const formatDate = (date) => {
  if (!date) return '';
  const options = { weekday: 'short', day: 'numeric', month: 'short' };
  return date.toLocaleDateString('en-IN', options);
};

const formatFullDate = (date) => {
  if (!date) return '';
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('en-IN', options);
};

const formatDayName = (date) => {
  const options = { weekday: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-IN', options);
};

const DatePicker = ({
  selectedDate,
  onSelectDate,
  minDays = 1,
  maxDays = 30,
  label = 'Required Delivery Date',
  quickOptions = true,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate quick date options
  const quickDates = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);
    
    const in3Days = new Date(today);
    in3Days.setDate(in3Days.getDate() + 3);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    return [
      { id: 'tomorrow', label: 'Tomorrow', date: tomorrow, icon: 'clock-fast' },
      { id: 'dayafter', label: formatDayName(dayAfter), date: dayAfter, icon: 'calendar-today' },
      { id: '3days', label: formatDayName(in3Days), date: in3Days, icon: 'calendar-week' },
      { id: 'week', label: 'Next Week', date: nextWeek, icon: 'calendar-range' },
    ];
  }, []);

  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    return date1.toDateString() === date2.toDateString();
  };

  const isDateValid = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() + minDays);
    
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + maxDays);

    return date >= minDate && date <= maxDate;
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    const startDay = firstDay.getDay();
    
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const handleQuickSelect = (option) => {
    onSelectDate(option.date);
  };

  const handleCalendarSelect = (date) => {
    if (date && isDateValid(date)) {
      onSelectDate(date);
      setShowCalendar(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.labelRow}>
          <Icon name="calendar-clock" size={20} color={COLORS.primary} />
          <Text style={styles.label}>{label}</Text>
        </View>
        {selectedDate && (
          <View style={styles.selectedInfo}>
            <Text style={styles.selectedText}>{formatDate(selectedDate)}</Text>
          </View>
        )}
      </View>

      {quickOptions && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickOptions}
        >
          {quickDates.map((option) => {
            const isSelected = isSameDay(selectedDate, option.date);
            
            return (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.quickOption,
                  isSelected && styles.quickOptionSelected,
                ]}
                onPress={() => handleQuickSelect(option)}
                activeOpacity={0.8}
              >
                <Icon 
                  name={option.icon} 
                  size={20} 
                  color={isSelected ? COLORS.primary : COLORS.textSecondary} 
                />
                <Text style={[
                  styles.quickOptionLabel,
                  isSelected && styles.quickOptionLabelSelected,
                ]}>
                  {option.label}
                </Text>
                {isSelected && (
                  <Icon name="check-circle" size={14} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            style={[styles.quickOption, styles.customDateOption]}
            onPress={() => setShowCalendar(true)}
            activeOpacity={0.8}
          >
            <Icon name="calendar-edit" size={20} color={COLORS.accent} />
            <Text style={styles.customDateLabel}>Pick Date</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {selectedDate && (
        <View style={styles.selectedDateContainer}>
          <View style={styles.selectedDateIcon}>
            <Icon name="calendar-check" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.selectedDateInfo}>
            <Text style={styles.selectedDateLabel}>Delivery Date</Text>
            <Text style={styles.selectedDateValue}>{formatFullDate(selectedDate)}</Text>
          </View>
          <TouchableOpacity 
            style={styles.changeBtn}
            onPress={() => setShowCalendar(true)}
          >
            <Text style={styles.changeBtnText}>Change</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        visible={showCalendar}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Delivery Date</Text>
              <TouchableOpacity 
                style={styles.closeBtn}
                onPress={() => setShowCalendar(false)}
              >
                <Icon name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.monthNav}>
              <TouchableOpacity 
                style={styles.navBtn}
                onPress={() => navigateMonth(-1)}
              >
                <Icon name="chevron-left" size={24} color={COLORS.text} />
              </TouchableOpacity>
              <Text style={styles.monthTitle}>
                {currentMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
              </Text>
              <TouchableOpacity 
                style={styles.navBtn}
                onPress={() => navigateMonth(1)}
              >
                <Icon name="chevron-right" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.dayHeaders}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <Text key={day} style={styles.dayHeader}>{day}</Text>
              ))}
            </View>

            <View style={styles.calendarGrid}>
              {generateCalendarDays().map((date, index) => {
                const isValid = date && isDateValid(date);
                const isSelected = isSameDay(date, selectedDate);
                const isToday = date && isSameDay(date, new Date());

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dayCell,
                      isSelected && styles.dayCellSelected,
                      isToday && !isSelected && styles.dayCellToday,
                    ]}
                    onPress={() => handleCalendarSelect(date)}
                    disabled={!isValid}
                    activeOpacity={0.7}
                  >
                    {date && (
                      <Text style={[
                        styles.dayText,
                        isSelected && styles.dayTextSelected,
                        !isValid && styles.dayTextDisabled,
                      ]}>
                        {date.getDate()}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.modalFooter}>
              <Icon name="information-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.footerNote}>
                Orders need at least 24 hours for preparation
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  selectedInfo: {
    backgroundColor: COLORS.primaryMuted,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  selectedText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  quickOptions: {
    paddingHorizontal: 4,
  },
  quickOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    gap: 8,
    marginRight: 10,
  },
  quickOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryMuted,
  },
  quickOptionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  quickOptionLabelSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  customDateOption: {
    borderColor: COLORS.accent,
  },
  customDateLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.accent,
  },
  selectedDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryMuted,
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
    marginHorizontal: 4,
    gap: 12,
  },
  selectedDateIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDateInfo: {
    flex: 1,
  },
  selectedDateLabel: {
    fontSize: 10,
    color: COLORS.primaryLight,
    marginBottom: 2,
  },
  selectedDateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  changeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.white,
    borderRadius: 12,
  },
  changeBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  closeBtn: {
    padding: 4,
  },
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  navBtn: {
    padding: 8,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  dayHeaders: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  dayCellSelected: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
  },
  dayCellToday: {
    backgroundColor: COLORS.primaryMuted,
    borderRadius: 20,
  },
  dayText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  dayTextSelected: {
    color: COLORS.white,
    fontWeight: '700',
  },
  dayTextDisabled: {
    color: COLORS.textLight,
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    gap: 6,
  },
  footerNote: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});

export default DatePicker;