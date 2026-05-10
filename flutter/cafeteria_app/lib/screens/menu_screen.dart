import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/menu_item.dart';
import '../services/api_service.dart';
import '../providers/cart_provider.dart';
import '../providers/locale_provider.dart';
import '../models/cart_item.dart';
import '../i18n/strings.dart';
import '../services/navigation_service.dart';

class MenuScreen extends StatefulWidget {
  const MenuScreen({super.key});

  @override
  State<MenuScreen> createState() => _MenuScreenState();
}

class _MenuScreenState extends State<MenuScreen> {
  final _api = ApiService();
  List<MenuItem> _items = [];
  bool _loading = true;
  String? _error;
  String _selectedCategory = 'all';
  final _searchCtrl = TextEditingController();

  static const _categories = [
    _Category('all', 'cat_all', '🍽️'),
    _Category('breakfast', 'cat_breakfast', '🥞'),
    _Category('desserts', 'cat_desserts', '🍰'),
    _Category('salads', 'cat_salads', '🥗'),
    _Category('soups', 'cat_soups', '🍲'),
    _Category('pasta', 'cat_pasta', '🍝'),
    _Category('main', 'cat_main', '🍖'),
    _Category('drinks', 'cat_drinks', '☕'),
  ];

  @override
  void initState() {
    super.initState();
    _fetch();
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  Future<void> _fetch() async {
    setState(() => _loading = true);
    try {
      final items = await _api.getMenuItems();
      if (mounted) setState(() { _items = items; _error = null; _loading = false; });
    } catch (e) {
      if (mounted) setState(() { _error = e.toString(); _loading = false; });
    }
  }

  List<MenuItem> get _filtered {
    final q = _searchCtrl.text.toLowerCase();
    return _items.where((item) {
      return item.available &&
          (_selectedCategory == 'all' || item.category == _selectedCategory) &&
          (q.isEmpty || item.nameRu.toLowerCase().contains(q) || item.nameEn.toLowerCase().contains(q) ||
              item.descriptionRu.toLowerCase().contains(q) || item.descriptionEn.toLowerCase().contains(q));
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final locale = context.watch<LocaleProvider>();
    final cart = context.watch<CartProvider>();
    final l = locale.languageCode;

    return Column(
      children: [
        // Header
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
          child: Column(
            children: [
              Text(Strings.t('menu_title', l),
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold)),
              const SizedBox(height: 4),
              Text(Strings.t('menu_subtitle', l),
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.grey[600])),
            ],
          ),
        ),
        // Search
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: TextField(
            controller: _searchCtrl,
            decoration: InputDecoration(
              hintText: Strings.t('menu_search', l),
              prefixIcon: const Icon(Icons.search),
              suffixIcon: _searchCtrl.text.isNotEmpty
                  ? IconButton(icon: const Icon(Icons.clear), onPressed: () { _searchCtrl.clear(); setState(() {}); })
                  : null,
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(30)),
              filled: true,
              fillColor: Colors.white,
              contentPadding: const EdgeInsets.symmetric(vertical: 12),
            ),
            onChanged: (_) => setState(() {}),
          ),
        ),
        // Categories
        SizedBox(
          height: 48,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            itemCount: _categories.length,
            itemBuilder: (_, i) {
              final cat = _categories[i];
              final sel = _selectedCategory == cat.id;
              return Padding(
                padding: const EdgeInsets.only(right: 8),
                child: FilterChip(
                  label: Text('${cat.emoji} ${Strings.t(cat.label, l)}', style: TextStyle(fontSize: 13, fontWeight: sel ? FontWeight.bold : FontWeight.normal)),
                  selected: sel,
                  onSelected: (_) => setState(() => _selectedCategory = cat.id),
                  visualDensity: VisualDensity.compact,
                ),
              );
            },
          ),
        ),
        // Content
        Expanded(
          child: _buildContent(context, cart, l),
        ),
      ],
    );
  }

  Widget _buildContent(BuildContext context, CartProvider cart, String l) {
    if (_loading) return const Center(child: CircularProgressIndicator());

    if (_error != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.cloud_off, size: 48, color: Colors.grey),
              const SizedBox(height: 12),
              Text('${Strings.t('menu_error', l)}: $_error', textAlign: TextAlign.center),
              const SizedBox(height: 12),
              FilledButton.tonalIcon(onPressed: _fetch, icon: const Icon(Icons.refresh), label: Text(Strings.t('menu_retry', l))),
            ],
          ),
        ),
      );
    }

    if (_filtered.isEmpty) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(_searchCtrl.text.isEmpty ? '😔' : '🔍', style: const TextStyle(fontSize: 48)),
            const SizedBox(height: 12),
            Text(Strings.t('menu_no_items', l), style: Theme.of(context).textTheme.titleMedium),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
      itemCount: _filtered.length,
      itemBuilder: (_, i) => _MenuItemCard(
        item: _filtered[i],
        locale: l,
        onAdd: () {
          cart.addItem(CartItem(
            id: _filtered[i].id,
            name: _filtered[i].getName(l),
            price: _filtered[i].price,
            image: _filtered[i].imageUrl,
            type: 'menu_item',
          ));
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('${_filtered[i].getName(l)} — ${Strings.t('menu_add_to_cart', l)}'),
              duration: const Duration(seconds: 2),
              action: SnackBarAction(label: Strings.t('cart_title', l), onPressed: () => NavigationService().navigate(routeCart)),
            ),
          );
        },
      ),
    );
  }
}

