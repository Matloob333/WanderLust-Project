const sampleListings = [
  // BEACH CATEGORY
  {
    title: "Cozy Beachfront Cottage",
    description:
      "Escape to this charming beachfront cottage for a relaxing getaway. Enjoy stunning ocean views and easy access to the beach. Perfect for couples seeking a romantic retreat or families wanting to create lasting memories by the sea.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 1500,
    location: "Malibu",
    country: "United States",
    category: "Beach",
    amenities: ["WiFi", "Kitchen", "Parking", "Balcony", "Garden", "BBQ"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    featured: true,
    rating: 4.8
  },
  {
    title: "Beachfront Paradise",
    description:
      "Step out of your door onto the sandy beach. This beachfront condo offers the ultimate relaxation. Enjoy stunning sunsets, water sports, and the sound of waves from your private balcony.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 2000,
    location: "Cancun",
    country: "Mexico",
    category: "Beach",
    amenities: ["WiFi", "Kitchen", "Parking", "Pool", "Gym", "AC", "Balcony", "Restaurant", "Bar"],
    maxGuests: 6,
    bedrooms: 2,
    bathrooms: 2,
    featured: true,
    rating: 4.8
  },
  {
    title: "Beachfront Bungalow in Bali",
    description:
      "Relax on the sandy shores of Bali in this beautiful beachfront bungalow with a private pool. Experience the perfect blend of tropical paradise and modern luxury in this stunning beachfront property.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1602391833977-358a52198938?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fGNhbXBpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 1800,
    location: "Bali",
    country: "Indonesia",
    category: "Beach",
    amenities: ["WiFi", "Kitchen", "Parking", "Pool", "AC", "Balcony", "Garden", "Spa"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    featured: true,
    rating: 4.8
  },
  {
    title: "Tropical Beach Villa",
    description:
      "Experience paradise in this stunning beach villa with direct access to pristine white sand beaches. Perfect for families and groups seeking the ultimate beach vacation.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGxha2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 2800,
    location: "Maldives",
    country: "Maldives",
    category: "Beach",
    amenities: ["WiFi", "Kitchen", "Parking", "Pool", "Gym", "AC", "Balcony", "Restaurant", "Bar", "Spa"],
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3,
    featured: false,
    rating: 4.7
  },

  // MOUNTAIN CATEGORY
  {
    title: "Mountain Retreat",
    description:
      "Unplug and unwind in this peaceful mountain cabin. Surrounded by nature, it's a perfect place to recharge. Enjoy hiking trails, wildlife watching, and breathtaking mountain views from your private deck.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 1000,
    location: "Aspen",
    country: "United States",
    category: "Mountain",
    amenities: ["WiFi", "Kitchen", "Fireplace", "Balcony", "Garden", "BBQ", "Hot Tub"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    featured: true,
    rating: 4.9
  },
  {
    title: "Ski-In/Ski-Out Chalet",
    description:
      "Hit the slopes right from your doorstep in this ski-in/ski-out chalet in the Swiss Alps. This traditional chalet combines rustic charm with modern luxury and direct access to world-class skiing.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHNreSUyMHZhY2F0aW9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 3000,
    location: "Verbier",
    country: "Switzerland",
    category: "Mountain",
    amenities: ["WiFi", "Kitchen", "Parking", "Fireplace", "Hot Tub", "Sauna", "Spa"],
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3,
    featured: true,
    rating: 4.8
  },
  {
    title: "Mountain View Cabin in Banff",
    description:
      "Enjoy breathtaking mountain views from this cozy cabin in the Canadian Rockies. This rustic yet comfortable cabin offers the perfect base for exploring Banff National Park and its stunning natural beauty.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGxvZGdlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 1500,
    location: "Banff",
    country: "Canada",
    category: "Mountain",
    amenities: ["WiFi", "Kitchen", "Parking", "Fireplace", "Hot Tub", "Garden"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    featured: false,
    rating: 4.6
  },
  {
    title: "Alpine Lodge Retreat",
    description:
      "Experience the magic of the mountains in this luxurious alpine lodge. Perfect for both summer hiking and winter skiing, with stunning panoramic views of snow-capped peaks.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1vdW50YWlufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 2200,
    location: "Zermatt",
    country: "Switzerland",
    category: "Mountain",
    amenities: ["WiFi", "Kitchen", "Parking", "Fireplace", "Hot Tub", "Sauna", "Spa", "Restaurant"],
    maxGuests: 10,
    bedrooms: 5,
    bathrooms: 4,
    featured: false,
    rating: 4.9
  },

  // CITY CATEGORY
  {
    title: "Modern Loft in Downtown",
    description:
      "Stay in the heart of the city in this stylish loft apartment. Perfect for urban explorers! This contemporary space features high ceilings, exposed brick walls, and all the modern amenities you need for a comfortable city stay.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 1200,
    location: "New York City",
    country: "United States",
    category: "City",
    amenities: ["WiFi", "Kitchen", "AC", "Heating", "TV", "Gym", "Concierge"],
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    featured: false,
    rating: 4.5
  },
  {
    title: "Luxury Penthouse with City Views",
    description:
      "Indulge in luxury living with panoramic city views from this stunning penthouse apartment. This exclusive property offers the finest amenities and services for discerning travelers.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2t5JTIwdmFjYXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 3500,
    location: "Los Angeles",
    country: "United States",
    category: "Luxury",
    amenities: ["WiFi", "Kitchen", "Parking", "Pool", "Gym", "AC", "Heating", "TV", "Balcony", "Concierge", "Room Service"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    featured: true,
    rating: 4.9
  },
  {
    title: "Art Deco Apartment in Miami",
    description:
      "Step into the glamour of the 1920s in this stylish Art Deco apartment in South Beach. This beautifully restored apartment captures the essence of Miami's golden age while providing modern luxury.",
    image: {
      filename: "listingimage",
      url: "https://plus.unsplash.com/premium_photo-1670963964797-942df1804579?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGxvZGdlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 2800,
    location: "Miami",
    country: "United States",
    category: "Luxury",
    amenities: ["WiFi", "Kitchen", "Parking", "Pool", "Gym", "AC", "Balcony", "Concierge"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    featured: true,
    rating: 4.7
  },
  {
    title: "Historic Brownstone in Boston",
    description:
      "Step back in time in this elegant historic brownstone located in the heart of Boston. This beautifully preserved home offers a glimpse into Boston's rich history while providing modern amenities.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1533619239233-6280475a633a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHNreSUyMHZhY2F0aW9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 2200,
    location: "Boston",
    country: "United States",
    category: "Historic",
    amenities: ["WiFi", "Kitchen", "AC", "Heating", "TV", "Fireplace"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    featured: false,
    rating: 4.7
  },

  // FOREST CATEGORY
  {
    title: "Secluded Treehouse Getaway",
    description:
      "Live among the treetops in this unique treehouse retreat. A true nature lover's paradise. This eco-friendly accommodation offers a one-of-a-kind experience with modern comforts in a natural setting.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 800,
    location: "Portland",
    country: "United States",
    category: "Forest",
    amenities: ["WiFi", "Kitchen", "Balcony", "Garden", "BBQ"],
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    featured: false,
    rating: 4.6
  },
  {
    title: "Forest Cabin Retreat",
    description:
      "Immerse yourself in nature in this charming forest cabin. Surrounded by towering trees and wildlife, this peaceful retreat offers the perfect escape from city life.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGxvZGdlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 950,
    location: "Vermont",
    country: "United States",
    category: "Forest",
    amenities: ["WiFi", "Kitchen", "Parking", "Fireplace", "Garden", "BBQ"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    featured: false,
    rating: 4.5
  },

  // LAKE CATEGORY
  {
    title: "Rustic Cabin by the Lake",
    description:
      "Spend your days fishing and kayaking on the serene lake. This cozy cabin is perfect for outdoor enthusiasts. The cabin features a private dock, fishing gear, and stunning lake views from every window.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1vdW50YWlufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 900,
    location: "Lake Tahoe",
    country: "United States",
    category: "Lake",
    amenities: ["WiFi", "Kitchen", "Parking", "Fireplace", "Garden", "BBQ"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    featured: false,
    rating: 4.4
  },
  {
    title: "Lakeside Villa",
    description:
      "Experience luxury lakeside living in this stunning villa with private beach access. Perfect for water sports, fishing, and enjoying the peaceful lake atmosphere.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1578645510447-e20b4311e3ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDF8fGNhbXBpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 1800,
    location: "Lake Como",
    country: "Italy",
    category: "Lake",
    amenities: ["WiFi", "Kitchen", "Parking", "Pool", "Garden", "BBQ", "Spa"],
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3,
    featured: false,
    rating: 4.8
  },

  // ISLAND CATEGORY
  {
    title: "Private Island Retreat",
    description:
      "Have an entire island to yourself for a truly exclusive and unforgettable vacation experience. This private island offers complete seclusion, pristine beaches, and personalized service.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1618140052121-39fc6db33972?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bG9kZ2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 10000,
    location: "Fiji",
    country: "Fiji",
    category: "Island",
    amenities: ["WiFi", "Kitchen", "Pool", "Garden", "BBQ", "Restaurant", "Bar", "Concierge", "Room Service"],
    maxGuests: 12,
    bedrooms: 6,
    bathrooms: 5,
    featured: true,
    rating: 5.0
  },
  {
    title: "Tropical Island Bungalow",
    description:
      "Escape to paradise in this charming island bungalow. Surrounded by palm trees and turquoise waters, this is the perfect place to disconnect and enjoy island life.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1602088113235-229c19758e9f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YmVhY2glMjB2YWNhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 1200,
    location: "Bora Bora",
    country: "French Polynesia",
    category: "Island",
    amenities: ["WiFi", "Kitchen", "Pool", "Garden", "BBQ", "Spa"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    featured: false,
    rating: 4.9
  },

  // ADVENTURE CATEGORY
  {
    title: "Safari Lodge in the Serengeti",
    description:
      "Experience the thrill of the wild in a comfortable safari lodge. Witness the Great Migration up close. This luxury lodge offers guided safaris, gourmet dining, and unforgettable wildlife encounters.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fG1vdW50YWlufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 4000,
    location: "Serengeti National Park",
    country: "Tanzania",
    category: "Adventure",
    amenities: ["WiFi", "Restaurant", "Bar", "Spa", "Concierge", "Room Service"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 3,
    featured: true,
    rating: 4.9
  },
  {
    title: "Rock Climbing Base Camp",
    description:
      "Perfect for adventure seekers, this base camp offers easy access to world-class rock climbing routes. After a day of climbing, relax in the hot tub and enjoy mountain views.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW91bnRhaW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 850,
    location: "Yosemite",
    country: "United States",
    category: "Adventure",
    amenities: ["WiFi", "Kitchen", "Parking", "Hot Tub", "Garden", "BBQ"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    featured: false,
    rating: 4.7
  },

  // ROMANTIC CATEGORY
  {
    title: "Romantic Vineyard Cottage",
    description:
      "Escape to this romantic cottage nestled among rolling vineyards. Perfect for couples seeking a peaceful retreat with stunning views and world-class wine tasting experiences.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 1600,
    location: "Napa Valley",
    country: "United States",
    category: "Romantic",
    amenities: ["WiFi", "Kitchen", "Parking", "Fireplace", "Garden", "BBQ", "Hot Tub"],
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    featured: false,
    rating: 4.9
  },
  {
    title: "Honeymoon Suite Overwater",
    description:
      "The ultimate romantic getaway in an overwater bungalow. Watch the sunset from your private deck, enjoy candlelit dinners, and create unforgettable memories.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGFrZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 3500,
    location: "Maldives",
    country: "Maldives",
    category: "Romantic",
    amenities: ["WiFi", "Kitchen", "Pool", "Spa", "Restaurant", "Bar", "Room Service"],
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    featured: true,
    rating: 5.0
  },

  // FAMILY CATEGORY
  {
    title: "Family-Friendly Farmhouse",
    description:
      "Perfect for families, this spacious farmhouse offers plenty of room for everyone to spread out and enjoy. Kids will love the farm animals and outdoor activities while parents relax in the peaceful countryside setting.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 1400,
    location: "Vermont",
    country: "United States",
    category: "Family",
    amenities: ["WiFi", "Kitchen", "Parking", "TV", "Washing Machine", "Garden", "BBQ"],
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3,
    featured: false,
    rating: 4.5
  },
  {
    title: "Family Resort Villa",
    description:
      "Spacious villa perfect for family vacations with kids' club, swimming pools, and endless activities. Parents can relax while children enjoy supervised fun.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 2200,
    location: "Orlando",
    country: "United States",
    category: "Family",
    amenities: ["WiFi", "Kitchen", "Parking", "Pool", "Gym", "AC", "TV", "Washing Machine", "Restaurant"],
    maxGuests: 10,
    bedrooms: 5,
    bathrooms: 4,
    featured: false,
    rating: 4.6
  },

  // SPA CATEGORY
  {
    title: "Wellness Spa Retreat",
    description:
      "Rejuvenate your mind, body, and soul at this luxurious spa retreat. This wellness-focused accommodation offers daily yoga classes, spa treatments, and healthy gourmet meals in a serene natural setting.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 2200,
    location: "Sedona",
    country: "United States",
    category: "Spa",
    amenities: ["WiFi", "Kitchen", "Parking", "Pool", "Gym", "Spa", "Sauna", "Restaurant"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    featured: true,
    rating: 4.9
  },
  {
    title: "Hot Springs Resort",
    description:
      "Soak in natural hot springs while enjoying mountain views. This wellness resort offers thermal baths, massage therapy, and meditation classes in a peaceful setting.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG90JTIwc3ByaW5nc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 1800,
    location: "Banff",
    country: "Canada",
    category: "Spa",
    amenities: ["WiFi", "Restaurant", "Spa", "Sauna", "Hot Tub", "Gym"],
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    featured: false,
    rating: 4.8
  },

  // FARM CATEGORY
  {
    title: "Working Farm Stay",
    description:
      "Experience authentic farm life with hands-on activities like milking cows, collecting eggs, and harvesting vegetables. Perfect for families and anyone wanting to connect with nature.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFybXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 750,
    location: "Iowa",
    country: "United States",
    category: "Farm",
    amenities: ["WiFi", "Kitchen", "Parking", "Garden", "BBQ"],
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    featured: false,
    rating: 4.4
  },
  {
    title: "Luxury Farm Estate",
    description:
      "Experience farm life in luxury at this stunning estate. Enjoy fresh farm-to-table meals, horseback riding, and beautiful countryside views from your elegant accommodation.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 1600,
    location: "Tuscany",
    country: "Italy",
    category: "Farm",
    amenities: ["WiFi", "Kitchen", "Parking", "Pool", "Garden", "BBQ", "Restaurant"],
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3,
    featured: false,
    rating: 4.7
  },

  // HISTORIC CATEGORY
  {
    title: "Historic Villa in Tuscany",
    description:
      "Experience the charm of Tuscany in this beautifully restored villa. Explore the rolling hills and vineyards. This centuries-old property has been lovingly restored to provide modern comfort while preserving its historic character.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 2500,
    location: "Florence",
    country: "Italy",
    category: "Historic",
    amenities: ["WiFi", "Kitchen", "Parking", "Garden", "Pool", "Spa", "Restaurant"],
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3,
    featured: true,
    rating: 4.7
  },
  {
    title: "Historic Canal House",
    description:
      "Stay in a piece of history in this beautifully preserved canal house in Amsterdam's iconic district. This 17th-century house has been carefully restored to maintain its historic charm while providing modern comfort.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FtcGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 1800,
    location: "Amsterdam",
    country: "Netherlands",
    category: "Historic",
    amenities: ["WiFi", "Kitchen", "Heating", "TV", "Balcony"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    featured: false,
    rating: 4.6
  },
  {
    title: "Charming Cottage in the Cotswolds",
    description:
      "Escape to the picturesque Cotswolds in this quaint and charming cottage with a thatched roof. This traditional English cottage offers a peaceful retreat in one of England's most beautiful regions.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1602088113235-229c19758e9f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YmVhY2glMjB2YWNhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 1200,
    location: "Cotswolds",
    country: "United Kingdom",
    category: "Historic",
    amenities: ["WiFi", "Kitchen", "Parking", "Fireplace", "Garden"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    featured: false,
    rating: 4.5
  },

  // DESERT CATEGORY
  {
    title: "Desert Oasis Villa",
    description:
      "Experience the magic of the desert in this luxurious villa surrounded by sand dunes. This stunning property offers privacy, tranquility, and breathtaking desert views with all the comforts of modern living.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 3200,
    location: "Dubai",
    country: "UAE",
    category: "Desert",
    amenities: ["WiFi", "Kitchen", "Parking", "Pool", "Gym", "AC", "Spa", "Restaurant", "Bar"],
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3,
    featured: true,
    rating: 4.8
  },
  {
    title: "Desert Camp Experience",
    description:
      "Sleep under the stars in a luxury desert camp. Experience traditional Bedouin hospitality with modern comforts, camel rides, and unforgettable desert sunsets.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1518684079-3c830dcef090?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHViYWl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 450,
    location: "Sahara Desert",
    country: "Morocco",
    category: "Desert",
    amenities: ["WiFi", "Restaurant", "Bar"],
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    featured: false,
    rating: 4.6
  },

  // BUDGET CATEGORY
  {
    title: "Budget Backpacker Hostel",
    description:
      "Perfect for budget-conscious travelers, this friendly hostel offers clean, comfortable accommodations and a great social atmosphere. Meet fellow travelers from around the world in the common areas.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1vdW50YWlufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 300,
    location: "Bangkok",
    country: "Thailand",
    category: "Budget",
    amenities: ["WiFi", "Kitchen", "AC", "TV", "Washing Machine"],
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    featured: false,
    rating: 4.2
  },
  {
    title: "Cozy Studio Apartment",
    description:
      "Affordable and comfortable studio apartment perfect for solo travelers or couples. Located in a vibrant neighborhood with easy access to public transportation and local attractions.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 450,
    location: "Berlin",
    country: "Germany",
    category: "Budget",
    amenities: ["WiFi", "Kitchen", "AC", "Heating", "TV"],
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    featured: false,
    rating: 4.3
  }
];

module.exports = { sampleListings };