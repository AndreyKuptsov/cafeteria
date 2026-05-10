class CartItem {
  final int id;
  final String name;
  final double price;
  final String? image;
  final String type; // 'menu_item'
  int quantity;

  CartItem({
    required this.id,
    required this.name,
    required this.price,
    this.image,
    required this.type,
    this.quantity = 1,
  });

  double get total => price * quantity;

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'price': price,
        'image': image,
        'type': type,
        'quantity': quantity,
      };

  factory CartItem.fromJson(Map<String, dynamic> json) {
    return CartItem(
      id: json['id'] as int,
      name: json['name'] as String,
      price: (json['price'] as num).toDouble(),
      image: json['image'] as String?,
      type: json['type'] as String? ?? 'menu_item',
      quantity: json['quantity'] as int? ?? 1,
    );
  }
}
