import 'package:flutter/material.dart';

/// Route constants matching React app routes
const String routeHome = '/';
const String routeMenu = '/menu';
const String routeCakes = '/cakes';
const String routeBooking = '/booking';
const String routeCart = '/cart';

/// Global navigation service to switch tabs from child screens
class NavigationService {
  static final NavigationService _instance = NavigationService._internal();
  factory NavigationService() => _instance;
  NavigationService._internal();

  void Function(String route)? _onNavigate;

  void setHandler(void Function(String) handler) => _onNavigate = handler;

  void navigate(String route) => _onNavigate?.call(route);
}