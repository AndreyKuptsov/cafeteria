import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/locale_provider.dart';
import '../i18n/strings.dart';
import '../services/navigation_service.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final locale = context.watch<LocaleProvider>();
    final l = locale.languageCode;

    return SingleChildScrollView(
      child: Column(
        children: [
          _buildHero(context, l),
          _buildFeatures(context, l),
          _buildCta(context, l),
        ],
      ),
    );
  }

  Widget _buildHero(BuildContext context, String l) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 80),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFFE8F5E9), Color(0xFFFFF3E0), Color(0xFFF3E5F5)],
        ),
      ),
      child: Column(
        children: [
          Text(Strings.t('hero_title', l),
              style: Theme.of(context).textTheme.displaySmall?.copyWith(fontWeight: FontWeight.bold, color: const Color(0xFF2E7D32))),
          const SizedBox(height: 8),
          Text(Strings.t('hero_subtitle', l),
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(color: const Color(0xFF558B2F))),
          const SizedBox(height: 16),
          Text(Strings.t('hero_description', l),
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.titleMedium?.copyWith(color: const Color(0xFF33691E))),
          const SizedBox(height: 32),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              ElevatedButton(
                onPressed: () => _navigate(context, '/menu'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF2E7D32),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                ),
                child: Text(Strings.t('hero_cta', l)),
              ),
              const SizedBox(width: 16),
              OutlinedButton(
                onPressed: () => _navigate(context, '/booking'),
                style: OutlinedButton.styleFrom(
                  foregroundColor: const Color(0xFF2E7D32),
                  padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                  side: const BorderSide(color: Color(0xFF2E7D32)),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                ),
                child: Text(Strings.t('hero_book_table', l)),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildFeatures(BuildContext context, String l) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      color: Colors.white,
      child: Column(
        children: [
          _FeatureCard(
            icon: Icons.free_breakfast,
            title: Strings.t('cat_breakfast', l),
            subtitle: 'Овсяная каша, яичница, блины',
          ),
          const SizedBox(height: 24),
          _FeatureCard(
            icon: Icons.cake,
            title: Strings.t('cat_desserts', l),
            subtitle: 'Наполеон, Медовик, Тирамису',
          ),
          const SizedBox(height: 24),
          const _FeatureCard(
            icon: Icons.access_time,
            title: 'Удобный график',
            subtitle: 'Пн-Пт: 10:00-20:00\nСб-Вс: 12:00-17:00',
          ),
          const SizedBox(height: 24),
          const _FeatureCard(
            icon: Icons.location_on,
            title: 'В центре города',
            subtitle: 'ул. Ванеева, Нижний Новгород',
          ),
        ],
      ),
    );
  }

  Widget _buildCta(BuildContext context, String l) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(48),
      color: const Color(0xFF2E7D32),
      child: Column(
        children: [
          Text('Закажите торт на заказ',
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(color: Colors.white, fontWeight: FontWeight.bold)),
          const SizedBox(height: 16),
          Text(
            'Лавандовый бисквит, Три шоколада, Бурбоновый мусс - эксклюзивные торты для ваших праздников',
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.titleMedium?.copyWith(color: Colors.white70),
          ),
          const SizedBox(height: 24),
          OutlinedButton(
            onPressed: () => _navigate(context, '/cakes'),
            style: OutlinedButton.styleFrom(
              foregroundColor: const Color(0xFF2E7D32),
              backgroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
            ),
            child: Text(Strings.t('cakes_order_now', l)),
          ),
        ],
      ),
    );
  }

  void _navigate(BuildContext context, String route) {
    // Notify MainScreen via the global navigation service
    NavigationService().navigate(route);
  }
}

class _FeatureCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  const _FeatureCard({required this.icon, required this.title, required this.subtitle});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(
          width: 64, height: 64,
          decoration: BoxDecoration(color: const Color(0xFFE8F5E9), borderRadius: BorderRadius.circular(32)),
          child: Icon(icon, color: const Color(0xFF2E7D32), size: 32),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold, color: const Color(0xFF2E7D32))),
              const SizedBox(height: 4),
              Text(subtitle, style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.black54)),
            ],
          ),
        ),
      ],
    );
  }
}

/// Simple global navigation service to switch tabs from child screens
