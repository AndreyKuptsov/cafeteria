import { MenuItem, CustomCake } from '../models/index.js';
import { syncDatabase } from '../models/index.js';

const menuItems = [
  // ЗАВТРАКИ ВЕСЬ ДЕНЬ
  {
    name_ru: 'Овсяная каша с ягодами',
    name_en: 'Oatmeal with Berries',
    description_ru: 'Нежная овсяная каша на молоке с клубникой, черникой и медом',
    description_en: 'Tender oatmeal with milk, strawberries, blueberries and honey',
    category: 'breakfast',
    price: 350,
    image_url: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=800',
    available: true,
    is_featured: true,
    allergens: ['молоко', 'глютен'],
    nutritional_info: { calories: 320, protein: 12, carbs: 58, fat: 6 }
  },
  {
    name_ru: 'Яичница с беконом',
    name_en: 'Eggs with Bacon',
    description_ru: 'Классическая яичница из 2 яиц с хрустящим беконом и тостами',
    description_en: 'Classic scrambled eggs with crispy bacon and toast',
    category: 'breakfast',
    price: 420,
    image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800',
    available: true,
    is_featured: false,
    allergens: ['яйца', 'глютен'],
    nutritional_info: { calories: 480, protein: 28, carbs: 24, fat: 32 }
  },
  {
    name_ru: 'Сырная запеканка',
    name_en: 'Cheese Casserole',
    description_ru: 'Домашняя творожная запеканка со сметаной и изюмом',
    description_en: 'Homemade cottage cheese casserole with sour cream and raisins',
    category: 'breakfast',
    price: 380,
    image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800',
    available: true,
    is_featured: false,
    allergens: ['молоко', 'яйца', 'глютен'],
    nutritional_info: { calories: 420, protein: 18, carbs: 45, fat: 18 }
  },
  {
    name_ru: 'Блины с клубникой',
    name_en: 'Pancakes with Strawberries',
    description_ru: 'Тонкие блинчики со свежей клубникой и взбитыми сливками',
    description_en: 'Thin pancakes with fresh strawberries and whipped cream',
    category: 'breakfast',
    price: 450,
    image_url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800',
    available: true,
    is_featured: true,
    allergens: ['молоко', 'яйца', 'глютен'],
    nutritional_info: { calories: 520, protein: 14, carbs: 68, fat: 22 }
  },

  // ИЗЫСКАННЫЕ ДЕСЕРТЫ
  {
    name_ru: 'Торт Наполеон',
    name_en: 'Napoleon Cake',
    description_ru: 'Классический слоеный торт с заварным кремом',
    description_en: 'Classic puff pastry cake with custard cream',
    category: 'desserts',
    price: 280,
    image_url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800',
    available: true,
    is_featured: true,
    allergens: ['молоко', 'яйца', 'глютен'],
    nutritional_info: { calories: 380, protein: 6, carbs: 48, fat: 18 }
  },
  {
    name_ru: 'Мамин медовик',
    name_en: 'Mom\'s Honey Cake',
    description_ru: 'Домашний медовый торт по семейному рецепту',
    description_en: 'Homemade honey cake from family recipe',
    category: 'desserts',
    price: 320,
    image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800',
    available: true,
    is_featured: true,
    allergens: ['молоко', 'яйца', 'глютен', 'мед'],
    nutritional_info: { calories: 420, protein: 7, carbs: 58, fat: 20 }
  },
  {
    name_ru: 'Лавандовое парфе',
    name_en: 'Lavender Parfait',
    description_ru: 'Нежное парфе с лавандой и клубникой',
    description_en: 'Delicate parfait with lavender and strawberries',
    category: 'desserts',
    price: 380,
    image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800',
    available: true,
    is_featured: true,
    allergens: ['молоко', 'яйца'],
    nutritional_info: { calories: 320, protein: 5, carbs: 42, fat: 16 }
  },
  {
    name_ru: 'Шарлотка с яблоками',
    name_en: 'Apple Charlotte',
    description_ru: 'Классическая яблочная шарлотка с корицей',
    description_en: 'Classic apple charlotte with cinnamon',
    category: 'desserts',
    price: 250,
    image_url: 'https://images.unsplash.com/photo-1587241321921-91a834d82e01?w=800',
    available: true,
    is_featured: false,
    allergens: ['яйца', 'глютен'],
    nutritional_info: { calories: 280, protein: 5, carbs: 48, fat: 8 }
  },
  {
    name_ru: 'Тирамису',
    name_en: 'Tiramisu',
    description_ru: 'Итальянский десерт с маскарпоне и кофе',
    description_en: 'Italian dessert with mascarpone and coffee',
    category: 'desserts',
    price: 420,
    image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800',
    available: true,
    is_featured: true,
    allergens: ['молоко', 'яйца', 'глютен'],
    nutritional_info: { calories: 450, protein: 8, carbs: 52, fat: 24 }
  },

  // СВЕЖИЕ САЛАТЫ
  {
    name_ru: 'Цезарь с лососем',
    name_en: 'Caesar with Salmon',
    description_ru: 'Салат Цезарь с копченым лососем, пармезаном и соусом',
    description_en: 'Caesar salad with smoked salmon, parmesan and dressing',
    category: 'salads',
    price: 580,
    image_url: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800',
    available: true,
    is_featured: true,
    allergens: ['рыба', 'молоко', 'яйца', 'глютен'],
    nutritional_info: { calories: 420, protein: 28, carbs: 18, fat: 28 }
  },
  {
    name_ru: 'Цезарь с креветками',
    name_en: 'Caesar with Shrimp',
    description_ru: 'Салат Цезарь с тигровыми креветками',
    description_en: 'Caesar salad with tiger shrimp',
    category: 'salads',
    price: 620,
    image_url: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=800',
    available: true,
    is_featured: true,
    allergens: ['морепродукты', 'молоко', 'яйца', 'глютен'],
    nutritional_info: { calories: 380, protein: 32, carbs: 16, fat: 22 }
  },
  {
    name_ru: 'Телятина в сливках',
    name_en: 'Veal in Cream Sauce',
    description_ru: 'Нежная телятина в сливочном соусе с овощами',
    description_en: 'Tender veal in cream sauce with vegetables',
    category: 'salads',
    price: 680,
    image_url: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800',
    available: true,
    is_featured: false,
    allergens: ['молоко'],
    nutritional_info: { calories: 520, protein: 38, carbs: 12, fat: 36 }
  },

  // СУПЧИКИ
  {
    name_ru: 'Тыквенный суп-пюре',
    name_en: 'Pumpkin Cream Soup',
    description_ru: 'Нежный крем-суп из тыквы с сливками и семечками',
    description_en: 'Delicate pumpkin cream soup with cream and seeds',
    category: 'soups',
    price: 380,
    image_url: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=800',
    available: true,
    is_featured: true,
    allergens: ['молоко'],
    nutritional_info: { calories: 280, protein: 6, carbs: 32, fat: 14 }
  },
  {
    name_ru: 'Борщ домашний',
    name_en: 'Homemade Borscht',
    description_ru: 'Классический борщ со сметаной и пампушками',
    description_en: 'Classic borscht with sour cream and garlic bread',
    category: 'soups',
    price: 350,
    image_url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800',
    available: true,
    is_featured: false,
    allergens: ['молоко', 'глютен'],
    nutritional_info: { calories: 320, protein: 12, carbs: 38, fat: 14 }
  },

  // ЛИНГВИНИ И ПАСТА
  {
    name_ru: 'Лингвини Карбонара',
    name_en: 'Linguine Carbonara',
    description_ru: 'Классическая паста с беконом, яйцом и пармезаном',
    description_en: 'Classic pasta with bacon, egg and parmesan',
    category: 'pasta',
    price: 520,
    image_url: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800',
    available: true,
    is_featured: true,
    allergens: ['глютен', 'яйца', 'молоко'],
    nutritional_info: { calories: 680, protein: 28, carbs: 72, fat: 32 }
  },
  {
    name_ru: 'Лингвини с тигровыми креветками',
    name_en: 'Linguine with Tiger Shrimp',
    description_ru: 'Паста с креветками в сливочно-чесночном соусе',
    description_en: 'Pasta with shrimp in creamy garlic sauce',
    category: 'pasta',
    price: 680,
    image_url: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800',
    available: true,
    is_featured: true,
    allergens: ['глютен', 'морепродукты', 'молоко'],
    nutritional_info: { calories: 620, protein: 32, carbs: 68, fat: 24 }
  },
  {
    name_ru: 'Паста Болоньезе',
    name_en: 'Pasta Bolognese',
    description_ru: 'Спагетти с мясным соусом по-итальянски',
    description_en: 'Spaghetti with Italian meat sauce',
    category: 'pasta',
    price: 480,
    image_url: 'https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=800',
    available: true,
    is_featured: false,
    allergens: ['глютен', 'молоко'],
    nutritional_info: { calories: 580, protein: 26, carbs: 64, fat: 24 }
  },

  // ДОМАШНЯЯ СЫТНАЯ КУХНЯ
  {
    name_ru: 'Фрикадельки из индейки',
    name_en: 'Turkey Meatballs',
    description_ru: 'Нежные фрикадельки из индейки в томатном соусе',
    description_en: 'Tender turkey meatballs in tomato sauce',
    category: 'main',
    price: 480,
    image_url: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800',
    available: true,
    is_featured: false,
    allergens: ['глютен', 'яйца'],
    nutritional_info: { calories: 420, protein: 32, carbs: 28, fat: 20 }
  },
  {
    name_ru: 'Пельмени ручной лепки',
    name_en: 'Handmade Dumplings',
    description_ru: 'Домашние пельмени со сметаной',
    description_en: 'Homemade dumplings with sour cream',
    category: 'main',
    price: 420,
    image_url: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=800',
    available: true,
    is_featured: true,
    allergens: ['глютен', 'яйца', 'молоко'],
    nutritional_info: { calories: 520, protein: 24, carbs: 58, fat: 22 }
  },
  {
    name_ru: 'Беф-строганов',
    name_en: 'Beef Stroganoff',
    description_ru: 'Классический беф-строганов с грибами и сливками',
    description_en: 'Classic beef stroganoff with mushrooms and cream',
    category: 'main',
    price: 620,
    image_url: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=800',
    available: true,
    is_featured: true,
    allergens: ['молоко'],
    nutritional_info: { calories: 580, protein: 36, carbs: 24, fat: 38 }
  },

  // НАПИТКИ
  {
    name_ru: 'Капучино',
    name_en: 'Cappuccino',
    description_ru: '100% Арабика с молочной пенкой',
    description_en: '100% Arabica with milk foam',
    category: 'drinks',
    price: 180,
    image_url: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800',
    available: true,
    is_featured: true,
    allergens: ['молоко'],
    nutritional_info: { calories: 120, protein: 6, carbs: 12, fat: 6 }
  },
  {
    name_ru: 'Латте',
    name_en: 'Latte',
    description_ru: 'Эспрессо с молоком и латте-артом',
    description_en: 'Espresso with milk and latte art',
    category: 'drinks',
    price: 200,
    image_url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800',
    available: true,
    is_featured: false,
    allergens: ['молоко'],
    nutritional_info: { calories: 150, protein: 8, carbs: 14, fat: 8 }
  },
  {
    name_ru: 'Смузи клубничный',
    name_en: 'Strawberry Smoothie',
    description_ru: 'Свежий смузи из клубники, банана и йогурта',
    description_en: 'Fresh smoothie with strawberry, banana and yogurt',
    category: 'drinks',
    price: 280,
    image_url: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=800',
    available: true,
    is_featured: true,
    allergens: ['молоко'],
    nutritional_info: { calories: 220, protein: 6, carbs: 42, fat: 4 }
  },
  {
    name_ru: 'Чай фирменный',
    name_en: 'Signature Tea',
    description_ru: 'Авторский чай с ягодами и травами',
    description_en: 'Signature tea with berries and herbs',
    category: 'drinks',
    price: 150,
    image_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800',
    available: true,
    is_featured: false,
    allergens: [],
    nutritional_info: { calories: 5, protein: 0, carbs: 1, fat: 0 }
  }
];

