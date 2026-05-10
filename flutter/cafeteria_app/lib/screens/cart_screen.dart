import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/cart_provider.dart';
import '../providers/locale_provider.dart';
import '../i18n/strings.dart';
import '../services/navigation_service.dart';

class CartScreen extends StatelessWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final locale = context.watch<LocaleProvider>();
    final cart = context.watch<CartProvider>();
    final l = locale.languageCode;

    if (cart.items.isEmpty) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.shopping_cart_outlined, size: 80, color: Colors.grey),
            const SizedBox(height: 16),
            Text(Strings.t('cart_empty', l), style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 24),
            FilledButton.icon(
              onPressed: () => NavigationService().navigate(routeMenu),
              icon: const Icon(Icons.menu_book),
              label: Text(Strings.t('cart_continue_shopping', l)),
            ),
          ],
        ),
      );
    }

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text(Strings.t('cart_title', l), style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold)),
        const SizedBox(height: 16),
        ...cart.items.map((item) => Card(
              margin: const EdgeInsets.only(bottom: 8),
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(item.name, style: const TextStyle(fontWeight: FontWeight.bold)),
                          const SizedBox(height: 4),
                          Text('${item.price} ₽ × ${item.quantity} = ${(item.price * item.quantity).toStringAsFixed(0)} ₽',
                              style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Colors.grey[600])),
                        ],
                      ),
                    ),
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        IconButton(
                          icon: const Icon(Icons.remove_circle_outline),
                          onPressed: () => cart.updateQuantity(item.id, item.quantity - 1),
                        ),
                        Text('${item.quantity}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                        IconButton(
                          icon: const Icon(Icons.add_circle_outline),
                          onPressed: () => cart.updateQuantity(item.id, item.quantity + 1),
                        ),
                        IconButton(
                          icon: const Icon(Icons.delete, color: Colors.red),
                          onPressed: () => cart.removeItem(item.id),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            )),
        const Divider(height: 32),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(Strings.t('cart_total', l), style: Theme.of(context).textTheme.titleLarge),
            Text('${cart.total.toStringAsFixed(2)} ₽',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold, color: const Color(0xFF2E7D32))),
          ],
        ),
        const SizedBox(height: 16),
        SizedBox(
          width: double.infinity,
          child: FilledButton.icon(
            onPressed: () => NavigationService().navigate(routeCart), // would navigate to checkout
            icon: const Icon(Icons.payment),
            label: Text(Strings.t('cart_checkout', l)),
            style: FilledButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 16)),
          ),
        ),
      ],
    );
  }
}