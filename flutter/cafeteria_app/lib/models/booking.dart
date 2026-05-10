class BookingRequest {
  final String bookingDate;
  final String bookingTime;
  final int guestsCount;
  final String tablePreference;
  final String specialRequests;
  final String customerName;
  final String customerPhone;
  final String customerEmail;

  BookingRequest({
    required this.bookingDate,
    required this.bookingTime,
    required this.guestsCount,
    required this.tablePreference,
    required this.specialRequests,
    required this.customerName,
    required this.customerPhone,
    required this.customerEmail,
  });

  Map<String, dynamic> toJson() => {
        'booking_date': bookingDate,
        'booking_time': bookingTime,
        'guests_count': guestsCount,
        'table_preference': tablePreference,
        'special_requests': specialRequests,
        'customer_name': customerName,
        'customer_phone': customerPhone,
        'customer_email': customerEmail,
      };
}

class BookingResponse {
  final int id;
  final String bookingNumber;
  final String status;

  BookingResponse({
    required this.id,
    required this.bookingNumber,
    required this.status,
  });

  factory BookingResponse.fromJson(Map<String, dynamic> json) {
    return BookingResponse(
      id: json['id'] as int,
      bookingNumber: json['booking_number'] as String,
      status: json['status'] as String? ?? 'pending',
    );
  }
}
