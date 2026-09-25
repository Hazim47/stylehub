import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      home: "Home",
      product: "Products",
      carts: "Cart",
      favorites: "Favorites",
      login: "Login",
      currency: "JD",

      navbar: {
        home: "Home",
        shop: "Shop",
        search: "Search fashion, clothes...",
      },
      payment: {
        title: "PAYMENT",
        subtitle: "Complete your payment securely",
        cart: "CART",
        checkout: "CHECKOUT",
        payment: "PAYMENT",
        cardDetails: "Card Details",
        cardNumber: "Card Number",
        cardholder: "Cardholder Name",
        expires: "Expires",
        cvv: "CVV",
        secure: "Your payment information is secure",
        payNow: "PAY NOW",
        processing: "PROCESSING...",
        backToCheckout: "BACK TO CHECKOUT",
        orderSummary: "ORDER SUMMARY",
        subtotal: "Subtotal",
        discount: "Discount",
        total: "TOTAL",
        quantity: "Quantity",
        currency: "JD",
        shippingInfo: "Shipping Information",
        fillCard: "Please fill in all card details",
        invalidCard: "Please enter a valid card number",
        invalidExpiry: "Please enter a valid expiry date",
        invalidCvv: "Please enter a valid CVV",
        paymentError: "An error occurred while processing your order",
      },
      favorites: {
        title: "FAVORITES",
        subtitle: "Your saved fashion pieces",
        products: "FAVORITE PRODUCTS",
        empty: "No Favorites Yet",
        emptyText: "Start adding products you love ❤️",
      },

      fashionVideo: {
        collection: "ZYA COLLECTION",
        title: "DISCOVER YOUR STYLE",
        description:
          "Explore our latest collection and discover pieces made to define your style.",
      },

      hero: {
        newCollection: "NEW COLLECTION",
        statement: "YOUR STYLE YOUR STATEMENT.",
        titleLine1: "WEAR WHAT",
        titleLine2: "DEFINES YOU",
        description:
          "Discover styles that reflect your personality and make every look your own.",
        shopNow: "SHOP NOW",
        discover: "DISCOVER",
        location: "AMMAN / JORDAN",
      },

      newIn: {
        title: "NEW COLLECTION",
        subtitle: "Timeless fashion for every season.",
        summer: "Summer",
        spring: "Spring",
        autumn: "Autumn",
        winter: "Winter",
        explore: "Explore",
      },

      footer: {
        description:
          "A fashion store offering the latest clothing trends with modern designs and premium quality. We select pieces that reflect your style and personality.",
        store: "Store",
        contact: "Contact Us",
        country: "Jordan",
        phone: "Phone",
        email: "Email",
        location: "Location",
        fashion: "Fashion",
        style: "Style",
        rights: "All Rights Reserved",
      },

      latest: {
        title: "OUR COLLECTION",
        subtitle: "Explore our newest fashion collections.",
        shopNow: "SHOP NOW",
        new: "NEW",
        sale: "SALE",
        currency: "JD",
      },

      slider: {
        viewProduct: "View Product",
        collection: "ZYA COLLECTION",
      },

      products: {
        newIn: "NEW IN",
        clothing: "CLOTHING",
        shoes: "SHOES",
        tops: "TOPS",
        shirts: "SHIRTS",
        trousers: "TROUSERS",
        products: "PRODUCTS",
        noProducts: "No Products Found",
        noProductsText: "We couldn't find any products matching your search.",
      },

      checkout: {
        title: "CHECKOUT",
        orderSummary: "Order Summary",
        subtotal: "Subtotal",
        subtitle: "Complete your order information",
        customerInfo: "Customer Information",
        shippingInfo: "Shipping Information",
        name: "Full Name",
        phone: "Phone Number",
        city: "City",
        currency: "JD",
        address: "Address",
        notes: "Order Notes",
        coupon: "Coupon",
        discount: "Discount",
        total: "Total",
        sending: "Sending order...",
        confirm: "Confirm Order",
        emptyCart: "Your cart is empty",
        fillInfo: "Please fill in all shipping information",
      },

      notifications: {
        title: "Notifications",
        subtitle: "Track your latest order updates",
        notifications: "Notifications",
        empty: "No Notifications",
        emptyText: "Order status updates will appear here.",
        new: "New",

        ORDER_CONFIRMED: "Your order has been confirmed ✅",
        ORDER_PREPARING: "Your order is being prepared 🛍️",
        ORDER_SHIPPED: "Your order has been shipped 🚚",
        ORDER_DELIVERED: "Your order has been delivered 🎉",
        ORDER_CANCELLED: "Your order has been cancelled ❌",
      },

      Details: {
        selectSizes: "Please select top size and pants size",
        selectSize: "Please select size",
        addToCart: "ADD TO CART",
        addedToCart: "Product added to cart 🛒",
        color: "Color",
        topSize: "Top Size",
        pantsSize: "Pants Size",
        chooseUpToTwo: "Choose up to 2",
        size: "Size",
        notFound: "Product Not Found",
      },

      cart: {
        title: "YOUR CART",
        empty: "Your cart is empty",
        shopNow: "SHOP NOW",
        summary: "ORDER SUMMARY",
        coupon: "Coupon Code",
        apply: "APPLY COUPON",
        couponApplied: "Coupon applied",
        invalidCoupon: "Invalid coupon",
        products: "Products",
        subtotal: "Subtotal",
        discount: "Discount",
        total: "TOTAL",
        checkout: "CHECKOUT",
        topSize: "Top Size",
        pantsSize: "Pants Size",
        size: "Size",
        color: "Color",
      },

      profile: {
        logoutConfirm: "Do you want to logout?",
        yesLogout: "Yes, Logout",
        cancel: "Cancel",
        logout: "Logout",
        welcome: "Welcome",
        loginMessage: "Login to get a better experience",
      },
    },
  },

  ar: {
    translation: {
      home: "الرئيسية",
      product: "المنتجات",
      carts: "السلة",
      favorites: "المفضلة",
      login: "تسجيل الدخول",
      currency: "دينار",

      navbar: {
        home: "الرئيسية",
        shop: "المتجر",
        search: "ابحث عن الملابس...",
      },

      favorites: {
        title: "المفضلة",
        subtitle: "قطع الأزياء المحفوظة لديك",
        products: "المنتجات المفضلة",
        empty: "لا توجد مفضلات",
        emptyText: "ابدأ بإضافة المنتجات التي تحبها ❤️",
      },

      fashionVideo: {
        collection: "مجموعة ZYA",
        title: "اكتشف أسلوبك",
        description:
          "استكشف أحدث مجموعاتنا واكتشف قطعًا صُممت لتعبّر عن أسلوبك",
      },
      payment: {
        title: "الدفع",
        subtitle: "أكمل عملية الدفع بأمان",
        cart: "السلة",
        checkout: "إتمام الطلب",
        payment: "الدفع",
        cardDetails: "بيانات البطاقة",
        cardNumber: "رقم البطاقة",
        cardholder: "اسم حامل البطاقة",
        expires: "تاريخ الانتهاء",
        cvv: "CVV",
        secure: "معلومات الدفع الخاصة بك آمنة",
        payNow: "ادفع الآن",
        processing: "جاري المعالجة...",
        backToCheckout: "العودة لإتمام الطلب",
        orderSummary: "ملخص الطلب",
        subtotal: "المجموع الفرعي",
        discount: "الخصم",
        total: "الإجمالي",
        quantity: "الكمية",
        currency: "دينار",
        shippingInfo: "معلومات التوصيل",
        fillCard: "يرجى تعبئة جميع بيانات البطاقة",
        invalidCard: "يرجى إدخال رقم بطاقة صحيح",
        invalidExpiry: "يرجى إدخال تاريخ انتهاء صحيح",
        invalidCvv: "يرجى إدخال CVV صحيح",
        paymentError: "حدث خطأ أثناء معالجة طلبك",
      },
      hero: {
        newCollection: "المجموعة الجديدة",
        statement: "أسلوبك تعبيرك",
        titleLine1: "ارتدِ ما",
        titleLine2: "يعبّر عنك",
        description: "اكتشف تصاميم تعكس شخصيتك وتجعل كل إطلالة تعبّر عنك",
        shopNow: "تسوق الآن",
        discover: "اكتشف",
        location: "عمّان / الأردن",
      },

      newIn: {
        title: "المجموعة الجديدة",
        subtitle: "أزياء خالدة لكل موسم",
        summer: "الصيف",
        spring: "الربيع",
        autumn: "الخريف",
        winter: "الشتاء",
        explore: "استكشف",
      },

      footer: {
        description:
          "متجر أزياء يقدم أحدث صيحات الملابس بتصاميم عصرية وجودة عالية. نختار لك القطع التي تعكس أناقتك وشخصيتك",
        store: "المتجر",
        contact: "تواصل معنا",
        country: "الأردن",
        phone: "الهاتف",
        email: "البريد الإلكتروني",
        location: "الموقع",
        fashion: "أزياء",
        style: "أناقة",
        rights: "جميع الحقوق محفوظة",
      },

      latest: {
        title: "مجموعتنا",
        subtitle: "اكتشف أحدث تشكيلات الأزياء لدينا",
        shopNow: "تسوق الآن",
        new: "جديد",
        sale: "تخفيض",
        currency: "دينار",
      },

      slider: {
        viewProduct: "عرض المنتج",
        collection: "مجموعة ZYA",
      },

      products: {
        newIn: "جديدنا",
        clothing: "ملابس",
        shoes: "أحذية",
        tops: "بلوزات",
        shirts: "قمصان",
        trousers: "بناطيل",
        products: "منتجات",
        noProducts: "لا توجد منتجات",
        noProductsText: "لم نجد أي منتجات مطابقة للبحث",
      },

      checkout: {
        title: "إتمام الطلب",
        subtitle: "أكمل معلومات طلبك",
        customerInfo: "معلومات العميل",
        shippingInfo: "معلومات التوصيل",
        name: "الاسم الكامل",
        phone: "رقم الهاتف",
        currency: "دينار",
        city: "المدينة",
        address: "العنوان",
        emptyCart: "السلة فارغة",
        fillInfo: "يرجى تعبئة جميع معلومات التوصيل",
        notes: "ملاحظات الطلب",
        coupon: "الكوبون",
        discount: "الخصم",
        orderSummary: "ملخص الطلب",
        subtotal: "المجموع الفرعي",
        total: "الإجمالي",
        sending: "جاري إرسال الطلب...",
        confirm: "تأكيد الطلب",
      },

      notifications: {
        title: "الإشعارات",
        subtitle: "تابع آخر تحديثات طلباتك",
        notifications: "إشعارات",
        empty: "لا توجد إشعارات",
        emptyText: "عند تغير حالة طلبك ستظهر التحديثات هنا.",
        new: "جديد",

        ORDER_CONFIRMED: "تم استلام طلبك بنجاح ✅",
        ORDER_PREPARING: "طلبك قيد التحضير الآن 🛍️",
        ORDER_SHIPPED: "طلبك خرج للتوصيل 🚚",
        ORDER_DELIVERED: "تم توصيل طلبك بنجاح 🎉",
        ORDER_CANCELLED: "تم إلغاء طلبك ❌",
      },

      Details: {
        selectSizes: "يرجى اختيار مقاس القطعة العلوية والبنطلون",
        selectSize: "يرجى اختيار المقاس",
        addToCart: "إضافة إلى السلة",
        addedToCart: "تم إضافة المنتج إلى السلة 🛒",
        color: "اللون",
        chooseUpToTwo: "اختر لونين كحد أقصى",
        topSize: "مقاس القطعة العلوية",
        pantsSize: "مقاس البنطلون",
        size: "المقاس",
        notFound: "المنتج غير موجود",
      },

      cart: {
        title: "السلة",
        empty: "السلة فارغة",
        shopNow: "تسوق الآن",
        summary: "ملخص الطلب",
        coupon: "كود الخصم",
        apply: "تطبيق الكوبون",
        couponApplied: "تم تطبيق الخصم",
        invalidCoupon: "الكوبون غير صالح",
        products: "المنتجات",
        subtotal: "المجموع الفرعي",
        discount: "الخصم",
        total: "الإجمالي",
        checkout: "إتمام الطلب",
        topSize: "مقاس العلوي",
        pantsSize: "مقاس البنطلون",
        size: "المقاس",
        color: "اللون",
      },

      profile: {
        logoutConfirm: "هل تريد تسجيل الخروج؟",
        yesLogout: "نعم، تسجيل خروج",
        cancel: "إلغاء",
        logout: "تسجيل خروج",
        welcome: "مرحبا",
        loginMessage: "سجل دخولك للحصول على تجربة أفضل",
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "ar",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