const customCakes = [
  {
    name_ru: 'Лавандовый бисквит',
    name_en: 'Lavender Sponge Cake',
    description_ru: 'Нежный бисквит с лавандой и клубничным кремом',
    description_en: 'Delicate sponge cake with lavender and strawberry cream',
    base_price: 2500,
    image_url: 'https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=800',
    available: true,
    is_featured: true,
    sizes: ['1 кг', '1.5 кг', '2 кг', '3 кг'],
    decorations: ['свежие ягоды', 'цветы', 'макаруны', 'шоколадный декор'],
    allergens: ['молоко', 'яйца', 'глютен']
  },
  {
    name_ru: 'Три шоколада',
    name_en: 'Three Chocolates',
    description_ru: 'Роскошный торт из белого, молочного и темного шоколада',
    description_en: 'Luxurious cake with white, milk and dark chocolate',
    base_price: 3000,
    image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800',
    available: true,
    is_featured: true,
    sizes: ['1 кг', '1.5 кг', '2 кг', '3 кг'],
    decorations: ['шоколадные завитки', 'ягоды', 'золотой декор', 'макаруны'],
    allergens: ['молоко', 'яйца', 'глютен', 'соя']
  },
  {
    name_ru: 'Бурбоновый мусс',
    name_en: 'Bourbon Mousse',
    description_ru: 'Изысканный муссовый торт с бурбоном и карамелью',
    description_en: 'Exquisite mousse cake with bourbon and caramel',
    base_price: 3500,
    image_url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800',
    available: true,
    is_featured: true,
    sizes: ['1 кг', '1.5 кг', '2 кг'],
    decorations: ['карамельный декор', 'орехи', 'золотая пыль'],
    allergens: ['молоко', 'яйца', 'орехи', 'алкоголь']
  },
  {
    name_ru: 'Панакотта-торт',
    name_en: 'Panna Cotta Cake',
    description_ru: 'Легкий торт на основе панакотты с ягодами',
    description_en: 'Light cake based on panna cotta with berries',
    base_price: 2800,
    image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800',
    available: true,
    is_featured: false,
    sizes: ['1 кг', '1.5 кг', '2 кг', '3 кг'],
    decorations: ['свежие ягоды', 'мятные листья', 'съедобные цветы'],
    allergens: ['молоко']
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Синхронизация базы данных
    await syncDatabase();

    // Очистка существующих данных
    console.log('🗑️  Clearing existing menu items...');
    await MenuItem.destroy({ where: {} });
    await CustomCake.destroy({ where: {} });

    // Добавление блюд меню
    console.log('📋 Adding menu items...');
    for (const item of menuItems) {
      await MenuItem.create(item);
      console.log(`  ✓ ${item.name_ru} (${item.category})`);
    }

    // Добавление тортов на заказ
    console.log('\n🍰 Adding custom cakes...');
    for (const cake of customCakes) {
      await CustomCake.create(cake);
      console.log(`  ✓ ${cake.name_ru}`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 Statistics:`);
    console.log(`   Menu items: ${menuItems.length}`);
    console.log(`   - Breakfast: ${menuItems.filter(i => i.category === 'breakfast').length}`);
    console.log(`   - Desserts: ${menuItems.filter(i => i.category === 'desserts').length}`);
    console.log(`   - Salads: ${menuItems.filter(i => i.category === 'salads').length}`);
    console.log(`   - Soups: ${menuItems.filter(i => i.category === 'soups').length}`);
    console.log(`   - Pasta: ${menuItems.filter(i => i.category === 'pasta').length}`);
    console.log(`   - Main dishes: ${menuItems.filter(i => i.category === 'main').length}`);
    console.log(`   - Drinks: ${menuItems.filter(i => i.category === 'drinks').length}`);
    console.log(`   Custom cakes: ${customCakes.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🌐 You can now view the menu at: http://localhost:3000/menu');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
