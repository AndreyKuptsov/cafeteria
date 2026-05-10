import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../i18n/strings.dart';
import '../providers/locale_provider.dart';
import '../providers/cart_provider.dart';
import '../services/navigation_service.dart';
import 'home_screen.dart';
import 'menu_screen.dart';
import 'cakes_screen.dart';
import 'booking_screen.dart';
import 'cart_screen.dart';

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _currentIndex = 0;
  late final List<Widget> _screens;

  final _routeToIndex = <String, int>{
    routeHome: 0,
    routeMenu: 1,
    routeCakes: 2,
    routeBooking: 3,
    routeCart: 4,
  };

  @override
  void initState() {
    super.initState();
    _screens = const [
      HomeScreen(),
      MenuScreen(),
      CakesScreen(),
      BookingScreen(),
      CartScreen(),
    ];
    // Register navigation handler
    NavigationService().setHandler(_navigateByRoute);
  }

  void _navigateByRoute(String route) {
    final idx = _routeToIndex[route];
    if (idx != null && idx != _currentIndex) {
      setState(() => _currentIndex = idx);
    }
  }

  void switchTab(int index) {
    if (index >= 0 && index < _screens.length && index != _currentIndex) {
      setState(() => _currentIndex = index);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final locale = context.watch<LocaleProvider>();
    final cart = context.watch<CartProvider>();
    final l = locale.languageCode;

    return Scaffold(
      appBar: AppBar(
        title: Text('Cafeteria.ru',
            style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold, color: Colors.white)),
        backgroundColor: const Color(0xFF2E7D32),
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.language, color: Colors.white),
            tooltip: l == 'ru' ? 'English' : 'Русский',
            onPressed: () => context.read<LocaleProvider>().toggle(),
          ),
          Stack(
            children: [
              IconButton(
                icon: const Icon(Icons.shopping_cart, color: Colors.white),
                onPressed: () => switchTab(4),
              ),
              if (cart.count > 0)
                Positioned(
                  right: 6,
                  top: 6,
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: const BoxDecoration(color: Colors.red, shape: BoxShape.circle),
                    constraints: const BoxConstraints(minWidth: 18, minHeight: 18),
                    child: Text('${cart.count}',
                        style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                        textAlign: TextAlign.center),
                  ),
                ),
            ],
          ),
        ],
      ),
      body: IndexedStack(index: _currentIndex, children: _screens),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: switchTab,
        destinations: [
          NavigationDestination(
              icon: const Icon(Icons.home_outlined),
              selectedIcon: const Icon(Icons.home),
              label: Strings.t('nav_home', l)),
          NavigationDestination(
              icon: const Icon(Icons.menu_book_outlined),
              selectedIcon: const Icon(Icons.menu_book),
              label: Strings.t('nav_menu', l)),
          NavigationDestination(
              icon: const Icon(Icons.cake_outlined),
              selectedIcon: const Icon(Icons.cake),
              label: Strings.t('nav_cakes', l)),
          NavigationDestination(
              icon: const Icon(Icons.calendar_today_outlined),
              selectedIcon: const Icon(Icons.calendar_today),
              label: Strings.t('nav_booking', l)),
          NavigationDestination(
            icon: Badge(
              isLabelVisible: cart.count > 0,
              label: Text('${cart.count}'),
              child: const Icon(Icons.shopping_cart_outlined),
            ),
            selectedIcon: Badge(
              isLabelVisible: cart.count > 0,
              label: Text('${cart.count}'),
              child: const Icon(Icons.shopping_cart),
            ),
            label: Strings.t('nav_cart', l),
          ),
        ],
      ),
    );
  }
}