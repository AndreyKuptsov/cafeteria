import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LocaleProvider extends ChangeNotifier {
  Locale _locale = const Locale('ru');
  Locale get locale => _locale;
  String get languageCode => _locale.languageCode;

  LocaleProvider() {
    _loadLocale();
  }

  Future<void> _loadLocale() async {
    final prefs = await SharedPreferences.getInstance();
    final code = prefs.getString('locale') ?? 'ru';
    _locale = Locale(code);
    notifyListeners();
  }

  Future<void> setLocale(String code) async {
    _locale = Locale(code);
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('locale', code);
  }

  void toggle() {
    setLocale(_locale.languageCode == 'ru' ? 'en' : 'ru');
  }
}