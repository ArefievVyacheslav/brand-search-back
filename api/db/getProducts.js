const { MongoClient } = require('mongodb')
const client = new MongoClient('mongodb://localhost:27017')
const axios = require('axios')


module.exports = async function getProducts(paramsObj) {
  try {
    const result = []
    let products = null
    const paramsArrKeys = Object.keys(paramsObj)

    const { data } = await axios.get('https://api.sales-search.ru/api/selects')
    // const { data } = await axios.get('http://localhost:3001/api/selects')
    if (data.brands.includes('Все')) data.brands.splice(data.brands.indexOf('Все'), 1)
    if (data.sizes.includes('Все')) data.sizes.splice(data.sizes.indexOf('Все'), 1)

    const gender = { '-men': 'Мужской', '-women': 'Женский', '-unisex': 'unisex', '-child': 'Детский' }
    const category = { clothes: 'Одежда', '2-shoes': 'Обувь', accessories: 'Аксессуары'  }
    const subCategory = { 't-shirts': 'Футболки', 'polo-shirts': 'Футболки поло', hoodies: 'Толстовки', 'dresses-and-skirts': 'Платья и юбки', sweaters: 'Свитеры', shirts: 'Рубашки', 'underwear-and-shorts': 'Нижнее белье и шорты', 'new-clothes': 'Новинки', 'blouses-and-shirts': 'Блузы и рубашки', 'gym-shoes': 'Кеды', 'sneakers': 'Кроссовки', 'new-shoes': 'Новые поступления', boots: 'Ботинки', 'bags-backpacks-purses': 'Сумки, рюкзаки и кошельки', belts: 'Ремни', perfumery: 'Парфюмерия', caps: 'Кепки',
      casual: 'Casual',
      'a-silhouette': 'А-силуэт',
      anoraks: 'Анораки',
      blouses: 'Блузки',
      blous: 'Блузы',
      'blouses-with-print': 'Блузы с принтом',
      body: 'Боди',
      'boyfriends': 'Бойфренды',
      bombers: 'Бомберы',
      trousers: 'Брюки',
      'narrowed-trousers': 'Брюки зауженные',
      'trousers-and-shorts': 'Брюки и шорты',
      'cargo-pants': 'Брюки карго',
      'classic-trousers': 'Брюки классические',
      'leather-trousers': 'Брюки кожаные',
      'casual-Trousers': 'Брюки повседневные',
      'straight-Trousers': 'Брюки прямые',
      'high-rise-trousers': 'Брюки с высокой посадкой',
      'loose-fitting-trousers': 'Брюки свободный крой',
      'slacks-trousers': 'Брюки слаксы',
      'trousers-with-a-standard-fit': 'Брюки со стандартной посадкой',
      'sports-trousers': 'Брюки спортивные',
      'cropped-trousers': 'Брюки укороченные',
      'insulated-trousers': 'Брюки утепленные',
      'cotton-Trousers': 'Брюки хлопковые',
      'chinos-trousers': 'Брюки чиносы',
      'wide-trousers': 'Брюки широкие',
      'cargo-Trousers': 'Брюки-карго',
      bras: 'Бюстгальтеры',
      'into-the-cage': 'В клетку',
      striped: 'В полоску',
      outerwear: 'Верхняя одежда',
      windbreakers: 'Ветровки',
      turtlenecks: 'Водолазки',
      'long-Turtlenecks': 'Водолазки длинные',
      'plain-Turtlenecks': 'Водолазки однотонные',
      'knitted': 'Вязаные',
      'ties-and-bow-ties': 'Галстуки и бабочки',
      'jeggings': 'Джеггинсы',
      'jumpers': 'Джемперы',
      'jeans': 'Джинсы',
      'boyfriend-jeans': 'Джинсы бойфренды',
      'jeans-high-rise': 'Джинсы высокая посадка',
      'zayjenny-jeans': 'Джинсы зауженные',
      'zipper-jeans': 'Джинсы на молнии',
      'straight-Jeans': 'Джинсы прямые',
      'skinny-jeans': 'Джинсы скинни',
      'cropped-Jeans': 'Джинсы укороченные',
      'wide-Jeans': 'Джинсы широкие',
      'mom-Jeans': 'Джинсы-момы',
      'joggers': 'Джоггеры',
      'for-girls': 'Для девочек',
      'for-boys': 'Для мальчиков',
      'raincoats': 'Дождевики',
      'home-Trousers': 'Домашние брюки',
      'home-Shorts': 'Домашние шорты',
      'home-clothes': 'Домашняя одежда',
      'jackets': 'Жакеты',
      'jackets and jackets': 'Жакеты и пиджаки',
      'Vests': 'Жилеты',
      'Denim-Vests': 'Жилеты джинсовые',
      'Classic-Vests': 'Жилеты классические',
      'Fur-Vests': 'Жилеты меховые',
      'quilted-Vests': 'Жилеты стеганые',
      'quilted-vests': 'Жилеты стёганые',
      'Knitted-Vests': 'Жилеты трикотажные',
      'Elongated-Vests': 'Жилеты удлиненные',
      'Insulated-Vests': 'Жилеты утепленные',
      'Narrowed': 'Зауженные',
      'Cardigans': 'Кардиганы',
      'Long-Cardigan': 'Кардиганы длинные',
      'Zip-up-Cardigans': 'Кардиганы на молнии',
      'Button-down-Cardigans': 'Кардиганы на пуговицах',
      'Oversize-Cardigans': 'Кардиганы оверсайз',
      'Caps': 'Кепки',
      'Classic': 'Классические',
      'Flared': 'Клеш',
      'Flareed': 'Клёш',
      'Leather': 'Кожаные',
      'Overalls': 'Комбинезоны',
      'Demi-season-overalls': 'Комбинезоны демисезонные',
      'Denim-overalls': 'Комбинезоны джинсовые',
      'Overalls-with-trousers': 'Комбинезоны с брюками',
      'Overalls-with-shorts': 'Комбинезоны с шортами',
      'Suits': 'Костюмы',
      'Suits-and-jackets': 'Костюмы и жакеты',
      'Classic-suits': 'Костюмы классические',
      'Suits-with-trousers': 'Костюмы с брюками',
      'Suits-with-skirt': 'Костюмы с юбкой',
      'Sports-suits': 'Костюмы спортивные',
      'Swimwear': 'Купальники',
      'kurtki': 'Куртки',
      'Demi-season-jackets': 'Куртки демисезонные',
      'Denim-jackets': 'Куртки джинсовые',
      'Winter-jackets': 'Куртки зимние',
      'Leather-jackets': 'Куртки кожаные',
      'Fur-jackets': 'Куртки меховые',
      'Oversize-jackets': 'Куртки оверсайз',
      'Hooded-jackets': 'Куртки с капюшоном',
      'Cropped-Jackets': 'Куртки укороченные',
      'Culottes': 'Кюлоты',
      'Leggings': 'Леггинсы',
      'Sports-Leggings': 'Леггинсы спортивные',
      'Legings': 'Легинсы',
      'Insulated-Leggings': 'Легинсы утепленные',
      'Longsleeves': 'Лонгсливы',
      'Sports-leggings': 'Лосины спортивные',
      'mayki': 'Майки',
      'Maxi': 'Макси',
      'Midi': 'Миди',
      'Mini': 'Мини',
      'Soft': 'Мягкие',
      'Capes': 'Накидки',
      'Underwear-and-shorts': 'Нижнее белье и шорты',
      'New-items': 'Новинки',
      'Socks': 'Носки',
      'Socks-tights-knee-socks': 'Носки, колготки, гольфы',
      'Nightgowns': 'Ночные сорочки',
      'Clothes': 'Одежда',
      'Clothes-for-skiing': 'Одежда для горнолыжного спорта',
      'Clothes-for-home-and-sleep': 'Одежда для дома и сна',
      'Clothes-for-sports': 'Одежда для спорта',
      'Olympic': 'Олимпийки',
      'Autumn': 'Осенняя',
      'Coat': 'Пальто',
      'Casual-style-coat': 'Пальто в стиле casual',
      'Drape-coats': 'Пальто драповые',
      'Plain-coats': 'Пальто однотонные',
      'Panama-hats': 'Панамы',
      'Pareos': 'Парео',
      'Parkas': 'Парки',
      'Hooded-parks': 'Парки с капюшоном',
      'Elongated-parks': 'Парки удлиненные',
      'Pencil cases': 'Пеналы',
      'Negligees': 'Пеньюары',
      'Jackets': 'Пиджаки',
      'Button-down-jackets': 'Пиджаки на пуговицах',
      'Jackets-for-jeans': 'Пиджаки под джинсы',
      'Pajamas': 'Пижамы',
      'Pajamas-and-shirts': 'Пижамы и сорочки',
      'Dresses': 'Платья',
      'Sleeveless-dresses': 'Платья без рукавов',
      'Evening-dresses': 'Платья вечерние',
      'Denim-dresses': 'Платья джинсовые',
      'Dresses-and-sundresses': 'Платья и сарафаны',
      'Dresses-and-skirts': 'Платья и юбки',
      'Cocktail-dresses': 'Платья коктейльные',
      'Summer-dresses': 'Платья летние',
      'Office-dresses': 'Платья офисные',
      'Beach-dresses': 'Платья пляжные',
      'Dresses-casual': 'Платья повседневные',
      'Dresses-with-long-sleeves': 'Платья с длинным рукавом',
      'Dresses-with-short-sleeves': 'Платья с коротким рукавом',
      'Dresses-with-open-shoulders': 'Платья с открытыми плечами',
      'Shirt-dresses': 'Платья-рубашки',
      'Raincoats': 'Плащи',
      'Demi-season-raincoats': 'Плащи демисезонные',
      'Raincoats-and-trench-coats': 'Плащи и тренчи',
      'Beach-dresses-and-tunics': 'Пляжные платья и туники',
      'Polo': 'Поло',
      'Polo-long': 'Поло длинные',
      'Plain-Polo': 'Поло однотонные',
      'Long-Sleeve-Polo': 'Поло с длинным рукавом',
      'Short-sleeve-Polo': 'Поло с коротким рукавом',
      'Polo-with-print': 'Поло с принтом',
      'Poncho': 'Пончо',
      'Poncho-and-capes': 'Пончо и накидки',
      'Last-size': 'Последний размер',
      'Fitted': 'Приталенные',
      'Pullovers': 'Пуловеры',
      'Zip-Pullovers': 'Пуловеры на молнии',
      'With-V-neck-Pullovers': 'Пуловеры с v-образным вырезом',
      'Hooded-Pullovers': 'Пуловеры с капюшоном',
      'Round-neck-Pullovers': 'Пуловеры с круглым вырезом',
      'Down-jackets': 'Пуховики',
      'Demi-season-down-jackets': 'Пуховики демисезонные',
      'Oversize-down-jackets': 'Пуховики оверсайз',
      'Elongated-down-jackets': 'Пуховики удлиненные',
      'Fluffy': 'Пышные',
      'Multicolored': 'Разноцветные',
      'Shirts': 'Рубашки',
      'Denim-shirts': 'Рубашки джинсовые',
      'Shirts-and-shirts': 'Рубашки и сорочки',
      'Classic-shirts': 'Рубашки классические',
      'Oversize-shirts': 'Рубашки оверсайз',
      'Fitted-shirts': 'Рубашки приталенные',
      'Long-Sleeve-shirts': 'Рубашки с длинным рукавом',
      'Short-sleeve-shirts': 'Рубашки с коротким рукавом',
      'Elongated-shirts': 'Рубашки удлиненные',
      'Polo-shirts': 'Рубашки-поло',
      'High-waisted': 'С высокой талией',
      'Pinched': 'С защипами',
      'Low-rise': 'С низкой посадкой',
      'Sundresses': 'Сарафаны',
      'Sweaters': 'Свитеры',
      'Long-sleeve Sweaters': 'Свитеры с длинным рукавом',
      'Sweatshirts': 'Свитшоты',
      'Oversize-Sweatshirts': 'Свитшоты оверсайз',
      'Printed-Sweatshirts': 'Свитшоты с принтом',
      'Sweatshirts-elongated': 'Свитшоты удлиненные',
      'Skinny': 'Скинни',
      'Tuxedos': 'Смокинги',
      'Shirts-and-shirts-long': 'Сорочки и рубашки длинные',
      'Shirts-and-shirts-oversize': 'Сорочки и рубашки оверсайз',
      'Shirts-and-shirts-plain': 'Сорочки и рубашки однотонные',
      'Shirts-and-shirts-with-long-sleeves': 'Сорочки и рубашки с длинным рукавом',
      'Sportswear': 'Спортивная одежда',
      'Sports': 'Спортивные',
      'tracksuits': 'Спортивные костюмы',
      'Thermal-underwear': 'Термобелье',
      'Long-hoodies': 'Толстовки длинные',
      'Hoodies-and-sweatshirts': 'Толстовки и свитшоты',
      'Oversize-Hoodies': 'Толстовки оверсайз',
      'Solid-color-Hoodies': 'Толстовки однотонные',
      'Hooded-Hoodies': 'Толстовки с капюшоном',
      'Insulated-Hoodies': 'Толстовки утепленные',
      'Tops': 'Топы',
      'T-shirts-and-Tops': 'Топы и майки',
      'Sports-Tops': 'Топы спортивные',
      'Trapezoids': 'Трапеции',
      'Raincoats and Trench coats': 'Тренчи и плащи',
      'Knitwear': 'Трикотаж',
      'Knitted': 'Трикотажные',
      'Underpants': 'Трусы',
      'Tunics': 'Туники',
      'Casual style tunics': 'Туники в стиле casual',
      'Button-down tunics': 'Туники на пуговицах',
      'Shirt Tunics': 'Туники-рубашки',
      'Insulated vests': 'Утепленные жилеты',
      'T-shirts': 'Футболки',
      'Polos-shirts': 'Футболки Поло',
      'Casual-style-T-shirts': 'Футболки в стиле casual',
      'Long-T-shirts': 'Футболки длинные',
      'T-shirts-and-T-shirts': 'Футболки и майки',
      'Oversize-T-shirts': 'Футболки оверсайз',
      'Plain-T-shirts': 'Футболки однотонные',
      'Short-Sleeve-T-shirts': 'Футболки с коротким рукавом',
      'Printed-T-shirts': 'Футболки с принтом',
      'Sports-T-shirts': 'Футболки спортивные',
      'Narrow-T-shirts': 'Футболки узкие',
      'Khakis': 'Хаки',
      'Robes': 'Халаты',
      'Hoodies': 'Худи',
      'Long-Hoodies': 'Худи длинные',
      'Oversize-Hodies': 'Худи оверсайз',
      'Plain-Hoodies': 'Худи однотонные',
      'Insulated-Hodies': 'Худи утепленные',
      'Chinos': 'Чиносы',
      'Stockings-socks-tights': 'Чулки, носки, колготки',
      'Hats': 'Шапки',
      'School': 'Школа',
      'Shorts': 'Шорты',
      'Denim-shorts': 'Шорты джинсовые',
      'Casual-shorts': 'Шорты повседневные',
      'Sports-shorts': 'Шорты спортивные',
      'Pants-and-trousers': 'Штаны и брюки',
      'Fur-coats-and-sheepskin-coats': 'Шубы и дубленки',
      'Skirts': 'Юбки',
      'Skirts-without-a-pattern': 'Юбки без рисунка',
      'Gode-skirts': 'Юбки годе',
      'Denim-skirts': 'Юбки джинсовые',
      'Leather-skirts': 'Юбки кожаные',
      'Maxi-skirts': 'Юбки макси',
      'Midi-Skirts': 'Юбки миди',
      'Mini-Skirts': 'Юбки мини',
      'Pleated-Skirts': 'Юбки плиссированные',
      'Straight-skirts': 'Юбки прямые',
      'Narrow-skirts': 'Юбки узкие',
      'Wide-skirts': 'Юбки широкие',
      'Pencil-skirts': 'Юбки-карандаш',
      'Ballet-flats': 'Балетки',
      'Leather-ballet-flats': 'Балетки кожаные',
      'Without-laces': 'Без шнурков',
      'Sandals': 'Босоножки',
      'Sandals-with-heels': 'Босоножки на каблуке',
      'Wedge-sandals': 'Босоножки на танкетке',
      'Sandals-with-straps': 'Босоножки с ремешками',
      'Ankle-boots': 'Ботильоны',
      'Shoes-without-heels': 'Ботинки без каблука',
      'Leather-shoes': 'Ботинки кожаные',
      'Casual-shoes': 'Ботинки повседневные',
      'Bootsss': 'Ботфорты',
      'Brogues': 'Броги',
      'Urban': 'Городские',
      'Deserts': 'Дезерты',
      'Demi-season': 'Демисезонная',
      'Derby': 'Дерби',
      'Home-shoes': 'Домашняя обувь',
      'Dutiki': 'Дутики',
      'Womens-shoes': 'Женская обувь',
      'Casual-style-Sneakers': 'Кеды в стиле casual',
      'Light-sneakers': 'Кеды легкие',
      'Sneakers-with-laces': 'Кеды на шнурках',
      'Classic-shoes': 'Классические',
      'Sneakers': 'Кроссовки',
      'Casual-sneakers': 'Кроссовки в стиле casual',
      'Suede-sneakers': 'Кроссовки замшевые',
      'Summer': 'Летние',
      'Loafers': 'Лоферы',
      'Moonwalkers': 'Луноходы',
      'Mokasini': 'Мокасины',
      'Monki': 'Монки',
      'Mens-shoes': 'Мужская обувь',
      'Mules': 'Мюли',
      'High-heels': 'На высоком каблуке',
      'Heels': 'На каблуке',
      'Platform': 'На платформе',
      'Stiletto': 'На шпильке',
      'Fur-shoes': 'Обувь на меху',
      'Oxfords': 'Оксфорды',
      'Autumn-shoes': 'Осенняя',
      'Beach-shoes': 'Пляжная обувь',
      'Beachs-shoes': 'Пляжные',
      'Half-Bootss': 'Полуботинки',
      'Half-Boots': 'Полусапоги',
      'Last-size-shoes': 'Последний размер',
      'Open-nose': 'С открытым носом',
      'Clogs': 'Сабо',
      'Sandalses': 'Сандалии',
      'Leather-Sandals': 'Сандалии кожаные',
      'Boots': 'Сапоги',
      'Boots-Half Boots': 'Сапоги, Полусапожки',
      'Slates': 'Сланцы',
      'Slip-ons': 'Слипоны',
      'Slip-ons-without-heels': 'Слипоны без каблука',
      'Slip-ons-in-casual-style': 'Слипоны в стиле casual',
      'Sneakerss': 'Сникеры',
      'Sportss': 'Спортивные',
      'Sports-shoes': 'Спортивные ботинки',
      'Shoe-products': 'Средства для обуви',
      'Slippers': 'Тапочки',
      'Topsiders': 'Топсайдеры',
      'Shoes': 'Туфли',
      'Shoess-without-heels': 'Туфли без каблука',
      'Shoes-with-heels': 'Туфли на каблуке',
      'Ugg-boots': 'Угги',
      'Ugg-boots-and-unts': 'Угги и унты',
      'Hightops': 'Хайтопы',
      'Chelsea': 'Челси',
      'Flip-flops': 'Шлепанцы',
      'Leather-Flip-flops': 'Шлепанцы кожаные',
      'Espadrilles': 'Эспадрильи',
      'Hair-accessories': 'Аксессуары для волос',
      'Accessories-for-shoes-and-bags': 'Аксессуары для обуви и сумок',
      'Fragrances': 'Ароматы',
      'Bandanas': 'Банданы',
      'Berets': 'Береты',
      'Costume-jewelry': 'Бижутерия',
      'Bracelets': 'Браслеты',
      'Key-rings': 'Брелоки',
      'Brooches': 'Броши',
      'Evening-bags': 'Вечерние сумки',
      'Collars': 'Воротники',
      'Collars-and-Cuffs': 'Воротники и манжеты',
      'Ties': 'Галстуки',
      'Hatsss': 'Головные уборы',
      'Knee-socks': 'Гольфы',
      'Hair': 'Для волос',
      'Travel-bags': 'Дорожные сумки',
      'Cufflinks': 'Запонки',
      'Protective-masks': 'Защитные маски',
      'From-eco-leather': 'Из экокожи',
      'Capss': 'Кепки',
      'Classic-socks': 'Классические носки',
      'Clutches': 'Клатчи',
      'Clutches-and-evening-bags': 'Клатчи и вечерние сумки',
      'leather-bags': 'Кожаные сумки',
      'Tights': 'Колготки',
      'Necklaces': 'Колье',
      'Rings': 'Кольца',
      'Rings-and-rings': 'Кольца и перстни',
      'Cosmetic-bags': 'Косметички',
      'Wallets': 'Кошельки',
      'Leather-wallets': 'Кошельки кожаные',
      'Zippered-wallets': 'Кошельки на молнии',
      'Wristwatches': 'Наручные часы',
      'Sockss': 'Носки',
      'Shortened-socks': 'Носки укороченные',
      'Document-covers': 'Обложки для документов',
      'Covers-and-cases': 'Обложки и футляры',
      'Headbands-and-hairpins': 'Ободки и заколки',
      'Stoles': 'Палантины',
      'panama-hats': 'Панамы',
      'Wigs': 'Парики',
      'Gloves-and-Sleeves': 'Перчатки и рукава',
      'Leather-gloves': 'Перчатки кожаные',
      'Scarves': 'Платки',
      'Headbands': 'Повязки',
      'Pendant-necklace-beads': 'Подвески, ожерелья, бусы',
      'Underclothes': 'Подследники',
      'Towels': 'Полотенца',
      'Purses': 'Портмоне',
      'Bedding': 'Постельные принадлежности',
      'Beltss': 'Пояса',
      'Waist-bags': 'Поясные сумки',
      'Belts': 'Ремни',
      'Belts-and-belts': 'Ремни и пояса',
      'Leather-belts-and-belts': 'Ремни и пояса кожаные',
      'Backpacks': 'Рюкзаки',
      'With-zipper': 'С молнией',
      'With-drawings': 'С рисунками',
      'Earrings': 'Серьги',
      'Snoods': 'Снуды',
      'Sunglasses': 'Солнцезащитные очки',
      'Sports-bags': 'Спортивные сумки',
      'Bags': 'Сумки',
      'Leather-bags': 'Сумки кожаные',
      'Belt-bags': 'Сумки на пояс',
      'Shoulder-bags': 'Сумки через плечо',
      'Bags-Backpacks-and-Purses': 'Сумки, Рюкзаки и Кошельки',
      'Tablet-bags-briefcases': 'Сумки-планшеты, портфели',
      'Shoppin-bags-Skateboar': 'Сумки-шопперы',
      'products-for-skateboarding': 'Товары для cкейтборда',
      'Neck-jewelry': 'Украшения на шею',
      'Credit-card-cases': 'Футляры для кредитных карт',
      'Hobo': 'Хобо',
      'Watch': 'Часы',
      'Covers': 'Чехлы',
      'Stockings-and-gaiters': 'Чулки и гетры',
      'Hatssss': 'Шапки',
      'Demi-season-hats': 'Шапки демисезонные',
      'Plain-hats': 'Шапки однотонные',
      'Hats-scarves-and-loves': 'Шапки, шарфы и перчатки',
      'Scarvess': 'Шарфы',
      'Scarves-and-scarves': 'Шарфы и платки',
      'Hatss': 'Шляпы',
    }
    const sale = { '-sale-80': 80, '-sale-60': 60, '-sale-50': 50, '-sale-30': 30 }
    const price = { '0-3000': [...Array.from(Array(3000).keys(),x=>x+1)], '3000-5000': [...Array.from(Array(2000).keys(),x=>x+3000)], '5000-7000': [...Array.from(Array(2000).keys(),x=>x+5000)], '7000-10000': [...Array.from(Array(3000).keys(),x=>x+7000)], '10000-9999999': [...Array.from(Array(999999).keys(),x=>x+10000)] }
    const brands = data.brands.reduce((ttlObj, brand) => {
        brand && brand.includes(' ')
          ? ttlObj[`-${brand.replaceAll(' ', '-')}`.toLowerCase()] = brand
          : ttlObj[`-${brand}`.toLowerCase()] = brand
      return ttlObj
      }, {})
    const sizes = data.sizes.reduce((ttlObj, size) => {
      size.includes(' ')
        ? ttlObj[`-${size.replaceAll(' ', '-')}-`.toLowerCase()] = size
        : ttlObj[`-${size}-`.toLowerCase()] = size
      return ttlObj
    }, {})
    const color = { '-black': 'Чёрный', '-white': 'Белый', '-red': 'Красный', '-orange': 'Оранжевый', '-yellow': 'Желтый', '-pink': 'Розовый', '-purple': 'Фиолетовый', '-blue': 'Синий', '-green': 'Зелёный', '-brown': 'Коричневый' }


    const params = paramsArrKeys.reduce((ttlObj,keyParam) => {

      Object.keys(gender).forEach(keyGender => {
        if (keyGender === '-child' && keyParam.includes(keyGender)) ttlObj['params.age'] = gender[keyGender]
        else if (keyParam.includes(keyGender)) ttlObj['params.gender'] = gender[keyGender]
      })

      Object.keys(category).forEach(keyCategory => {
        if (keyParam.includes(keyCategory)) ttlObj.category = category[keyCategory]
      })

      Object.keys(subCategory).forEach(keySubCategory => {
        if (keyParam.includes(keySubCategory)) ttlObj.categoryId = subCategory[keySubCategory]
      })

      Object.keys(sale).forEach(keySale => {
        if (keyParam.includes(keySale)) ttlObj.sale = { $gt: sale[keySale] - 1 }
      })

      Object.keys(sale).forEach(keySale => {
        if (keyParam.includes(keySale)) ttlObj.sale = { $gt: sale[keySale] - 1 }
      })

      Object.keys(price).forEach(keyPrice => {
        if (keyParam.includes(keyPrice)) ttlObj.price = { $in: price[keyPrice] }
      })

      if (keyParam.includes('-instalments-yes')) ttlObj.instalments = true

      const brandsArr = Object.keys(brands).reduce((ttlArr, keyBrand) => {
        if (keyParam.includes(keyBrand)) ttlArr.push(brands[keyBrand])
        return ttlArr
      }, [])
      if (brandsArr.length !== 0) ttlObj.brand = { $in: brandsArr }

      const sizesArr = Object.keys(sizes).reduce((ttlArr, keySize) => {
        if (keyParam.includes(keySize)) ttlArr.push(sizes[keySize])
        return ttlArr
      }, [])
      if (sizesArr.length !== 0) ttlObj['params.size'] = { $in: sizesArr }

      if (keyParam.includes('-delivery-rus')) ttlObj.delivery = 'Россия'

      Object.keys(color).forEach(keyColor => {
        if (keyParam.includes(keyColor)) ttlObj['params.color'] = color[keyColor]
      })

      // СЕЛЕКТ "ОТКУДА"
      // if (keyParam.includes('-from-russia')) ttlObj.delivery = 'Россия'
      // if (keyParam.includes('-from-no-russia')) ttlObj.delivery = 'Зарубеж'


      return ttlObj
    }, {})


    const sort = paramsArrKeys.reduce((ttlObj,sortParam) => {

      if (sortParam.includes('expensive')) ttlObj = { price: -1 }
      if (sortParam.includes('cheaper')) ttlObj = { price: 1 }
      if (sortParam.includes('sort-sale')) ttlObj = { sale: -1 }
      if (sortParam.includes('-free-delivery')) ttlObj = { deliveryPrice: 1 }

      return ttlObj
    }, { 'params.rating': -1 })


    // CONNECT DATABASE
    await client.connect()
    const db = await client.db('ss')
    const collection = await db.collection('all')
    products = Object.keys(paramsObj).length === Object.keys({}).length
      ? await collection.find({}).sort({ "params.rating": -1 }).toArray()
      : await collection.find(params).sort(sort).toArray()
    const quantity = products.length


    // PAGINATION LOGIC
    const pageParams = paramsArrKeys.reduce((pageParamsObj, param) => {
      if (param.includes('page')) {
        const pageArr = param.split('-')
        pageParamsObj.page = pageArr[1]
      }
      if (param.includes('show')) {
        const showArr = param.split('-')
        pageParamsObj.show = showArr[1]
      }
      return pageParamsObj
    }, {})
    const count = +pageParams.show || 60
    for (let s = 0, e = count; s < products.length; s += count, e += count)
      result.push(products.slice(s, +e))

    return {
      products: result[pageParams.page - 1 || 0],
      quantity
    }
  } catch (e) {
    console.log(e);
  }
}
