class OrderRequest {
  final String orderType; // 'delivery', 'pickup', 'dine_in'
  final List<Map<String, dynamic>> items;
  final double totalAmount;
  final String? deliveryAddress;
  final String customerName;
  final String customerPhone;
  final String customerEmail;
  final String paymentMethod; // 'card', 'cash', 'sbp'
  final String? specialInstructions;

  OrderRequest({
    required this.orderType,
    required this.items,
    required this.totalAmount,
    this.deliveryAddress,
    required this.customerName,
    required this.customerPhone,
    required this.customerEmail,
    required this.paymentMethod,
    this.specialInstructions,
  });

  Map<String, dynamic> toJson() => {
        'order_type': orderType,
        'items': items,
        'total_amount': totalAmount,
        'delivery_address': deliveryAddress,
        'customer_name': customerName,
        'customer_phone': customerPhone,
        'customer_email': customerEmail,
        'payment_method': paymentMethod,
        'special_instructions': specialInstructions,
      };
}

class OrderResponse {
  final int id;
  final String orderNumber;
  final String status;

  OrderResponse({
    required this.id,
    required this.orderNumber,
    required this.status,
  });

  factory OrderResponse.fromJson(Map<String, dynamic> json) {
    return OrderResponse(
      id: json['id'] as int,
      orderNumber: json['order_number'] as String,
      status: json['status'] as String? ?? 'pending',
    );
  }
}
