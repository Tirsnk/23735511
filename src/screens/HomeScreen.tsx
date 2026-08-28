import React, { useState, useEffect, useMemo, useCallback, useReducer } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  Modal,
  Alert,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { STUDENT, BANNER_IMAGE_ID, FLASH_SECONDS, VARIANT, examStamp } from '@constants/student';
import { useTheme } from '@contexts/ThemeContext';
import { useCountdown } from '@hooks/useCountdown';
import { fetchProducts, Product } from '@services/productApi';
import { Typography } from '@components/ui/Typography';
import { ShopInput } from '@components/ui/ShopInput';
import { ShopButton } from '@components/ui/ShopButton';

type Action = { type: 'INCREMENT' } | { type: 'DECREMENT' } | { type: 'RESET' };

const quantityReducer = (state: number, action: Action): number => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state > 1 ? state - 1 : 1;
    case 'RESET':
      return 1;
    default:
      return state;
  }
};

export const HomeScreen: React.FC = () => {
  const { colors, toggleTheme, isDark } = useTheme();
  const { formattedTime, isExpired } = useCountdown(FLASH_SECONDS);
  const insets = useSafeAreaInsets();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'food' | 'drink' | 'study'>('all');

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [quantity, dispatch] = useReducer(quantityReducer, 1);

  const loadProducts = async () => {
    setLoading(true);
    setError(false);
    let isAlive = true;
    try {
      const data = await fetchProducts();
      if (isAlive) {
        setProducts(data);
        setLoading(false);
      }
    } catch (err) {
      if (isAlive) {
        setError(true);
        setLoading(false);
      }
    }
    return () => {
      isAlive = false;
    };
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const stampText = `TH1 · ${STUDENT.mssv} · ${STUDENT.hoTen} · #${examStamp()}`;

  const chips = VARIANT.chipsReversed
    ? [
        { id: 'study', label: 'Học tập' },
        { id: 'drink', label: 'Nước' },
        { id: 'food', label: 'Đồ ăn' },
        { id: 'all', label: 'Tất cả' },
      ]
    : [
        { id: 'all', label: 'Tất cả' },
        { id: 'food', label: 'Đồ ăn' },
        { id: 'drink', label: 'Nước' },
        { id: 'study', label: 'Học tập' },
      ];

const handleOpenModal = useCallback((item: Product) => {
    if (isExpired) return; // Hết giờ thì chặn không cho mở modal dưới mọi hình thức!
    setSelectedProduct(item);
    dispatch({ type: 'RESET' });
    setModalVisible(true);
  }, [isExpired]);

  const handleConfirmOrder = () => {
    if (!selectedProduct) return;
    Alert.alert(
      `CampusMart · ${STUDENT.mssv}`,
      `${STUDENT.hoTen} (#${examStamp()}) đã ghi nhận: ${selectedProduct.title} × ${quantity}. Nhận tại quầy KTX.`
    );
    setModalVisible(false);
    dispatch({ type: 'RESET' });
  };

const renderItem = useCallback(({ item }: { item: Product }) => (
    <Pressable
      style={[
        styles.card,
        { 
          backgroundColor: colors.surface, 
          borderColor: colors.border,
          opacity: isExpired ? 0.6 : 1 // Làm mờ nhẹ khi hết giờ nếu muốn
        }
      ]}
      onPress={() => {
        if (!isExpired) {
          handleOpenModal(item);
        } else {
          Alert.alert("Flash-Sale", "Đã hết giờ flash-sale, không thể đặt món!");
        }
      }}
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="cover" />
      <View style={styles.cardInfo}>
        <Typography variant="medium" color={colors.text} numberOfLines={1}>
          {item.title}
        </Typography>
        <Typography variant="bold" color={colors.primary}>
          {item.formattedPrice}
        </Typography>
        <Typography variant="regular" color={colors.textLight}>
          {item.category === 'study' ? 'Học tập' : item.category === 'drink' ? 'Nước' : 'Đồ ăn'}
        </Typography>
      </View>
      {/* Nút đặt ở danh sách: Hết giờ thì hiển thị 'Hết giờ' và khóa (disabled) */}
      <ShopButton
        title={isExpired ? 'Hết giờ' : 'Đặt'}
        onPress={() => handleOpenModal(item)}
        disabled={isExpired}
        style={styles.cardButton}
      />
    </Pressable>
  ), [colors, handleOpenModal, isExpired]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: Math.max(insets.top, 12),
          paddingBottom: Math.max(insets.bottom, 12),
          paddingLeft: Math.max(insets.left, 16),
          paddingRight: Math.max(insets.right, 16),
        },
      ]}
    >
      {/* Watermark ở TRÊN nếu chẵn */}
      {VARIANT.watermarkAtTop && (
        <Typography variant="regular" color={colors.primary} style={styles.stampText}>
          {stampText}
        </Typography>
      )}

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Typography variant="title" color={colors.primary}>
            CAMPUSMART
          </Typography>
          <Typography variant="regular" color={colors.textLight}>
            Tiện lợi KTX
          </Typography>
        </View>
        <View style={styles.headerRight}>
          <Pressable
            onPress={toggleTheme}
            style={[styles.themeBtn, { borderColor: colors.primary }]}
          >
            <Typography variant="medium" color={colors.primary}>
              {isDark ? 'Sáng/Tối' : 'Sáng/Tối'}
            </Typography>
          </Pressable>
          <Typography variant="bold" color={colors.secondary}>
            Flash {formattedTime}
          </Typography>
        </View>
      </View>

      {/* Ô tìm kiếm */}
      <View style={styles.searchContainer}>
        <ShopInput
          placeholder={`Tìm món, nước, đồ dùng — ${STUDENT.mssv}`}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Banner */}
      <View style={[styles.bannerContainer, { borderColor: colors.border }]}>
        <Image
          source={{ uri: `https://picsum.photos/id/${BANNER_IMAGE_ID}/800/320` }}
          style={styles.bannerImage}
          resizeMode="cover"
        />
        <View style={styles.bannerOverlay}>
          <Typography variant="title" color={colors.surface}>
            Đặt nhanh · Nhận tại quầy
          </Typography>
          <Typography variant="regular" color={colors.surface}>
            Cửa hàng tiện lợi túc xá 24/7
          </Typography>
        </View>
      </View>

      {/* Chips loại hàng */}
      <View style={styles.chipsRow}>
        {chips.map((chip) => {
          const isSelected = selectedCategory === chip.id;
          return (
            <Pressable
              key={chip.id}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected ? colors.primary : colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setSelectedCategory(chip.id as any)}
            >
              <Typography
                variant="medium"
                color={isSelected ? colors.surface : colors.text}
              >
                {chip.label}
              </Typography>
            </Pressable>
          );
        })}
      </View>

      {/* Nội dung danh sách theo trạng thái mạng */}
      <View style={styles.contentContainer}>
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Typography variant="medium" color={colors.text} style={{ marginTop: 10 }}>
              Đang tải món…
            </Typography>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Typography variant="bold" color={colors.error} style={{ fontSize: 16 }}>
              {STUDENT.mssv} — Không tải được dữ liệu món.
            </Typography>
            <ShopButton title="Thử lại" onPress={loadProducts} style={{ marginTop: 15, width: 150 }} />
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => `${STUDENT.mssv}-${item.id}`}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.centerContainer}>
                <Typography variant="medium" color={colors.textLight}>
                  Không có món phù hợp
                </Typography>
              </View>
            }
          />
        )}
      </View>

      {/* Watermark ở DƯỚI nếu lẻ */}
      {!VARIANT.watermarkAtTop && (
        <Typography variant="regular" color={colors.primary} style={styles.stampTextBottom}>
          {stampText}
        </Typography>
      )}

      {/* Modal Đặt Món */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType={VARIANT.modalAnimation}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Typography variant="medium" color={colors.primary} style={{ textAlign: 'center', marginBottom: 10 }}>
              {stampText}
            </Typography>

            {selectedProduct && (
              <>
                <Image source={{ uri: selectedProduct.image }} style={styles.modalImage} resizeMode="cover" />
                <Typography variant="title" color={colors.text} style={styles.modalTitle}>
                  {selectedProduct.title}
                </Typography>
                <Typography variant="bold" color={colors.primary} style={styles.modalPrice}>
                  {selectedProduct.formattedPrice}
                </Typography>
                <Typography variant="regular" color={colors.textLight} style={styles.modalCategory}>
                  Danh mục: {selectedProduct.category === 'study' ? 'Học tập' : selectedProduct.category === 'drink' ? 'Nước' : 'Đồ ăn'}
                </Typography>
                <Typography variant="regular" color={colors.text} numberOfLines={2} style={styles.modalDesc}>
                  {selectedProduct.description}
                </Typography>

                <View style={styles.counterRow}>
                  <Pressable
                    style={[styles.counterBtn, { borderColor: colors.border }]}
                    onPress={() => dispatch({ type: 'DECREMENT' })}
                  >
                    <Typography variant="bold" color={colors.text}>−</Typography>
                  </Pressable>
                  <Typography variant="title" color={colors.text} style={{ marginHorizontal: 20 }}>
                    {quantity}
                  </Typography>
                  <Pressable
                    style={[styles.counterBtn, { borderColor: colors.border }]}
                    onPress={() => dispatch({ type: 'INCREMENT' })}
                  >
                    <Typography variant="bold" color={colors.text}>+</Typography>
                  </Pressable>
                </View>

                {/* Nút Xác nhận đặt bên trong Modal: Còn giờ thì cho đặt, hết giờ (isExpired) thì disable và đổi tên */}
                <ShopButton
                  title={isExpired ? 'Hết giờ flash-sale' : 'Xác nhận đặt'}
                  onPress={handleConfirmOrder}
                  disabled={isExpired}
                  style={{ marginTop: 15 }}
                />
                <ShopButton
                  title="Đóng"
                  variant="outline"
                  onPress={() => setModalVisible(false)}
                  style={{ marginTop: 10 }}
                />
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stampText: {
    textAlign: 'center',
    fontSize: 12,
    marginBottom: 6,
  },
  stampTextBottom: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  themeBtn: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 2,
  },
  searchContainer: {
    marginVertical: 2,
  },
  bannerContainer: {
    height: 100,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  bannerOverlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  chip: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  contentContainer: {
    flex: 1,
    marginTop: 2,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 10,
  },
  card: {
    flexDirection: 'row',
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 4,
    alignItems: 'center',
  },
  cardImage: {
    width: 55,
    height: 55,
    borderRadius: 8,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 10,
  },
  cardButton: {
    height: 34,
    paddingHorizontal: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
  },
  modalImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginBottom: 8,
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: 15,
    marginBottom: 2,
  },
  modalPrice: {
    marginBottom: 2,
  },
  modalCategory: {
    marginBottom: 6,
    fontSize: 12,
  },
  modalDesc: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 12,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  counterBtn: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});