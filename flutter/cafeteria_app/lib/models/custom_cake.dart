class CustomCake {
  final int id;
  final String nameRu;
  final String nameEn;
  final String descriptionRu;
  final String descriptionEn;
  final double basePrice;
  final String? imageUrl;
  final List<String> sizes;
  final List<String> decorations;
  final int minOrderDays;
  final bool available;
  final bool isFeatured;

  CustomCake({
    required this.id,
    required this.nameRu,
    required this.nameEn,
    required this.descriptionRu,
    required this.descriptionEn,
    required this.basePrice,
    this.imageUrl,
    required this.sizes,
    required this.decorations,
    required this.minOrderDays,
    required this.available,
    required this.isFeatured,
  });

  factory CustomCake.fromJson(Map<String, dynamic> json) {
    List<String> parseList(dynamic val) {
      if (val == null) return [];
      if (val is List) return List<String>.from(val);
      return [];
    }

    return CustomCake(
      id: json['id'] as int,
      nameRu: json['name_ru'] as String,
      nameEn: json['name_en'] as String,
      descriptionRu: json['description_ru'] as String? ?? '',
      descriptionEn: json['description_en'] as String? ?? '',
      basePrice: (json['base_price'] as num).toDouble(),
      imageUrl: json['image_url'] as String?,
      sizes: parseList(json['sizes']),
      decorations: parseList(json['decorations']),
      minOrderDays: json['min_order_days'] as int? ?? 3,
      available: json['available'] as bool? ?? true,
      isFeatured: json['is_featured'] as bool? ?? false,
    );
  }

  String getName(String locale) => locale == 'ru' ? nameRu : nameEn;
  String getDescription(String locale) => locale == 'ru' ? descriptionRu : descriptionEn;

  double calculatePrice(String size, List<String> selectedDecorations) {
    double multiplier = 1.0;
    if (size == '3 кг') multiplier = 1.5;
    else if (size == '2 кг') multiplier = 1.3;
    else if (size == '1.5 кг') multiplier = 1.15;
    final decorationPrice = selectedDecorations.length * 200.0;
    return (basePrice * multiplier + decorationPrice).roundToDouble();
  }
}
