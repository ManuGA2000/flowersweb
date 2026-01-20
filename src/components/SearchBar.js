// Search Bar Component - Fixed for continuous typing
// src\components\SearchBar.js
import React, { useCallback } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SIZES } from '../utils/theme';

const SearchBar = ({ 
  value, 
  onChangeText, 
  placeholder = 'Search flowers.. .',
  onClear,
  onSubmit,
}) => {
  const handleClear = useCallback(() => {
    if (onClear) {
      onClear();
    }
  }, [onClear]);

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Icon name="magnify" size={22} color={COLORS.textLight} style={styles.icon} />
        
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textLight}
          returnKeyType="search"
          onSubmitEditing={onSubmit}
          editable={true}
          multiline={false}
        />
        
        {value && value.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
            <Icon name="close-circle" size={20} color={COLORS.textLight} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet. create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS. background,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  icon:  {
    marginRight: 8,
  },
  input:  {
    flex: 1,
    fontSize: SIZES.md,
    color: COLORS.text,
    padding: 0,
    margin: 0,
  },
  clearBtn: {
    padding: 4,
  },
});

export default SearchBar;