import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  Pressable,
} from 'react-native';

const BG = '#F4F5F7';
const CARD = '#FFFFFF';
const BLUE = '#DCE8FB';
const BLUE_TEXT = '#3E7BFA';
const DARK = '#1C1C1E';
const GRAY = '#8E8E93';

function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Pressable style={styles.splashContainer} onPress={onFinish}>
      <StatusBar barStyle="light-content" />
      <View style={styles.splashCenter}>
        <View style={styles.splashTitleRow}>
          <Text style={styles.splashTitle}>Calox</Text>
          <Text style={styles.splashPro}>PRO</Text>
        </View>
      </View>
      <View style={styles.splashFooter}>
        <Text style={styles.splashSubtitle}>It's more about calculator</Text>
        <Text style={styles.splashVersion}>VERSION 2.0</Text>
      </View>
    </Pressable>
  );
}

const MENU_ITEMS = [
  { key: 'scientific', label: 'Scientific mode', icon: '⊞' },
  { key: 'fraction', label: 'Fraction', icon: '∿' },
  { key: 'handwriting', label: 'Handwriting mode', icon: '✎' },
  { key: 'linear', label: 'Linear', icon: '📐' },
  { key: 'base', label: 'Base Converter', icon: '⇄' },
  { key: 'graphing', label: 'Graphing', icon: '📊' },
  { key: 'currency', label: 'Currency Converter', icon: '$' },
  { key: 'gold', label: 'Gold calculator', icon: '🪙' },
  { key: 'measure', label: 'Measure mode', icon: '↕' },
];

function MoreMenuModal({ visible, onClose }) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalSheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.modalHandle} />
          <TouchableOpacity style={styles.modalCloseBtn} onPress={onClose}>
            <Text style={styles.modalCloseText}>✕</Text>
          </TouchableOpacity>
          <View style={{ marginTop: 8 }}>
            {MENU_ITEMS.map((item) => (
              <TouchableOpacity key={item.key} style={styles.menuRow} onPress={onClose}>
                <View style={styles.menuIconBox}>
                  <Text style={styles.menuIconText}>{item.icon}</Text>
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function CalculatorScreen() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [activeTab, setActiveTab] = useState('General');
  const [menuVisible, setMenuVisible] = useState(false);

  const handlePress = (value) => {
    if (value === 'AC') {
      setDisplay('0');
      setExpression('');
      return;
    }
    if (value === '⌫') {
      setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
      return;
    }
    if (value === '=') {
      try {
        const sanitized = display
          .replace(/×/g, '*')
          .replace(/÷/g, '/')
          .replace(/%/g, '/100');
        // eslint-disable-next-line no-eval
        const result = eval(sanitized);
        setExpression(display);
        setDisplay(String(result));
      } catch (e) {
        setDisplay('Error');
      }
      return;
    }
    setDisplay((prev) => (prev === '0' ? value : prev + value));
  };

  const buttons = [
    ['AC', '()', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '−'],
    ['1', '2', '3', '+'],
    ['0', '.', '⌫', '='],
  ];

  const isOperator = (v) => ['÷', '×', '−', '+', '='].includes(v);
  const isFunction = (v) => ['AC', '()', '%', '⌫'].includes(v);

  const tabs = ['General', 'Advance', 'Bill Split', 'More'];

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    if (tab === 'More') {
      setMenuVisible(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.degText}>DEG</Text>
        </View>

        <View style={styles.displayContainer}>
          <Text style={styles.expressionText}>{expression || ' '}</Text>
          <Text style={styles.displayText} numberOfLines={1} adjustsFontSizeToFit>
            {display}
          </Text>
        </View>

        <View style={styles.keypad}>
          {buttons.map((row, rowIndex) => (
            <View style={styles.row} key={rowIndex}>
              {row.map((btn) => (
                <TouchableOpacity
                  key={btn}
                  style={[
                    styles.button,
                    isOperator(btn) && styles.operatorButton,
                    btn === '=' && styles.equalsButton,
                  ]}
                  onPress={() => handlePress(btn)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      isOperator(btn) && styles.operatorButtonText,
                      isFunction(btn) && styles.functionButtonText,
                    ]}
                  >
                    {btn}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.tabBar}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={styles.tabItem}
              onPress={() => handleTabPress(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.tabTextActive,
                ]}
              >
                {tab}
              </Text>
              {activeTab === tab && <View style={styles.tabDot} />}
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.homeIndicator} />
      </View>

      <MoreMenuModal visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </SafeAreaView>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return <CalculatorScreen />;
}

const styles = StyleSheet.create({
  // Splash
  splashContainer: {
    flex: 1,
    backgroundColor: '#161616',
    justifyContent: 'space-between',
  },
  splashCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  splashTitle: {
    color: '#FFFFFF',
    fontSize: 44,
    fontWeight: '600',
  },
  splashPro: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
    marginLeft: 2,
  },
  splashFooter: {
    alignItems: 'center',
    paddingBottom: 48,
  },
  splashSubtitle: {
    color: '#A0A0A0',
    fontSize: 13,
    marginBottom: 10,
  },
  splashVersion: {
    color: '#5A5A5A',
    fontSize: 11,
    letterSpacing: 1,
  },

  // Calculator
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },
  container: {
    flex: 1,
    backgroundColor: BG,
    paddingHorizontal: 18,
  },
  header: {
    paddingTop: 12,
    paddingBottom: 4,
  },
  degText: {
    color: GRAY,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
  },
  displayContainer: {
    minHeight: 140,
    justifyContent: 'flex-end',
    paddingBottom: 18,
  },
  expressionText: {
    textAlign: 'right',
    color: GRAY,
    fontSize: 20,
    marginBottom: 6,
  },
  displayText: {
    textAlign: 'right',
    color: DARK,
    fontSize: 64,
    fontWeight: '500',
  },
  keypad: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  button: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: CARD,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  operatorButton: {
    backgroundColor: BLUE,
  },
  equalsButton: {
    backgroundColor: BLUE_TEXT,
  },
  buttonText: {
    fontSize: 26,
    color: DARK,
    fontWeight: '500',
  },
  operatorButtonText: {
    color: BLUE_TEXT,
    fontWeight: '600',
  },
  functionButtonText: {
    color: DARK,
    fontWeight: '600',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 6,
    borderTopWidth: 1,
    borderTopColor: '#E9E9EC',
  },
  tabItem: {
    alignItems: 'center',
    flex: 1,
  },
  tabText: {
    fontSize: 13,
    color: GRAY,
  },
  tabTextActive: {
    color: DARK,
    fontWeight: '700',
  },
  tabDot: {
    marginTop: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: DARK,
  },
  homeIndicator: {
    alignSelf: 'center',
    width: 120,
    height: 4,
    borderRadius: 2,
    backgroundColor: DARK,
    marginBottom: 6,
    opacity: 0.8,
  },

  // Menu Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
    maxHeight: '75%',
  },
  modalHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D9D9DE',
    marginBottom: 6,
  },
  modalCloseBtn: {
    position: 'absolute',
    right: 16,
    top: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F1F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    fontSize: 14,
    color: DARK,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#F1F1F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuIconText: {
    fontSize: 14,
    color: DARK,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: DARK,
  },
});
