import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../models/menu_item.dart';
import '../models/custom_cake.dart';
import '../models/booking.dart';
import '../models/order.dart';
import '../models/cake_order.dart';

class ApiException implements Exception {
  final int statusCode;
  final String message;
  ApiException(this.statusCode, this.message);
  @override
  String toString() => message;
}

class ApiService {
  static const String _baseUrl = 'http://10.0.2.2:5000/api';
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  String? _token;

  void setToken(String? token) => _token = token;

  Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        if (_token != null) 'Authorization': 'Bearer $_token',
      };

  Future<T> _request<T>(
    String method,
    String path, {
    Map<String, dynamic>? body,
    required T Function(dynamic json) parser,
  }) async {
    final uri = Uri.parse('$_baseUrl$path');
    late http.Response response;

    try {
      switch (method) {
        case 'GET':
          response = await http.get(uri, headers: _headers).timeout(const Duration(seconds: 15));
          break;
        case 'POST':
          response = await http
              .post(uri, headers: _headers, body: body != null ? jsonEncode(body) : null)
              .timeout(const Duration(seconds: 15));
          break;
        case 'PUT':
          response = await http
              .put(uri, headers: _headers, body: body != null ? jsonEncode(body) : null)
              .timeout(const Duration(seconds: 15));
          break;
        default:
          throw ApiException(0, 'Unsupported method: $method');
      }
    } on SocketException {
      throw ApiException(0, 'Нет подключения к серверу. Проверьте соединение.');
    } on http.ClientException {
      throw ApiException(0, 'Ошибка сети. Попробуйте позже.');
    }

    final decoded = _decodeResponse(response);
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return parser(decoded);
    }
    throw ApiException(response.statusCode, decoded is Map ? decoded['error'] ?? 'Неизвестная ошибка' : 'Ошибка $response.statusCode');
  }

  dynamic _decodeResponse(http.Response response) {
    try {
      return jsonDecode(utf8.decode(response.bodyBytes));
    } catch (_) {
      return response.body;
    }
  }

  // ── Menu ──

  Future<List<MenuItem>> getMenuItems({String? category}) async {
    final query = category != null ? '?category=$category' : '';
    return _request('GET', '/menu$query', parser: (data) {
      if (data is! List) return [];
      return data.map((e) => MenuItem.fromJson(e as Map<String, dynamic>)).toList();
    });
  }

  // ── Cakes ──

  Future<List<CustomCake>> getCakes() async {
    return _request('GET', '/cakes', parser: (data) {
      if (data is! List) return [];
      return data.map((e) => CustomCake.fromJson(e as Map<String, dynamic>)).toList();
    });
  }

  Future<CakeOrderResponse> placeCakeOrder(CakeOrderRequest request) async {
    return _request('POST', '/cakes/orders', body: request.toJson(), parser: (data) {
      return CakeOrderResponse.fromJson(data as Map<String, dynamic>);
    });
  }

  // ── Bookings ──

  Future<BookingResponse> createBooking(BookingRequest request) async {
    return _request('POST', '/bookings', body: request.toJson(), parser: (data) {
      return BookingResponse.fromJson(data as Map<String, dynamic>);
    });
  }

  // ── Orders ──

  Future<OrderResponse> createOrder(OrderRequest request) async {
    return _request('POST', '/orders', body: request.toJson(), parser: (data) {
      return OrderResponse.fromJson(data as Map<String, dynamic>);
    });
  }

  // ── Auth ──

  Future<Map<String, dynamic>> login(String login, String password) async {
    return _request('POST', '/auth/login', body: {'login': login, 'password': password}, parser: (data) {
      return data as Map<String, dynamic>;
    });
  }
}