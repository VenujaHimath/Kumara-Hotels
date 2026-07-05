export interface RoomData {
  id: string;
  name: string;
  price: number;
  dayoutPrice?: number;
  capacity: number;
  image: string;
  facilities: string[];
  status: 'Available' | 'Booked' | 'Maintenance';
}

export interface HotelGalleryImage {
  url: string;
  title: string;
  category: 'Rooms' | 'Apartment' | 'Ambience' | 'Exterior';
}

export interface HotelData {
  id: string;
  slug: string;
  name: string;
  location: string;
  description: string;
  image: string;
  videoUrl?: string;
  facilities: string[];
  rooms: RoomData[];
  gallery?: HotelGalleryImage[];
  nearbyPlaces?: string[];
  hasDayoutRates?: boolean;
}

export const hotels: HotelData[] = [
  {
    id: "sanhida-id",
    slug: "sanhida",
    name: "Sanhida Guest House",
    location: "Nugegoda, Sri Lanka",
    description: "A comfortable guest house ideal for families and short stays. Day-out and overnight packages available with easy access to parks and shopping areas.",
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80",
    facilities: ["A/C Rooms", "Non AC Rooms", "Attached Bathroom", "Free Parking", "TV", "Free WiFi", "Living Area"],
    hasDayoutRates: true,
    nearbyPlaces: ["Weli Park", "Diyagama Wetland Park", "Rampart Wetland Park", "Shopping Areas Nugegoda"],
    rooms: [
      {
        id: "sanhida-r1",
        name: "Non A/C Double Room",
        price: 3500,
        dayoutPrice: 3000,
        capacity: 2,
        image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80",
        facilities: ["Non AC", "Attached Bathroom", "TV", "WiFi"],
        status: "Available"
      },
      {
        id: "sanhida-r2",
        name: "A/C Double Room",
        price: 6000,
        dayoutPrice: 6000,
        capacity: 2,
        image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
        facilities: ["AC", "Attached Bathroom", "TV", "WiFi"],
        status: "Available"
      },
      {
        id: "sanhida-r3",
        name: "Non A/C Family Room",
        price: 6000,
        capacity: 4,
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
        facilities: ["Non AC", "Attached Bathroom", "TV", "WiFi", "Living Area"],
        status: "Available"
      },
      {
        id: "sanhida-r4",
        name: "A/C Family Room",
        price: 7500,
        capacity: 4,
        image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
        facilities: ["AC", "Attached Bathroom", "TV", "WiFi", "Living Area"],
        status: "Available"
      }
    ]
  },
  {
    id: "lake-garden-id",
    slug: "lake-garden",
    name: "Lake Garden Villa",
    location: "Battaramulla, Sri Lanka",
    description: "A peaceful retreat with comfort, convenience and warm hospitality. Comfortable rooms and villa-type apartments surrounded by lush greenery on Lake Road, Akuregoda.",
    image: "/images/lake-garden/living-area.jpeg",
    facilities: ["A/C Rooms", "Non AC Rooms", "Attached Bathroom", "Hot Water", "Kitchen Area", "TV", "Free WiFi", "Living Area"],
    nearbyPlaces: ["Diyatha Uyana", "Diyasaru Park", "Ape Gama", "Passport Office"],
    rooms: [
      {
        id: "lake-r1",
        name: "A/C Double Room",
        price: 6000,
        capacity: 2,
        image: "/images/lake-garden/double-room.jpeg",
        facilities: ["AC", "Attached Bathroom", "Hot Water", "TV", "WiFi"],
        status: "Available"
      },
      {
        id: "lake-r2",
        name: "A/C Double Room (Shared Bathroom)",
        price: 4500,
        capacity: 2,
        image: "/images/lake-garden/double-room-2.jpeg",
        facilities: ["AC", "Shared Bathroom", "Hot Water", "TV", "WiFi"],
        status: "Available"
      },
      {
        id: "lake-r3",
        name: "Family Room",
        price: 7500,
        capacity: 4,
        image: "/images/lake-garden/family-room.jpeg",
        facilities: ["AC", "Attached Bathroom", "Hot Water", "TV", "WiFi"],
        status: "Available"
      },
      {
        id: "lake-r4",
        name: "Villa Type Apartment",
        price: 12000,
        capacity: 6,
        image: "/images/lake-garden/apartment-family-room.jpeg",
        facilities: ["AC", "Kitchen Area", "Living Area", "Hot Water", "TV", "WiFi"],
        status: "Available"
      }
    ],
    gallery: [
      { url: "/images/lake-garden/double-room-2.jpeg", title: "Double Room", category: "Rooms" },
      { url: "/images/lake-garden/non-ac-double-2.jpeg", title: "Double Room View", category: "Rooms" },
      { url: "/images/lake-garden/apartment-family-room.jpeg", title: "Apartment Bedroom", category: "Apartment" },
      { url: "/images/lake-garden/living-area.jpeg", title: "Apartment Living Area", category: "Apartment" },
      { url: "/images/lake-garden/apartment-kitchen.jpeg", title: "Apartment Kitchen", category: "Apartment" },
      { url: "/images/lake-garden/kitchen-area.jpeg", title: "Kitchenette", category: "Apartment" },
      { url: "/images/lake-garden/bathroom.jpeg", title: "Modern Bathroom", category: "Rooms" },
      { url: "/images/lake-garden/bathroom-2.jpeg", title: "Marble Bathroom", category: "Rooms" },
      { url: "/images/lake-garden/aesthetic.jpeg", title: "Art & Ambience", category: "Ambience" },
      { url: "/images/lake-garden/aesthetic-2.jpeg", title: "Buddha Niche", category: "Ambience" },
      { url: "/images/lake-garden/aesthetic-3.jpeg", title: "Garden Shrine", category: "Ambience" },
      { url: "/images/lake-garden/poster.jpeg", title: "Lake Garden Villa", category: "Exterior" }
    ]
  },
  {
    id: "city-heaven-id",
    slug: "city-heaven",
    name: "City Heaven Villa",
    location: "Colombo, Sri Lanka",
    description: "A spacious villa property perfect for large groups and family gatherings. Full villa hire available alongside individual room bookings.",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
    facilities: ["A/C Rooms", "Non AC Rooms", "Attached Bathroom", "Hot Water", "Kitchen Area", "TV", "Free WiFi", "Living Area"],
    rooms: [
      {
        id: "city-r1",
        name: "Full Villa (20 Persons)",
        price: 25000,
        capacity: 20,
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
        facilities: ["AC", "Kitchen Area", "Living Area", "Hot Water", "TV", "WiFi"],
        status: "Available"
      },
      {
        id: "city-r2",
        name: "A/C Double Room",
        price: 6000,
        capacity: 2,
        image: "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80",
        facilities: ["AC", "Attached Bathroom", "Hot Water", "TV", "WiFi"],
        status: "Available"
      },
      {
        id: "city-r3",
        name: "Non A/C Double Room",
        price: 4000,
        capacity: 2,
        image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
        facilities: ["Non AC", "Attached Bathroom", "TV", "WiFi"],
        status: "Available"
      },
      {
        id: "city-r4",
        name: "Family Room",
        price: 7500,
        capacity: 4,
        image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
        facilities: ["AC", "Attached Bathroom", "Hot Water", "TV", "WiFi", "Living Area"],
        status: "Available"
      }
    ]
  },
  {
    id: "the-option-id",
    slug: "the-option",
    name: "Option Resort & Restaurant",
    location: "Mount Lavinia, Sri Lanka",
    description: "A relaxed resort and restaurant near the coast. Enjoy day-out packages or overnight stays with easy access to beaches and local attractions.",
    image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80",
    facilities: ["A/C Rooms", "Non AC Rooms", "Attached Bathroom", "Free Parking", "TV", "Free WiFi", "Living Area"],
    hasDayoutRates: true,
    nearbyPlaces: ["Mount Lavinia Beach", "Mount Lavinia Hotel", "Dehiwala Zoo", "Airport Rathmalana"],
    rooms: [
      {
        id: "option-r1",
        name: "Non A/C Double Room",
        price: 3500,
        dayoutPrice: 3000,
        capacity: 2,
        image: "https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&w=800&q=80",
        facilities: ["Non AC", "Attached Bathroom", "TV", "WiFi"],
        status: "Available"
      },
      {
        id: "option-r2",
        name: "A/C Double Room",
        price: 5000,
        dayoutPrice: 5000,
        capacity: 2,
        image: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=800&q=80",
        facilities: ["AC", "Attached Bathroom", "TV", "WiFi"],
        status: "Available"
      },
      {
        id: "option-r3",
        name: "Non A/C Family Room",
        price: 4500,
        capacity: 4,
        image: "https://images.unsplash.com/photo-1482463084273-982f7f066efc?auto=format&fit=crop&w=800&q=80",
        facilities: ["Non AC", "Attached Bathroom", "TV", "WiFi", "Living Area"],
        status: "Available"
      }
    ]
  }
];

