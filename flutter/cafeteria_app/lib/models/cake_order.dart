class CakeOrderRequest {
  final int cakeId;
  final String cakeName;
  final String size;
  final String weight;
  final List<String> decorations;
  final String inscription;
  final String specialRequests;
  final String deliveryDate;
  final String deliveryTime;
  final String deliveryAddress;
  final String customerName;
  final String customerPhone;
  final String customerEmail;
  final double price;

  CakeOrderRequest({
    required this.cakeId,
    required this.cakeName,
    required this.size,
    required this.weight,
    required this.decorations,
    required this.inscription,
    required this.specialRequests,
    required this.deliveryDate,
    required this.deliveryTime,
    required this.deliveryAddress,
    required this.customerName,
    required this.customerPhone,
    required this.customerEmail,
    required this.price,
  });

  Map<String, dynamic> toJson() => {
        'cake_id': cakeId,
        'cake_name': cakeName,
        'size': size,
        'weight': weight,
        'decorations': decorations,
        'inscription': inscription,
        'special_requests': specialRequests,
        'delivery_date': deliveryDate,
        'delivery_time': deliveryTime,
        'delivery_address': deliveryAddress,
        'customer_name': customerName,
        'customer_phone': customerPhone,
        'customer_email': customerEmail,
        'price': price,
      };
}

class CakeOrderResponse {
  final int id;
  final String orderNumber;
  final String status;

  CakeOrderResponse({
    required this.id,
    required this.orderNumber,
    required this.status,
  });

  factory CakeOrderResponse.fromJson(Map<String, dynamic> json) {
    return CakeOrderResponse(
      id: json['id'] as int,
      orderNumber: json['order_number'] as String,
      status: json['status'] as String? ?? 'pending',
    );
  }
}
