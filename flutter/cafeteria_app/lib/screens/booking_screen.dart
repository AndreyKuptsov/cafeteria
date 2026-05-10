import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/api_service.dart';
import '../providers/locale_provider.dart';
import '../models/booking.dart';
import '../i18n/strings.dart';

class BookingScreen extends StatefulWidget {
  const BookingScreen({super.key});

  @override
  State<BookingScreen> createState() => _BookingScreenState();
}

class _BookingScreenState extends State<BookingScreen> {
  final _formKey = GlobalKey<FormState>();
  final _api = ApiService();
  bool _submitting = false;

  final _dateCtrl = TextEditingController();
  final _nameCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _requestsCtrl = TextEditingController();

  int _guestsCount = 2;
  String? _selectedTime;
  String _tablePreference = '';

  final _timeSlots = [
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
    '19:00', '19:30', '20:00',
  ];

  static const _tablePrefs = [
    _TablePref('window', 'У окна', 'By the window'),
    _TablePref('corner', 'В углу', 'In the corner'),
    _TablePref('center', 'В центре зала', 'Center of the hall'),
    _TablePref('terrace', 'На террасе', 'On the terrace'),
  ];

  @override
  void dispose() {
    _dateCtrl.dispose();
    _nameCtrl.dispose();
    _phoneCtrl.dispose();
    _emailCtrl.dispose();
    _requestsCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _submitting = true);
    try {
      final req = BookingRequest(
        bookingDate: _dateCtrl.text,
        bookingTime: _selectedTime ?? '',
        guestsCount: _guestsCount,
        tablePreference: _tablePreference,
        specialRequests: _requestsCtrl.text,
        customerName: _nameCtrl.text,
        customerPhone: _phoneCtrl.text,
        customerEmail: _emailCtrl.text,
      );
      final res = await _api.createBooking(req);
      if (!mounted) return;
      final l = context.read<LocaleProvider>().languageCode;
      await showDialog(
        context: context,
        builder: (_) => AlertDialog(
          title: Text(Strings.t('common_success', l)),
          content: Text('${Strings.t('booking_success', l)} ${res.bookingNumber}'),
          actions: [TextButton(onPressed: () => Navigator.pop(context), child: Text(Strings.t('common_close', l)))],
        ),
      );
      _resetForm();
    } catch (e) {
      if (!mounted) return;
      final l = context.read<LocaleProvider>().languageCode;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('${Strings.t('booking_error', l)}: $e'), backgroundColor: Colors.red),
      );
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  void _resetForm() {
    _dateCtrl.clear();
    _nameCtrl.clear();
    _phoneCtrl.clear();
    _emailCtrl.clear();
    _requestsCtrl.clear();
    setState(() {
      _guestsCount = 2;
      _selectedTime = null;
      _tablePreference = '';
    });
  }

  @override
  Widget build(BuildContext context) {
    final locale = context.watch<LocaleProvider>();
    final l = locale.languageCode;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Text(Strings.t('booking_title', l),
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Text(Strings.t('booking_subtitle', l),
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.grey[600])),
          const SizedBox(height: 24),

          // Business Hours
          Card(
            color: const Color(0xFFE8F5E9),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  const Icon(Icons.access_time, color: Color(0xFF2E7D32)),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(Strings.t('booking_business_hours', l), style: const TextStyle(fontWeight: FontWeight.bold)),
                        const SizedBox(height: 4),
                        Text(Strings.t('booking_weekdays', l, {'open': '10:00', 'close': '20:00'})),
                        Text(Strings.t('booking_weekends', l, {'open': '12:00', 'close': '17:00'})),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),

          Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Date & Time
                Row(
                  children: [
                    Expanded(
                      child: TextFormField(
                        controller: _dateCtrl,
                        decoration: InputDecoration(
                          labelText: Strings.t('booking_select_date', l),
                          prefixIcon: const Icon(Icons.calendar_today),
                        ),
                        readOnly: true,
                        onTap: () async {
                          final date = await showDatePicker(
                            context: context,
                            initialDate: DateTime.now(),
                            firstDate: DateTime.now(),
                            lastDate: DateTime.now().add(const Duration(days: 90)),
                          );
                          if (date != null) {
                            _dateCtrl.text =
                                '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
                          }
                        },
                        validator: (v) => v!.isEmpty ? Strings.t('booking_fill_required', l) : null,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: DropdownButtonFormField<String>(
                        value: _selectedTime,
                        decoration: InputDecoration(
                          labelText: Strings.t('booking_select_time', l),
                          prefixIcon: const Icon(Icons.access_time),
                        ),
                        items: _timeSlots
                            .map((t) => DropdownMenuItem(value: t, child: Text(t, style: const TextStyle(fontSize: 14))))
                            .toList(),
                        onChanged: (v) => setState(() => _selectedTime = v),
                        validator: (v) => v == null ? Strings.t('booking_fill_required', l) : null,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Guests
                Row(
                  children: [
                    Text(Strings.t('booking_guests_count', l), style: const TextStyle(fontWeight: FontWeight.bold)),
                    const Spacer(),
                    IconButton(
                      icon: const Icon(Icons.remove_circle_outline),
                      onPressed: () => setState(() => _guestsCount = (_guestsCount - 1).clamp(1, 20)),
                    ),
                    Container(
                      width: 48, alignment: Alignment.center,
                      child: Text('$_guestsCount', style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Color(0xFF2E7D32))),
                    ),
                    IconButton(
                      icon: const Icon(Icons.add_circle_outline),
                      onPressed: () => setState(() => _guestsCount = (_guestsCount + 1).clamp(1, 20)),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Table Preference
                Text(Strings.t('booking_table_preference', l), style: const TextStyle(fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  runSpacing: 4,
                  children: _tablePrefs.map((p) {
                    final label = l == 'ru' ? p.labelRu : p.labelEn;
                    final selected = _tablePreference == p.value;
                    return ChoiceChip(
                      label: Text(label, style: const TextStyle(fontSize: 13)),
                      selected: selected,
                      onSelected: (_) => setState(() => _tablePreference = p.value),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 16),

                // Special Requests
                TextFormField(
                  controller: _requestsCtrl,
                  decoration: InputDecoration(
                    labelText: Strings.t('booking_special_requests', l),
                    hintText: Strings.t('booking_requests_placeholder', l),
                  ),
                  maxLines: 3,
                ),
                const SizedBox(height: 24),

                // Contact
                Text(Strings.t('booking_contact_info', l),
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _nameCtrl,
                  decoration: InputDecoration(labelText: Strings.t('common_name', l), prefixIcon: const Icon(Icons.person)),
                  validator: (v) => v!.isEmpty ? Strings.t('booking_fill_required', l) : null,
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _phoneCtrl,
                  decoration: InputDecoration(labelText: Strings.t('common_phone', l), prefixIcon: const Icon(Icons.phone)),
                  keyboardType: TextInputType.phone,
                  validator: (v) => v!.isEmpty ? Strings.t('booking_fill_required', l) : null,
                ),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _emailCtrl,
                  decoration: InputDecoration(labelText: Strings.t('common_email', l), prefixIcon: const Icon(Icons.email)),
                  keyboardType: TextInputType.emailAddress,
                ),
                const SizedBox(height: 24),

                SizedBox(
                  width: double.infinity,
                  child: FilledButton(
                    onPressed: _submitting ? null : _submit,
                    style: FilledButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 16)),
                    child: _submitting
                        ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                        : Text(Strings.t('booking_book_now', l)),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          Text(Strings.t('booking_contact_anna', l), style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Colors.grey)),
          Text(Strings.t('booking_confirmation_note', l), style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Colors.grey)),
        ],
      ),
    );
  }
}

class _TablePref {
  final String value;
  final String labelRu;
  final String labelEn;
  const _TablePref(this.value, this.labelRu, this.labelEn);
}