class _Category {
  final String id;
  final String label;
  final String emoji;
  const _Category(this.id, this.label, this.emoji);
}

class _MenuItemCard extends StatelessWidget {
  final MenuItem item;
  final String locale;
  final VoidCallback onAdd;
  const _MenuItemCard({required this.item, required this.locale, required this.onAdd});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      clipBehavior: Clip.antiAlias,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (item.imageUrl != null)
            Stack(
              children: [
                Image.network(item.imageUrl!, height: 200, width: double.infinity, fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Container(height: 200, color: Colors.grey[200], child: const Center(child: Icon(Icons.image, size: 64, color: Colors.grey)))),
                if (item.isFeatured)
                  Positioned(
                    top: 8, right: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(color: Colors.amber, borderRadius: BorderRadius.circular(20)),
                      child: Text('⭐ ${Strings.t('menu_featured', locale)}', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                    ),
                  ),
              ],
            ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(item.getName(locale), style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                Text(item.getDescription(locale), maxLines: 2, overflow: TextOverflow.ellipsis,
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Colors.grey[600])),
                if (item.allergens.isNotEmpty) ...[
                  const SizedBox(height: 8),
                  Text('${Strings.t('menu_allergens', locale)}:', style: const TextStyle(fontSize: 11, color: Colors.grey)),
                  const SizedBox(height: 4),
                  Wrap(
                    spacing: 4, runSpacing: 2,
                    children: item.allergens.map((a) => Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(color: Colors.red[50], borderRadius: BorderRadius.circular(4)),
                      child: Text(a, style: const TextStyle(fontSize: 10, color: Colors.red)),
                    )).toList(),
                  ),
                ],
                if (item.nutritionalInfo != null) ...[
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(color: Colors.grey[50], borderRadius: BorderRadius.circular(8)),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        _Nutri(label: Strings.t('menu_calories', locale), value: '${item.nutritionalInfo!.calories}'),
                        _Nutri(label: Strings.t('menu_protein', locale), value: '${item.nutritionalInfo!.protein}г'),
                        _Nutri(label: Strings.t('menu_carbs', locale), value: '${item.nutritionalInfo!.carbs}г'),
                        _Nutri(label: Strings.t('menu_fat', locale), value: '${item.nutritionalInfo!.fat}г'),
                      ],
                    ),
                  ),
                ],
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('₽ ${item.price.toStringAsFixed(0)}',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(color: const Color(0xFF2E7D32), fontWeight: FontWeight.bold)),
                    FilledButton.tonalIcon(
                      onPressed: onAdd,
                      icon: const Icon(Icons.add_shopping_cart, size: 18),
                      label: Text(Strings.t('menu_add_to_cart', locale)),
                      style: FilledButton.styleFrom(visualDensity: VisualDensity.compact),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _Nutri extends StatelessWidget {
  final String label;
  final String value;
  const _Nutri({required this.label, required this.value});
  @override
  Widget build(BuildContext context) {
    return Column(children: [
      Text(label, style: const TextStyle(fontSize: 10, color: Colors.grey)),
      Text(value, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
    ]);
  }
}