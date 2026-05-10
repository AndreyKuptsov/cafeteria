import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/cart_item.dart';

class CartProvider extends ChangeNotifier {
  List<CartItem> _items = [];

  List<CartItem> get items => List.unmodifiable(_items);

  int get count => _items.fold(0, (sum, item) => sum + item.quantity);

  double get total => _items.fold(0.0, (sum, item) => sum + item.total);

  CartProvider() {
    _loadFromPrefs();
  }

  Future<void> _loadFromPrefs() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString('cafeteria_cart');
    if (raw != null) {
      final list = jsonDecode(raw) as List;
      _items = list.map((e) => CartItem.fromJson(e as Map<String, dynamic>)).toList();
      notifyListeners();
    }
  }

  Future<void> _saveToPrefs() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('cafeteria_cart', jsonEncode(_items.map((e) => e.toJson()).toList()));
  }

  void addItem(CartItem item) {
    final idx = _items.indexWhere((i) => i.id == item.id);
    if (idx >= 0) {
      _items[idx].quantity++;
    } else {
      _items.add(item);
    }
    notifyListeners();
    _saveToPrefs();
  }

  void removeItem(int id) {
    _items.removeWhere((i) => i.id == id);
    notifyListeners();
    _saveToPrefs();
  }

  void updateQuantity(int id, int quantity) {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    final idx = _items.indexWhere((i) => i.id == id);
    if (idx >= 0) {
      _items[idx].quantity = quantity;
      notifyListeners();
      _saveToPrefs();
    }
  }

  void clear() {
    _items.clear();
    notifyListeners();
    _saveToPrefs();
  }
}
