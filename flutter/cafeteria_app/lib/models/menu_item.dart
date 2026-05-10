class MenuItem {
  final int id;
  final String nameRu;
  final String nameEn;
  final String descriptionRu;
  final String descriptionEn;
  final double price;
  final String category;
  final String? imageUrl;
  final bool available;
  final bool isFeatured;
  final List<String> allergens;
  final NutritionalInfo? nutritionalInfo;

  MenuItem({
    required this.id,
    required this.nameRu,
    required this.nameEn,
    required this.descriptionRu,
    required this.descriptionEn,
    required this.price,
    required this.category,
    this.imageUrl,
    required this.available,
    required this.isFeatured,
    required this.allergens,
    this.nutritionalInfo,
  });

  factory MenuItem.fromJson(Map<String, dynamic> json) {
    List<String> allergensList = [];
    if (json['allergens'] != null) {
      if (json['allergens'] is List) {
        allergensList = List<String>.from(json['allergens']);
      }
    }

    return MenuItem(
      id: json['id'] as int,
      nameRu: json['name_ru'] as String,
      nameEn: json['name_en'] as String,
      descriptionRu: json['description_ru'] as String? ?? '',
      descriptionEn: json['description_en'] as String? ?? '',
      price: (json['price'] as num).toDouble(),
      category: json['category'] as String,
      imageUrl: json['image_url'] as String?,
      available: json['available'] as bool? ?? true,
      isFeatured: json['is_featured'] as bool? ?? false,
      allergens: allergensList,
      nutritionalInfo: json['nutritional_info'] != null
          ? NutritionalInfo.fromJson(json['nutritional_info'] as Map<String, dynamic>)
          : null,
    );
  }

  String getName(String locale) => locale == 'ru' ? nameRu : nameEn;
  String getDescription(String locale) => locale == 'ru' ? descriptionRu : descriptionEn;
}

class NutritionalInfo {
  final int calories;
  final double protein;
  final double carbs;
  final double fat;

  NutritionalInfo({
    required this.calories,
    required this.protein,
    required this.carbs,
    required this.fat,
  });

  factory NutritionalInfo.fromJson(Map<String, dynamic> json) {
    return NutritionalInfo(
      calories: (json['calories'] as num).toInt(),
      protein: (json['protein'] as num).toDouble(),
      carbs: (json['carbs'] as num).toDouble(),
      fat: (json['fat'] as num).toDouble(),
    );
  }
}
