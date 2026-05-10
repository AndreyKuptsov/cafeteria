import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/custom_cake.dart';
import '../models/cake_order.dart';
import '../services/api_service.dart';
import '../providers/locale_provider.dart';
import '../i18n/strings.dart';

class CakesScreen extends StatefulWidget {
  const CakesScreen({super.key});

  @override
  State<CakesScreen> createState() => _CakesScreenState();
}

class _CakesScreenState extends State<CakesScreen> {
  final _api = ApiService();
  List<CustomCake> _cakes = [];
  bool _loading = true;
  String? _error;
  CustomCake? _selectedCake;

  // Form state
  String _size = '';
  List<String> _decorations = [];
  bool _submitting = false;

  final _inscriptionCtrl = TextEditingController();
  final _requestsCtrl = TextEditingController();
  final _deliveryDateCtrl = TextEditingController();
  final _deliveryTimeCtrl = TextEditingController();
  final _addressCtrl = TextEditingController();
  final _nameCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    _fetch();
  }

  @override
  void dispose() {
    _inscriptionCtrl.dispose();
    _requestsCtrl.dispose();
    _deliveryDateCtrl.dispose();
    _deliveryTimeCtrl.dispose();
    _addressCtrl.dispose();
    _nameCtrl.dispose();
    _phoneCtrl.dispose();
    _emailCtrl.dispose();
    super.dispose();
  }

  Future<void> _fetch() async {
    setState(() => _loading = true);
    try {
      final cakes = await _api.getCakes();
      if (mounted) setState(() { _cakes = cakes; _error = null; _loading = false; });
    } catch (e) {
      if (mounted) setState(() { _error = e.toString(); _loading = false; });
    }
  }

  void _selectCake(CustomCake cake) {
    setState(() {
      _selectedCake = cake;
      _size = cake.sizes.isNotEmpty ? cake.sizes.first : '';
      _decorations = [];
    });
  }

  double _calcPrice() {
    if (_selectedCake == null) return 0;
    return _selectedCake!.calculatePrice(_size, _decorations);
  }

  Future<void> _submit() async {
    if (_nameCtrl.text.isEmpty || _phoneCtrl.text.isEmpty || _deliveryDateCtrl.text.isEmpty) {
      final l = context.read<LocaleProvider>().languageCode;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(Strings.t('cakes_fill_required', l)), backgroundColor: Colors.orange),
      );
      return;
    }

    setState(() => _submitting = true);
    try {
      final locale = context.read<LocaleProvider>();
      final req = CakeOrderRequest(
        cakeId: _selectedCake!.id,
        cakeName: _selectedCake!.getName(locale.languageCode),
        size: _size,
        weight: _size,
        decorations: _decorations,
        inscription: _inscriptionCtrl.text,
        specialRequests: _requestsCtrl.text,
        deliveryDate: _deliveryDateCtrl.text,
        deliveryTime: _deliveryTimeCtrl.text,
        deliveryAddress: _addressCtrl.text,
        customerName: _nameCtrl.text,
        customerPhone: _phoneCtrl.text,
        customerEmail: _emailCtrl.text,
        price: _calcPrice(),
      );
      final res = await _api.placeCakeOrder(req);
      if (!mounted) return;
      final l = locale.languageCode;
      await showDialog(
        context: context,
        builder: (_) => AlertDialog(
          title: Text(Strings.t('common_success', l)),
          content: Text('${Strings.t('cakes_order_success', l)} ${res.orderNumber}'),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context);
                setState(() { _selectedCake = null; });
                _resetForm();
              },
              child: Text(Strings.t('common_close', l)),
            ),
          ],
        ),
      );
    } catch (e) {
      if (!mounted) return;
      final l = context.read<LocaleProvider>().languageCode;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('${Strings.t('cakes_order_error', l)}: $e'), backgroundColor: Colors.red),
      );
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  void _resetForm() {
    _inscriptionCtrl.clear();
    _requestsCtrl.clear();
    _deliveryDateCtrl.clear();
    _deliveryTimeCtrl.clear();
    _addressCtrl.clear();
    _nameCtrl.clear();
    _phoneCtrl.clear();
    _emailCtrl.clear();
    setState(() {
      _size = '';
      _decorations = [];
    });
  }

  @override
  Widget build(BuildContext context) {
    final locale = context.watch<LocaleProvider>();
    final l = locale.languageCode;

    if (_loading) return const Center(child: CircularProgressIndicator());
    if (_error != null) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.cloud_off, size: 48, color: Colors.grey),
            const SizedBox(height: 12),
            Text('${Strings.t('common_error', l)}: $_error'),
            const SizedBox(height: 12),
            FilledButton.tonalIcon(onPressed: _fetch, icon: const Icon(Icons.refresh), label: Text(Strings.t('menu_retry', l))),
          ],
        ),
      );
    }
    if (_selectedCake != null) return _buildForm(context, l);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Text(Strings.t('cakes_title', l), style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Text(Strings.t('cakes_subtitle', l), style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.grey[600])),
          const SizedBox(height: 24),
          ..._cakes.map((cake) => _CakeCard(cake: cake, locale: l, onOrder: () => _selectCake(cake))),
        ],
      ),
    );
  }

  Widget _buildForm(BuildContext context, String l) {
    final cake = _selectedCake!;
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(cake.getName(l), style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold)),
              ),
              IconButton(icon: const Icon(Icons.close), onPressed: () => setState(() => _selectedCake = null)),
            ],
          ),
          const SizedBox(height: 24),

          Text('${Strings.t('cakes_select_size', l)} *', style: const TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Wrap(spacing: 8,
            children: cake.sizes.map((s) => ChoiceChip(
              label: Text(s), selected: _size == s,
              onSelected: (_) => setState(() => _size = s),
            )).toList(),
          ),
          const SizedBox(height: 24),

          Text(Strings.t('cakes_select_decorations', l), style: const TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Wrap(spacing: 8, runSpacing: 4,
            children: cake.decorations.map((d) => FilterChip(
              label: Text(d, style: const TextStyle(fontSize: 12)),
              selected: _decorations.contains(d),
              onSelected: (sel) => setState(() => sel ? _decorations.add(d) : _decorations.remove(d)),
            )).toList(),
          ),
          const SizedBox(height: 24),

          TextFormField(
            controller: _inscriptionCtrl,
            decoration: InputDecoration(labelText: Strings.t('cakes_inscription', l), hintText: Strings.t('cakes_inscription_placeholder', l)),
          ),
          const SizedBox(height: 12),
          TextFormField(
            controller: _requestsCtrl,
            decoration: InputDecoration(labelText: Strings.t('cakes_special_requests', l), hintText: Strings.t('cakes_special_requests_placeholder', l)),
            maxLines: 3,
          ),
          const SizedBox(height: 16),

          Row(
            children: [
              Expanded(
                child: TextFormField(
                  controller: _deliveryDateCtrl,
                  decoration: InputDecoration(labelText: '${Strings.t('cakes_delivery_date', l)} *', prefixIcon: const Icon(Icons.calendar_today)),
                  readOnly: true,
                  onTap: () async {
                    final minDays = cake.minOrderDays;
                    final minDate = DateTime.now().add(Duration(days: minDays));
                    final date = await showDatePicker(
                      context: context,
                      initialDate: minDate,
                      firstDate: minDate,
                      lastDate: minDate.add(const Duration(days: 180)),
                    );
                    if (date != null) _deliveryDateCtrl.text = '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
                  },
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: TextFormField(
                  controller: _deliveryTimeCtrl,
                  decoration: InputDecoration(labelText: Strings.t('cakes_delivery_time', l), prefixIcon: const Icon(Icons.access_time)),
                  readOnly: true,
                  onTap: () async {
                    final time = await showTimePicker(context: context, initialTime: const TimeOfDay(hour: 12, minute: 0));
                    if (time != null) _deliveryTimeCtrl.text = '${time.hour.toString().padLeft(2, '0')}:${time.minute.toString().padLeft(2, '0')}';
                  },
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          TextFormField(
            controller: _addressCtrl,
            decoration: InputDecoration(labelText: Strings.t('cakes_delivery_address', l), hintText: Strings.t('cakes_address_placeholder', l), prefixIcon: const Icon(Icons.location_on)),
          ),
          const SizedBox(height: 24),

          Text(Strings.t('cakes_contact_info', l), style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          TextFormField(controller: _nameCtrl, decoration: InputDecoration(labelText: '${Strings.t('common_name', l)} *', prefixIcon: const Icon(Icons.person))),
          const SizedBox(height: 12),
          TextFormField(controller: _phoneCtrl, decoration: InputDecoration(labelText: '${Strings.t('common_phone', l)} *', prefixIcon: const Icon(Icons.phone)), keyboardType: TextInputType.phone),
          const SizedBox(height: 12),
          TextFormField(controller: _emailCtrl, decoration: InputDecoration(labelText: Strings.t('common_email', l), prefixIcon: const Icon(Icons.email)), keyboardType: TextInputType.emailAddress),
          const SizedBox(height: 24),

          Card(
            color: const Color(0xFFE8F5E9),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(Strings.t('cakes_total_price', l), style: const TextStyle(color: Colors.grey, fontSize: 12)),
                      Text('₽ ${_calcPrice().toInt()}', style: Theme.of(context).textTheme.headlineSmall?.copyWith(color: const Color(0xFF2E7D32), fontWeight: FontWeight.bold)),
                    ],
                  ),
                  FilledButton(
                    onPressed: _submitting ? null : _submit,
                    child: _submitting
                        ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                        : Text(Strings.t('cakes_place_order', l)),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _CakeCard extends StatelessWidget {
  final CustomCake cake;
  final String locale;
  final VoidCallback onOrder;
  const _CakeCard({required this.cake, required this.locale, required this.onOrder});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      clipBehavior: Clip.antiAlias,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (cake.imageUrl != null)
            Stack(
              children: [
                Image.network(cake.imageUrl!, height: 250, width: double.infinity, fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => Container(height: 250, color: Colors.grey[200], child: const Center(child: Icon(Icons.cake, size: 64, color: Colors.grey)))),
                if (cake.isFeatured)
                  Positioned(
                    top: 8, right: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                      decoration: const BoxDecoration(gradient: LinearGradient(colors: [Colors.amber, Colors.orange]), borderRadius: BorderRadius.all(Radius.circular(20))),
                      child: Text('⭐ ${Strings.t('menu_featured', locale)}', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white)),
                    ),
                  ),
              ],
            ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(cake.getName(locale), style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                Text(cake.getDescription(locale), style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.grey[600])),
                const SizedBox(height: 12),
                Text('${Strings.t('cakes_available_sizes', locale)}:', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                const SizedBox(height: 4),
                Wrap(spacing: 4,
                  children: cake.sizes.map((s) => Chip(label: Text(s, style: const TextStyle(fontSize: 11)), materialTapTargetSize: MaterialTapTargetSize.shrinkWrap, visualDensity: VisualDensity.compact)).toList(),
                ),
                const SizedBox(height: 8),
                Text('${Strings.t('cakes_decoration_options', locale)}:', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                const SizedBox(height: 4),
                Wrap(spacing: 4,
                  children: cake.decorations.take(3).map((d) => Chip(label: Text(d, style: const TextStyle(fontSize: 10)), materialTapTargetSize: MaterialTapTargetSize.shrinkWrap, visualDensity: VisualDensity.compact)).toList(),
                ),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(color: Colors.blue[50], borderRadius: BorderRadius.circular(8)),
                  child: Text('⏰ ${Strings.t('cakes_min_days', locale, {'days': '${cake.minOrderDays}'})}', style: const TextStyle(fontSize: 12, color: Colors.blue)),
                ),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(Strings.t('cakes_from', locale), style: const TextStyle(fontSize: 12, color: Colors.grey)),
                        Text('₽ ${cake.basePrice.toInt()}', style: Theme.of(context).textTheme.headlineSmall?.copyWith(color: const Color(0xFF2E7D32), fontWeight: FontWeight.bold)),
                      ],
                    ),
                    FilledButton(onPressed: onOrder, child: Text(Strings.t('cakes_order_now', locale))),
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