export const reviews = [
  {
    id: 1,
    name: "Alexander Mercer",
    role: "Global Jetsetter",
    rating: 5,
    comment: "Lake Garden Villa was pure magic. The peaceful garden setting and warm hospitality made our stay unforgettable.",
    hotel: "Lake Garden Villa",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
  },
  {
    id: 2,
    name: "Aanya Perera",
    role: "Family Vacationer",
    rating: 5,
    comment: "Sanhida Guest House was perfect for our family. The rooms were clean, the staff was extremely friendly, and the family room felt like home.",
    hotel: "Sanhida Guest House",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
  },
  {
    id: 3,
    name: "Dr. Hiroshi Sato",
    role: "Corporate Executive",
    rating: 5,
    comment: "City Heaven Villa provides everything a large group could ask for. Spacious rooms, a full kitchen, and a convenient location.",
    hotel: "City Heaven Villa",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80"
  }
];

export const galleryImages = [
  { url: "/images/lake-garden/living-area.jpeg", category: "Rooms", title: "Lake Garden Living Area" },
  { url: "/images/lake-garden/aesthetic-3.jpeg", category: "Experiences", title: "Lake Garden Garden Shrine" },
  { url: "/images/lake-garden/double-room.jpeg", category: "Rooms", title: "Lake Garden Double Room" },
  { url: "/images/lake-garden/apartment-kitchen.jpeg", category: "Rooms", title: "Lake Garden Apartment Kitchen" },
  { url: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=600&q=80", category: "Exterior", title: "Sanhida Sunset View" },
  { url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=80", category: "Rooms", title: "Deluxe Suite Interior" },
  { url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80", category: "Food", title: "Gourmet Ocean Dining" },
  { url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80", category: "Events", title: "Lakeside Corporate Event" },
  { url: "https://images.unsplash.com/photo-1545232979-8bf34eb9757b?auto=format&fit=crop&w=600&q=80", category: "Experiences", title: "Ayurvedic Spa Ritual" },
  { url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80", category: "Rooms", title: "Ocean Breeze Villa Bed" },
  { url: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80", category: "Exterior", title: "The Option Cabin at Night" },
  { url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80", category: "Food", title: "Organic Garden Harvest Salad" }
];

export const translations = {
  en: {
    navHome: "Home",
    navHotels: "Hotels",
    navBooking: "Book Now",
    navAdmin: "Admin Portal",
    heroTitle: "Discover Your Perfect Stay",
    heroSubtitle: "Four unique hotels. One exceptional hospitality experience.",
    btnExplore: "Explore Hotels",
    btnCheckAvailability: "Check Availability",
    sectionFeatured: "Our Masterpiece Stays",
    sectionFeaturedSub: "Curated experiences across the island's most breathtaking settings",
    sectionFacilities: "Exclusive Facilities & Services",
    sectionFacilitiesSub: "Indulge in amenities designed to pamper, connect, and elevate your senses",
    sectionGallery: "Visual Collection",
    sectionGallerySub: "Peek inside our sanctuaries, culinary wonders, and nature moments",
    sectionReviews: "What Guests Say",
    sectionReviewsSub: "Stories of luxury, tranquility, and flawless hospitality",
    bookNow: "Book Suite",
    location: "Location",
    facilities: "Included Facilities",
    viewHotel: "View Hotel Profile",
    checkIn: "Check-In Date",
    checkOut: "Check-Out Date",
    guestsCount: "Number of Guests",
    selectHotel: "Select Destination",
    availableRooms: "Available Accommodations",
    btnSearchAvailability: "Check Available Rooms",
    customerDetails: "Customer Information",
    fullName: "Full Name",
    phone: "Phone Number",
    email: "Email Address",
    btnCompleteBooking: "Confirm & Secure Reservation",
    bookingSuccess: "Reservation Confirmed!",
    bookingSuccessSub: "Your luxury stay is registered. We look forward to welcoming you.",
    bookingDetails: "Reservation Details",
    hotelLabel: "Hotel",
    roomLabel: "Room Selection",
    datesLabel: "Travel Dates",
    guestsLabel: "Guests Allowed",
    totalLabel: "Total Investment",
    whatsappBtn: "Chat & Book via WhatsApp",
    whatsappModalTitle: "Open WhatsApp",
    whatsappModalSub: "You will be redirected to WhatsApp with a pre-filled message.",
    whatsappModalPhone: "Concierge Number",
    whatsappModalMessage: "Pre-filled Message",
    whatsappModalCancel: "Cancel",
    whatsappModalContinue: "Continue to WhatsApp",
    footerText: "Kumara Hotels Group © 2026. Defining luxury hospitality across Sri Lanka.",
    footerSub: "Sanhida | Lake Garden | City Heaven | The Option",
    langEn: "English",
    langSi: "සිංහල",
    langTa: "தமிழ்",
    facilitiesList: {
      "A/C Rooms": "A/C Rooms",
      "Non AC Rooms": "Non AC Rooms",
      "Attached Bathroom": "Attached Bathroom",
      "Hot Water": "Hot Water",
      "Kitchen Area": "Kitchen Area",
      "TV": "TV",
      "Free WiFi": "Free WiFi",
      "Living Area": "Living Area",
      "Free Parking": "Free Parking",
      "Ocean View": "Ocean View",
      "Kids Club": "Kids Club",
      "Luxury Spa": "Luxury Spa",
      "Fine Dining": "Fine Dining",
      "Private Beach Access": "Private Beach Access",
      "Lakeside Deck": "Lakeside Deck",
      "Ayurvedic Spa": "Ayurvedic Spa",
      "Organic Restaurant": "Organic Restaurant",
      "Hiking Trails": "Hiking Trails",
      "Library": "Library",
      "Yoga Studio": "Yoga Studio",
      "Rooftop Pool": "Rooftop Pool",
      "Executive Lounge": "Executive Lounge",
      "Conference Hall": "Conference Hall",
      "24/7 Gym": "24/7 Gym",
      "Valet Parking": "Valet Parking",
      "Helipad": "Helipad",
      "Co-working Hub": "Co-working Hub",
      "Social Firepit": "Social Firepit",
      "Shared Kitchen": "Shared Kitchen",
      "Bike Rental": "Bike Rental",
      "Yoga Deck": "Yoga Deck",
      "Stargazing Net": "Stargazing Net"
    }
  },
  si: {
    navHome: "ප්‍රධාන පිටුව",
    navHotels: "හෝටල්",
    navBooking: "දැන්ම වෙන්කරන්න",
    navAdmin: "පරිපාලන අංශය",
    heroTitle: "ඔබේ පරිපූර්ණ නවාතැන සොයාගන්න",
    heroSubtitle: "සුවිශේෂී හෝටල් හතරක්. එකම විශිෂ්ට ආගන්තුක සත්කාරය.",
    btnExplore: "හෝටල් ගවේෂණය කරන්න",
    btnCheckAvailability: "ඇති බව පරීක්ෂා කරන්න",
    sectionFeatured: "අපගේ විශිෂ්ටතම නවාතැන්",
    sectionFeaturedSub: "දිවයිනේ වඩාත් මනරම් ස්ථානවල සුවිශේෂී අත්දැකීම්",
    sectionFacilities: "සුවිශේෂී පහසුකම් සහ සේවා",
    sectionFacilitiesSub: "ඔබව සන්තෝෂවත් කිරීමට සහ සුවපහසුව තහවුරු කිරීමට සැලසුම් කළ පහසුකම්",
    sectionGallery: "ඡායාරූප එකතුව",
    sectionGallerySub: "අපගේ අලංකාර පරිශ්‍රයන්, රසවත් ආහාර සහ ස්වභාවික සුන්දරත්වය",
    sectionReviews: "අමුත්තන්ගේ අදහස්",
    sectionReviewsSub: "සුවපහසුව, සන්සුන් භාවය සහ විශිෂ්ට සත්කාරය පිළිබඳ අත්දැකීම්",
    bookNow: "දැන්ම වෙන්කරන්න",
    location: "පිහිටීම",
    facilities: "ඇතුළත් පහසුකම්",
    viewHotel: "හෝටලයේ තොරතුරු",
    checkIn: "පැමිණෙන දිනය",
    checkOut: "පිටවන දිනය",
    guestsCount: "අමුත්තන් ගණන",
    selectHotel: "හෝටලය තෝරන්න",
    availableRooms: "ලබාගත හැකි කාමර",
    btnSearchAvailability: "කාමර තිබේදැයි පරීක්ෂා කරන්න",
    customerDetails: "පාරිභෝගික තොරතුරු",
    fullName: "සම්පූර්ණ නම",
    phone: "දුරකථන අංකය",
    email: "විද්‍යුත් ලිපිනය",
    btnCompleteBooking: "වෙන්කිරීම තහවුරු කරන්න",
    bookingSuccess: "වෙන්කිරීම සාර්ථකයි!",
    bookingSuccessSub: "ඔබේ නවාතැන ලියාපදිංචි කර ඇත. ඔබව සාදරයෙන් පිළිගැනීමට බලාපොරොත්තු වෙමු.",
    bookingDetails: "වෙන්කිරීමේ විස්තර",
    hotelLabel: "හෝටලය",
    roomLabel: "කාමරය",
    datesLabel: "දින වකවානු",
    guestsLabel: "අමුත්තන්",
    totalLabel: "මුළු මුදල",
    whatsappBtn: "WhatsApp මඟින් වෙන්කරන්න",
    whatsappModalTitle: "WhatsApp විවෘත කරන්න",
    whatsappModalSub: "ඔබව WhatsApp වෙත යොමු කරනු ලැබේ.",
    whatsappModalPhone: "කොන්සියෙජ් අංකය",
    whatsappModalMessage: "පෙර පිරවූ පණිවිඩය",
    whatsappModalCancel: "අවලංගු කරන්න",
    whatsappModalContinue: "WhatsApp වෙත යන්න",
    footerText: "කුමාර හෝටල් සමූහය © 2026. ශ්‍රී ලංකාවේ සුඛෝපභෝගී ආගන්තුක සත්කාරය.",
    footerSub: "සන්හිඳ | ලේක් ගාඩන් | සිටි හෙවන් | දි ඔප්ෂන්",
    langEn: "English",
    langSi: "සිංහල",
    langTa: "தமிழ்",
    facilitiesList: {
      "A/C Rooms": "වායු සමීකරණ කාමර",
      "Non AC Rooms": "වායු සමීකරණ නොමැති කාමර",
      "Attached Bathroom": "ඇමුණුම් නෑROOM",
      "Hot Water": "උණු වතුර",
      "Kitchen Area": "මුළුතැන්ගෙය",
      "TV": "ටීවී",
      "Free WiFi": "නොමිලේ වයි-ෆයි",
      "Living Area": "විවේක කලාපය",
      "Free Parking": "නොමිලේ වාහන නැවැත්වීම",
      "Ocean View": "මුහුදු දර්ශනය",
      "Kids Club": "ළමා ක්‍රීඩා සමාජය",
      "Luxury Spa": "සුඛෝපභෝගී ස්පා",
      "Fine Dining": "සුවිශේෂී භෝජන සංග්‍රහය",
      "Private Beach Access": "පෞද්ගලික වෙරළ",
      "Lakeside Deck": "වැව් තාවුල්ල",
      "Ayurvedic Spa": "ආයුර්වේද ස්පා සත්කාරය",
      "Organic Restaurant": "කාබනික ආපනශාලාව",
      "Hiking Trails": "කඳු නැගීමේ මංපෙත්",
      "Library": "පුස්තකාලය",
      "Yoga Studio": "යෝගා මධ්‍යස්ථානය",
      "Rooftop Pool": "වහල මත පිහිනුම් තටාකය",
      "Executive Lounge": "විශේෂිත විවේකාගාරය",
      "Conference Hall": "සම්මන්ත්‍රණ ශාලාව",
      "24/7 Gym": "ජිම් එක",
      "Valet Parking": "රථවාහන නැවැත්වීමේ සේවාව",
      "Helipad": "හෙලිකොප්ටර් පීඨිකාව",
      "Co-working Hub": "වැඩබිම",
      "Social Firepit": "ගිනිමැල කලාපය",
      "Shared Kitchen": "පොදු මුළුතැන්ගෙය",
      "Bike Rental": "පාපැදි කුලියට දීම",
      "Yoga Deck": "යෝගා පීඨිකාව",
      "Stargazing Net": "තරු නරඹන දැල"
    }
  },
  ta: {
    navHome: "முகப்பு",
    navHotels: "ஹோட்டல்கள்",
    navBooking: "பதிவு செய்க",
    navAdmin: "நிர்வாகி",
    heroTitle: "உங்கள் சரியான தங்குமிடத்தை கண்டறியுங்கள்",
    heroSubtitle: "நான்கு தனித்துவமான ஹோட்டல்கள். ஒரு விதிவிலக்கான விருந்தோம்பல் அனுபவம்.",
    btnExplore: "ஹோட்டல்களை ஆராயுங்கள்",
    btnCheckAvailability: "கிடைக்கக்கூடியதைச் சரிபார்க்கவும்",
    sectionFeatured: "எங்கள் பிரீமியம் தங்குமிடங்கள்",
    sectionFeaturedSub: "தீவின் மிக அழகான இடங்களில் தங்குவதற்கான தனித்துவமான வாய்ப்புகள்",
    sectionFacilities: "பிரத்தியேக வசதிகள் மற்றும் சேவைகள்",
    sectionFacilitiesSub: "உங்களை மகிழ்விக்கவும் வசதியை உறுதிப்படுத்தவும் வடிவமைக்கப்பட்ட வசதிகள்",
    sectionGallery: "புகைப்பட தொகுப்பு",
    sectionGallerySub: "எங்கள் அழகான வளாகங்கள், சுவையான உணவுகள் மற்றும் இயற்கையான அழகு",
    sectionReviews: "விருந்தினர்களின் கருத்துக்கள்",
    sectionReviewsSub: "வசதி, அமைதி மற்றும் சிறந்த விருந்தோம்பல் பற்றிய அனுபவங்கள்",
    bookNow: "இப்போது பதிவு செய்க",
    location: "அமைவிடம்",
    facilities: "சேர்க்கப்பட்ட வசதிகள்",
    viewHotel: "ஹோட்டல் சுயவிவரம்",
    checkIn: "வருகை தேதி",
    checkOut: "வெளியேறும் தேதி",
    guestsCount: "விருந்தினர்கள் எண்ணிக்கை",
    selectHotel: "ஹோட்டலைத் தேர்ந்தெடுக்கவும்",
    availableRooms: "கிடைக்கக்கூடிய அறைகள்",
    btnSearchAvailability: "அறைகள் கிடைக்குமா என்று பார்க்கவும்",
    customerDetails: "வாடிக்கையாளர் தகவல்கள்",
    fullName: "முழு பெயர்",
    phone: "தொலைபேசி எண்",
    email: "மின்னஞ்சல் முகவரி",
    btnCompleteBooking: "பதிவை உறுதிப்படுத்துக",
    bookingSuccess: "பதிவு வெற்றிகரமாக முடிந்தது!",
    bookingSuccessSub: "உங்கள் தங்குமிடம் பதிவு செய்யப்பட்டுள்ளது. உங்களை வரவேற்க ஆவலுடன் காத்திருக்கிறோம்.",
    bookingDetails: "பதிவு விவரங்கள்",
    hotelLabel: "ஹோட்டல்",
    roomLabel: "அறை",
    datesLabel: "நாட்கள்",
    guestsLabel: "விருந்தினர்கள்",
    totalLabel: "மொத்த தொகை",
    whatsappBtn: "WhatsApp மூலம் பதிவு செய்யுங்கள்",
    whatsappModalTitle: "WhatsApp திற",
    whatsappModalSub: "முன்பே நிரப்பிய செய்தியுடன் WhatsApp க்கு திருப்பி விடப்படுவீர்கள்.",
    whatsappModalPhone: "கான்சியர்ஜ் எண்",
    whatsappModalMessage: "முன் நிரப்பிய செய்தி",
    whatsappModalCancel: "ரத்து செய்",
    whatsappModalContinue: "WhatsApp க்கு செல்",
    footerText: "குமாரா ஹோட்டல் குழுமம் © 2026. இலங்கையின் ஆடம்பர விருந்தோம்பல்.",
    footerSub: "சன்கிதா | லேக் கார்டன் | சிட்டி ஹெவன் | தி ஆப்சன்",
    langEn: "English",
    langSi: "සිංහල",
    langTa: "தமிழ்",
    facilitiesList: {
      "A/C Rooms": "ஏ/சி அறைகள்",
      "Non AC Rooms": "ஏ/சி இல்லாத அறைகள்",
      "Attached Bathroom": "இணைக்கப்பட்ட குளியலறை",
      "Hot Water": "சூடான நீர்",
      "Kitchen Area": "சமையலறை",
      "TV": "டிவி",
      "Free WiFi": "இலவச வைஃபை",
      "Living Area": "வாழ்க்கை அறை",
      "Free Parking": "இலவச வாகன நிறுத்துமிடம்",
      "Ocean View": "கடல் காட்சி",
      "Kids Club": "குழந்தைகள் விளையாட்டு பகுதி",
      "Luxury Spa": "ஆடம்பர ஸ்பா",
      "Fine Dining": "சிறந்த உணவு",
      "Private Beach Access": "தனியார் கடற்கரை",
      "Lakeside Deck": "ஏரிக்கரை தளம்",
      "Ayurvedic Spa": "ஆயுர்வேத ஸ்பா",
      "Organic Restaurant": "இயற்கை உணவகம்",
      "Hiking Trails": "மலைப்பாதை நடைப்பயிற்சி",
      "Library": "நூலகம்",
      "Yoga Studio": "யோகா ஸ்டுடியோ",
      "Rooftop Pool": "மேற்கூரை நீச்சல் குளம்",
      "Executive Lounge": "நிர்வாக ஓய்வறை",
      "Conference Hall": "மாநாட்டு அரங்கம்",
      "24/7 Gym": "உடற்பயிற்சி கூடம்",
      "Valet Parking": "வாகன நிறுத்துமிடம் சேவை",
      "Helipad": "ஹெலிபேட்",
      "Co-working Hub": "இணைந்து பணிபுரியும் இடம்",
      "Social Firepit": "நெருப்பு வளையம்",
      "Shared Kitchen": "பகிரப்பட்ட சமையலறை",
      "Bike Rental": "மிதிவண்டி வாடகை",
      "Yoga Deck": "யோகா தளம்",
      "Stargazing Net": "நட்சத்திரங்களை பார்க்கும் வலை"
    }
  }
};
