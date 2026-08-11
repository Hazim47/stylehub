import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { Details } from "@mui/icons-material";

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
      favorites: {
        title: "FAVORITES",
        subtitle: "Your saved fashion pieces",
        products: "FAVORITE PRODUCTS",
        empty: "No Favorites Yet",
        emptyText: "Start adding products you love ❤️",
      },
      hero: {
        description:
          "Discover our latest fashion collection, carefully crafted to give you a luxurious look and timeless elegance.",
        shopNow: "Shop Now",
        discover: "Explore Collection",
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
        rights: "All Rights Reserved",
      },
      latest: {
        title: "OUR COLLECTION",
        subtitle: "Explore our newest fashion collections.",
        shopNow: "SHOP NOW",
      },
      slider: {
        viewProduct: "View Product",
        collection: "STYLEHUB COLLECTION",
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
        subtitle: "Complete your order information",
        customerInfo: "Customer Information",
        shippingInfo: "Shipping Information",
        name: "Full Name",
        phone: "Phone Number",
        city: "City",
        address: "Address",
        notes: "Order Notes",
        coupon: "Coupon",
        discount: "Discount",
        total: "Total",
        sending: "Sending order...",
        confirm: "Confirm Order",
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
      carts: "السلة",
      product: "منتجات",
      favorites: "المفضلة",
      login: "تسجيل الدخول",
      currency: "دينار",
      navbar: {
        home: "الرئيسية",
        shop: "المتجر",
        search: "ابحث عن الملابس...",
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
      checkout: {
        title: "إتمام الطلب",
        subtitle: "أكمل معلومات طلبك",
        customerInfo: "معلومات العميل",
        shippingInfo: "معلومات التوصيل",
        name: "الاسم الكامل",
        phone: "رقم الهاتف",
        city: "المدينة",
        address: "العنوان",
        notes: "ملاحظات الطلب",
        coupon: "الكوبون",
        discount: "الخصم",
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
      profile: {
        logoutConfirm: "هل تريد تسجيل الخروج؟",
        yesLogout: "نعم، تسجيل خروج",
        cancel: "إلغاء",
        logout: "تسجيل خروج",
        welcome: "مرحبا",
        loginMessage: "سجل دخولك للحصول على تجربة أفضل",
      },
      favorites: {
        title: "المفضلة",
        subtitle: "قطع الأزياء المحفوظة لديك",
        products: "المنتجات المفضلة",
        empty: "لا توجد مفضلات",
        emptyText: "ابدأ بإضافة المنتجات التي تحبها ❤️",
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

      products: {
        newIn: "جديدنا",
        clothing: "ملابس",
        shoes: "أحذية",
        tops: "بلوزات",
        shirts: "قمصان",
        trousers: "بناطيل",
        products: "منتجات",
        noProducts: "لا توجد منتجات",
        noProductsText: "لم نجد أي منتجات مطابقة للبحث.",
      },

      slider: {
        viewProduct: "عرض المنتج",
        collection: "مجموعة StyleHub",
      },

      latest: {
        title: "مجموعتنا",
        subtitle: "اكتشف أحدث تشكيلات الأزياء لدينا",
        shopNow: "تسوق الآن",
      },

      hero: {
        description:
          "اكتشف تشكيلتنا الجديدة من الملابس المصممة بعناية لتمنحك إطلالة فاخرة وأناقة لا مثيل لها.",
        shopNow: "تسوق الآن",
        discover: "اكتشف المجموعة",
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
          "متجر أزياء يقدم أحدث صيحات الملابس بتصاميم عصرية وجودة عالية. نختار لك القطع التي تعكس أناقتك وشخصيتك.",
        store: "المتجر",
        contact: "تواصل معنا",
        country: "الأردن",
        rights: "جميع الحقوق محفوظة",
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
