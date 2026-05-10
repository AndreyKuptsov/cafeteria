import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/api_service.dart';
import '../providers/cart_provider.dart';
import '../providers/locale_provider.dart';
import '../models/order.dart';
import '../i18n/strings.dart';

class CheckoutScreen extends StatefulWidget {
  const CheckoutScreen({super.key});

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  final _api = ApiService();
  bool _submitting = false;
  String _orderType = 'pickup';
  String _paymentMethod = 'card';

  final _nameCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _addressCtrl = TextEditingController();
  final _instructionsCtrl = TextEditingController();

  @override
  void dispose() {
    _nameCtrl.dispose();
    _phoneCtrl.dispose();
    _emailCtrl.dispose();
    _addressCtrl.dispose();
    _instructionsCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final cart = context.read<CartProvider>();
    final locale = context.read<LocaleProvider>();
    final l = locale.languageCode;

    if (cart.items.isEmpty) return;
    if (_nameCtrl.text.isEmpty || _phoneCtrl.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(Strings.t('cakes_fill_required', l)), backgroundColor: Colors.orange),
      );
      return;
    }

    setState(() => _submitting = true);
    try {
      final req = OrderRequest(
        orderType: _orderType,
        items: cart.items.map((i) => {
          'id': i.id,
          'name': i.name,
          'price': i.price,
          'quantity': i.quantity,
          'type': i.type,
        }).toList(),
        totalAmount: cart.total,
        deliveryAddress: _orderType == 'delivery' ? _addressCtrl.text : null,
        customerName: _nameCtrl.text,
        customerPhone: _phoneCtrl.text,
        customerEmail: _emailCtrl.text,
        paymentMethod: _paymentMethod,
        specialInstructions: _instructionsCtrl.text.isNotEmpty ? _instructionsCtrl.text : null,
      );
      final res = await _api.createOrder(req);
      if (!mounted) return;
      cart.clear();
      await showDialog(
        context: context,
        builder: (_) => AlertDialog(
          title: Text(Strings.t('common_success', l)),
          content: Text('${Strings.t('order_success', l)}\n#${res.orderNumber}'),
          actions: [
            TextButton(
              onPressed: () { Navigator.pop(context); Navigator.pop(context); },
              child: Text(Strings.t('common_close', l)),
            ),
          ],
        ),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('${Strings.t('order_error', l)}: $e'), backgroundColor: Colors.red),
      );
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final locale = context.watch<LocaleProvider>();
    final cart = context.watch<CartProvider>();
    final l = locale.languageCode;

    return Scaffold(
      appBar: AppBar(
        title: Text(Strings.t('order_title', l), style: const TextStyle(color: Colors.white)),
        backgroundColor: const Color(0xFF2E7D32),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(Strings.t('order_type', l), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 8),
            Wrap(spacing: 8,
              children: ['pickup', 'delivery', 'dine_in'].map((type) {
                final labels = {'pickup': 'order_pickup', 'delivery': 'order_delivery', 'dine_in': 'order_dine_in'};
                return ChoiceChip(
                  label: Text(Strings.t(labels[type]!, l)),
                  selected: _orderType == type,
                  onSelected: (_) => setState(() => _orderType = type),
                );
              }).toList(),
            ),
            if (_orderType == 'delivery') ...[
              const SizedBox(height: 16),
              TextFormField(
                controller: _addressCtrl,
                decoration: InputDecoration(labelText: Strings.t('order_delivery_address', l), prefixIcon: const Icon(Icons.location_on)),
              ),
            ],
            const SizedBox(height: 24),

            Text(Strings.t('order_payment_method', l), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 8),
            Wrap(spacing: 8,
              children: ['card', 'cash', 'sbp'].map((method) {
                final labels = {'card': 'order_card', 'cash': 'order_cash', 'sbp': 'order_sbp'};
                return ChoiceChip(
                  label: Text(Strings.t(labels[method]!, l)),
                  selected: _paymentMethod == method,
                  onSelected: (_) => setState(() => _paymentMethod = method),
                );
              }).toList(),
            ),
            const SizedBox(height: 24),

            Text(Strings.t('order_contact_info', l), style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            TextFormField(controller: _nameCtrl, decoration: InputDecoration(labelText: '${Strings.t('common_name', l)} *', prefixIcon: const Icon(Icons.person))),
            const SizedBox(height: 12),
            TextFormField(controller: _phoneCtrl, decoration: InputDecoration(labelText: '${Strings.t('common_phone', l)} *', prefixIcon: const Icon(Icons.phone)), keyboardType: TextInputType.phone),
            const SizedBox(height: 12),
            TextFormField(controller: _emailCtrl, decoration: InputDecoration(labelText: Strings.t('common_email', l), prefixIcon: const Icon(Icons.email)), keyboardType: TextInputType.emailAddress),
            const SizedBox(height: 12),
            TextFormField(
              controller: _instructionsCtrl,
              decoration: InputDecoration(labelText: Strings.t('order_special_instructions', l)),
              maxLines: 3,
            ),
            const SizedBox(height: 24),

            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    ...cart.items.map((item) => Padding(
                      padding: const EdgeInsets.only(bottom: 8),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(child: Text('${item.name} × ${item.quantity}')),
                          Text('₽ ${(item.price * item.quantity).toStringAsFixed(0)}'),
                        ],
                      ),
                    )),
                    const Divider(),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(Strings.t('cart_total', l), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                        Text('₽ ${cart.total.toStringAsFixed(2)}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Color(0xFF2E7D32))),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            SizedBox(
              width: double.infinity,
              child: FilledButton(
                onPressed: _submitting ? null : _submit,
                style: FilledButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 16)),
                child: _submitting
                    ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                    : Text(Strings.t('order_place_order', l)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}