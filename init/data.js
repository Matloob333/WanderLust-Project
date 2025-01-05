const sampleListings = [
  {
    title: "Luxury Villa",
    description: "A stunning villa with a private pool and garden.",
    image: "https://picsum.photos/800/600",
    price: 9999,
    location: "Beverly Hills",
    country: "USA",
  },
  {
    title: "Beachside Bungalow",
    description: "A serene bungalow with direct beach access.",
    image: "https://picsum.photos/800/601",
    price: 8900,
    location: "Malibu",
    country: "USA",
  },
  {
    title: "Mountain Cabin",
    description: "A rustic cabin with breathtaking mountain views.",
    image: "https://picsum.photos/800/602",
    price: 7500,
    location: "Aspen",
    country: "USA",
  },

  {
    title: "Luxury Villa",
    description: "A stunning villa with a private pool and garden.",
    image: "https://picsum.photos/800/600",
    price: 9999,
    location: "Beverly Hills",
    country: "USA",
  },
  {
    title: "Beachside Bungalow",
    description: "A serene bungalow with direct beach access.",
    image: "https://picsum.photos/800/601",
    price: 8900,
    location: "Malibu",
    country: "USA",
  },
  {
    title: "Mountain Cabin",
    description: "A rustic cabin with breathtaking mountain views.",
    image: "https://picsum.photos/800/602",
    price: 7500,
    location: "Aspen",
    country: "USA",
  },
  {
    title: "Luxury Mansion",
    description: "A grand mansion with multiple bedrooms and a large garden.",
    image: "https://picsum.photos/800/603",
    price: 87000000,
    location: "Beverly Hills",
    country: "USA",
  },
  {
    title: "Oceanfront Estate",
    description:
      "A luxurious estate with direct ocean views and a private beach.",
    image: "https://picsum.photos/800/604",
    price: 95000000,
    location: "East Hampton",
    country: "USA",
  },
  {
    title: "Modern Penthouse",
    description: "A sleek penthouse with modern amenities and city views.",
    image: "https://picsum.photos/800/605",
    price: 65000000,
    location: "New York City",
    country: "USA",
  },
  {
    title: "Rural Ranch",
    description: "A spacious ranch with acres of land and a private lake.",
    image: "https://picsum.photos/800/606",
    price: 60000000,
    location: "Bozeman",
    country: "USA",
  },
  {
    title: "Luxury Townhouse",
    description:
      "A stylish townhouse with multiple levels and a rooftop garden.",
    image: "https://picsum.photos/800/607",
    price: 45000000,
    location: "Southampton",
    country: "USA",
  },
  {
    title: "Golf Course Estate",
    description:
      "A luxurious estate located on a golf course with expansive views.",
    image: "https://picsum.photos/800/608",
    price: 47000000,
    location: "Fort Lauderdale",
    country: "USA",
  },
  {
    title: "Seaside Villa",
    description:
      "A charming villa with direct access to the beach and ocean views.",
    image: "https://picsum.photos/800/609",
    price: 39500000,
    location: "Bridgehampton",
    country: "USA",
  },
  {
    title: "Mountain Retreat",
    description:
      "A cozy retreat in the mountains with a private hot tub and fireplace.",
    image: "https://picsum.photos/800/610",
    price: 38000000,
    location: "Park City",
    country: "USA",
  },
  {
    title: "Luxury Condo",
    description: "A luxurious condo in a high-rise building with city views.",
    image: "https://picsum.photos/800/611",
    price: 43000000,
    location: "Los Angeles",
    country: "USA",
  },
  {
    title: "Estate in Windermere",
    description:
      "A modern masterpiece situated in Windermere's Reserve with lake views.",
    image: "https://picsum.photos/800/612",
    price: 11995000,
    location: "Windermere",
    country: "USA",
  },
  {
    title: "Luxury Duplex",
    description:
      "A luxurious duplex with a strong connection to the surrounding landscape.",
    image: "https://picsum.photos/800/613",
    price: 23988200,
    location: "New York City",
    country: "USA",
  },
  {
    title: "Penthouse on Madison Avenue",
    description: "A sumptuous penthouse with 11 bedrooms and 14 bathrooms.",
    image: "https://picsum.photos/800/614",
    price: 61409000,
    location: "New York City",
    country: "USA",
  },
  {
    title: "Designer Townhome",
    description:
      "A beautifully updated designer townhome in the Retreat at Desert Mountain.",
    image: "https://picsum.photos/800/615",
    price: 2350800,
    location: "Scottsdale",
    country: "USA",
  },
  {
    title: "Fully Remodeled Home",
    description:
      "A fully remodeled home in the exclusive guard-gated community of Desert Mountain.",
    image: "https://picsum.photos/800/616",
    price: 2395900,
    location: "Scottsdale",
    country: "USA",
  },
  {
    title: "Tropical Georgian Style Home",
    description:
      "A sublime two-story home in the tropical Georgian style by Palm Beach architect Thomas Kirchhoff.",
    image: "https://picsum.photos/800/617",
    price: 17223500,
    location: "Palm Beach",
    country: "USA",
  },
  {
    title: "Golf Course Estate in Coral Ridge",
    description:
      "A spectacular newer construction golf course estate in the Guard gated 'Enclave' neighborhood.",
    image: "https://picsum.photos/800/618",
    price: 8156000,
    location: "Fort Lauderdale",
    country: "USA",
  },
  {
    title: "Modern Seaside Masterpiece",
    description:
      "A stunning, single-story estate combining sleek design with waterfront luxury.",
    image: "https://picsum.photos/800/619",
    price: 11509600,
    location: "Palm Beach",
    country: "USA",
  },
  {
    title: "Modern Estate in N Grove",
    description:
      "An exceptional modern estate, perched atop a ridge 21 ft above sea level.",
    image: "https://picsum.photos/800/620",
    price: 9595300,
    location: "Miami",
    country: "USA",
  },
  {
    title: "New Construction on Coral Gables Waterway",
    description:
      "A custom-built, gated estate abounds with luxury details and craftsmanship throughout.",
    image: "https://picsum.photos/800/621",
    price: 14392900,
    location: "Coral Gables",
    country: "USA",
  },

  {
    title: "Urban Studio",
    description: "A compact studio apartment perfect for singles.",
    image:
      "https://images.unsplash.com/photo-1587502536263-05fb33a2180d?auto=format&fit=crop&w=800&q=60",
    price: 4500,
    location: "San Francisco",
    country: "USA",
  },
  {
    title: "Countryside Cottage",
    description: "A charming cottage surrounded by greenery.",
    image:
      "https://images.unsplash.com/photo-1592609930396-e2356d9f3df4?auto=format&fit=crop&w=800&q=60",
    price: 9200,
    location: "Devon",
    country: "UK",
  },
  {
    title: "Penthouse Suite",
    description: "An elegant penthouse with a panoramic city view.",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=60",
    price: 9900,
    location: "London",
    country: "UK",
  },
  {
    title: "Lakeside Retreat",
    description: "A peaceful retreat on the shores of a tranquil lake.",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=60",
    price: 8500,
    location: "Zurich",
    country: "Switzerland",
  },
  {
    title: "Modern Loft",
    description: "A stylish loft apartment in the heart of the city.",
    image:
      "https://images.unsplash.com/photo-1536305031966-672854d0c7f5?auto=format&fit=crop&w=800&q=60",
    price: 7900,
    location: "Berlin",
    country: "Germany",
  },
  {
    title: "Historic Mansion",
    description: "A grand mansion with a rich history and heritage.",
    image:
      "https://images.unsplash.com/photo-1506729623308-161f20b00dc2?auto=format&fit=crop&w=800&q=60",
    price: 9500,
    location: "Edinburgh",
    country: "Scotland",
  },
  {
    title: "Desert Oasis",
    description: "A luxurious home in the heart of the desert.",
    image:
      "https://images.unsplash.com/photo-1589571894960-20bbe2828b17?auto=format&fit=crop&w=800&q=60",
    price: 9700,
    location: "Dubai",
    country: "UAE",
  },
  {
    title: "Riverside Apartment",
    description: "An apartment overlooking the serene riverside.",
    image:
      "https://images.unsplash.com/photo-1559586610-48ef90b8da6c?auto=format&fit=crop&w=800&q=60",
    price: 7500,
    location: "Paris",
    country: "France",
  },
  {
    title: "Suburban House",
    description: "A family home in a peaceful suburban neighborhood.",
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=60",
    price: 8900,
    location: "Toronto",
    country: "Canada",
  },
  {
    title: "Cozy Townhouse",
    description: "A modern townhouse with excellent connectivity.",
    image:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=60",
    price: 8700,
    location: "Sydney",
    country: "Australia",
  },
  {
    title: "Tropical Paradise",
    description: "A vibrant property with lush tropical surroundings.",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=60",
    price: 9600,
    location: "Bali",
    country: "Indonesia",
  },
  {
    title: "Rustic Farmhouse",
    description: "A traditional farmhouse with a rustic charm.",
    image:
      "https://images.unsplash.com/photo-1570129477226-5e36b7438348?auto=format&fit=crop&w=800&q=60",
    price: 9300,
    location: "Tuscany",
    country: "Italy",
  },
  {
    title: "Skyscraper Condo",
    description: "A luxurious condo on the top floor of a skyscraper.",
    image:
      "https://images.unsplash.com/photo-1580620025631-9407e570d4ad?auto=format&fit=crop&w=800&q=60",
    price: 8800,
    location: "Hong Kong",
    country: "China",
  },
  {
    title: "Modern Duplex",
    description: "A spacious duplex with modern interiors.",
    image:
      "https://images.unsplash.com/photo-1560448204-e72f14aaef41?auto=format&fit=crop&w=800&q=60",
    price: 9500,
    location: "Singapore",
    country: "Singapore",
  },
  {
    title: "Seaside Villa",
    description: "A luxurious villa with stunning ocean views.",
    image:
      "https://images.unsplash.com/photo-1560448076-ff45fe021010?auto=format&fit=crop&w=800&q=60",
    price: 9900,
    location: "Cape Town",
    country: "South Africa",
  },
  {
    title: "Downtown Flat",
    description: "A compact flat in the city center.",
    image:
      "https://images.unsplash.com/photo-1582719508465-4b82d4b94004?auto=format&fit=crop&w=800&q=60",
    price: 8500,
    location: "Tokyo",
    country: "Japan",
  },
  {
    title: "Hilltop Cabin",
    description: "A secluded cabin with panoramic mountain views.",
    image:
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=60",
    price: 7700,
    location: "Banff",
    country: "Canada",
  },
];

module.exports = { data: sampleListings };
