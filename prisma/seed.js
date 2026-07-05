const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const hotelsData = [
  {
    id: "sanhida-id",
    slug: "sanhida",
    name: "Sanhida Guest House",
    location: "Nugegoda, Sri Lanka",
    description: "A comfortable guest house ideal for families and short stays. Day-out and overnight packages available with easy access to parks and shopping areas.",
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80",
    facilities: "A/C Rooms, Non AC Rooms, Attached Bathroom, Free Parking, TV, Free WiFi, Living Area",
    nearbyPlaces: "Weli Park, Diyagama Wetland Park, Rampart Wetland Park, Shopping Areas Nugegoda",
    hasDayoutRates: true,
    rooms: [
      {
        id: "sanhida-r1",
        roomName: "Non A/C Double Room",
        price: 3500,
        dayoutPrice: 3000,
        capacity: 2,
        status: "Available",
        image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80",
        facilities: "Non AC, Attached Bathroom, TV, WiFi"
      },
      {
        id: "sanhida-r2",
        roomName: "A/C Double Room",
        price: 6000,
        dayoutPrice: 6000,
        capacity: 2,
        status: "Available",
        image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
        facilities: "AC, Attached Bathroom, TV, WiFi"
      },
      {
        id: "sanhida-r3",
        roomName: "Non A/C Family Room",
        price: 6000,
        capacity: 4,
        status: "Available",
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
        facilities: "Non AC, Attached Bathroom, TV, WiFi, Living Area"
      },
      {
        id: "sanhida-r4",
        roomName: "A/C Family Room",
        price: 7500,
        capacity: 4,
        status: "Available",
        image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
        facilities: "AC, Attached Bathroom, TV, WiFi, Living Area"
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
    facilities: "A/C Rooms, Non AC Rooms, Attached Bathroom, Hot Water, Kitchen Area, TV, Free WiFi, Living Area",
    nearbyPlaces: "Diyatha Uyana, Diyasaru Park, Ape Gama, Passport Office",
    hasDayoutRates: false,
    gallery: JSON.stringify([
      { url: "/images/lake-garden/double-room-2.jpeg", title: "Double Room", category: "Rooms" },
      { url: "/images/lake-garden/living-area.jpeg", title: "Living Area", category: "Apartment" },
      { url: "/images/lake-garden/aesthetic-3.jpeg", title: "Garden Shrine", category: "Ambience" }
    ]),
    rooms: [
      {
        id: "lake-r1",
        roomName: "A/C Double Room",
        price: 6000,
        capacity: 2,
        status: "Available",
        image: "/images/lake-garden/double-room.jpeg",
        facilities: "AC, Attached Bathroom, Hot Water, TV, WiFi"
      },
      {
        id: "lake-r2",
        roomName: "A/C Double Room (Shared Bathroom)",
        price: 4500,
        capacity: 2,
        status: "Available",
        image: "/images/lake-garden/double-room-2.jpeg",
        facilities: "AC, Shared Bathroom, Hot Water, TV, WiFi"
      },
      {
        id: "lake-r3",
        roomName: "Family Room",
        price: 7500,
        capacity: 4,
        status: "Available",
        image: "/images/lake-garden/family-room.jpeg",
        facilities: "AC, Attached Bathroom, Hot Water, TV, WiFi"
      },
      {
        id: "lake-r4",
        roomName: "Villa Type Apartment",
        price: 12000,
        capacity: 6,
        status: "Available",
        image: "/images/lake-garden/apartment-family-room.jpeg",
        facilities: "AC, Kitchen Area, Living Area, Hot Water, TV, WiFi"
      }
    ]
  },
  {
    id: "city-heaven-id",
    slug: "city-heaven",
    name: "City Heaven Villa",
    location: "Colombo, Sri Lanka",
    description: "A spacious villa property perfect for large groups and family gatherings. Full villa hire available alongside individual room bookings.",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
    facilities: "A/C Rooms, Non AC Rooms, Attached Bathroom, Hot Water, Kitchen Area, TV, Free WiFi, Living Area",
    rooms: [
      {
        id: "city-r1",
        roomName: "Full Villa (20 Persons)",
        price: 25000,
        capacity: 20,
        status: "Available",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
        facilities: "AC, Kitchen Area, Living Area, Hot Water, TV, WiFi"
      },
      {
        id: "city-r2",
        roomName: "A/C Double Room",
        price: 6000,
        capacity: 2,
        status: "Available",
        image: "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80",
        facilities: "AC, Attached Bathroom, Hot Water, TV, WiFi"
      },
      {
        id: "city-r3",
        roomName: "Non A/C Double Room",
        price: 4000,
        capacity: 2,
        status: "Available",
        image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
        facilities: "Non AC, Attached Bathroom, TV, WiFi"
      },
      {
        id: "city-r4",
        roomName: "Family Room",
        price: 7500,
        capacity: 4,
        status: "Available",
        image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
        facilities: "AC, Attached Bathroom, Hot Water, TV, WiFi, Living Area"
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
    facilities: "A/C Rooms, Non AC Rooms, Attached Bathroom, Free Parking, TV, Free WiFi, Living Area",
    nearbyPlaces: "Mount Lavinia Beach, Mount Lavinia Hotel, Dehiwala Zoo, Airport Rathmalana",
    hasDayoutRates: true,
    rooms: [
      {
        id: "option-r1",
        roomName: "Non A/C Double Room",
        price: 3500,
        dayoutPrice: 3000,
        capacity: 2,
        status: "Available",
        image: "https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&w=800&q=80",
        facilities: "Non AC, Attached Bathroom, TV, WiFi"
      },
      {
        id: "option-r2",
        roomName: "A/C Double Room",
        price: 5000,
        dayoutPrice: 5000,
        capacity: 2,
        status: "Available",
        image: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=800&q=80",
        facilities: "AC, Attached Bathroom, TV, WiFi"
      },
      {
        id: "option-r3",
        roomName: "Non A/C Family Room",
        price: 4500,
        capacity: 4,
        status: "Available",
        image: "https://images.unsplash.com/photo-1482463084273-982f7f066efc?auto=format&fit=crop&w=800&q=80",
        facilities: "Non AC, Attached Bathroom, TV, WiFi, Living Area"
      }
    ]
  }
];

async function main() {
  console.log('Seeding hotels and rooms data...');
  for (const h of hotelsData) {
    await prisma.hotel.upsert({
      where: { id: h.id },
      update: {
        name: h.name,
        slug: h.slug,
        location: h.location,
        description: h.description,
        image: h.image,
        facilities: h.facilities,
        nearbyPlaces: h.nearbyPlaces || null,
        gallery: h.gallery || null,
        hasDayoutRates: h.hasDayoutRates || false,
      },
      create: {
        id: h.id,
        slug: h.slug,
        name: h.name,
        location: h.location,
        description: h.description,
        image: h.image,
        facilities: h.facilities,
        nearbyPlaces: h.nearbyPlaces || null,
        gallery: h.gallery || null,
        hasDayoutRates: h.hasDayoutRates || false,
        rooms: {
          create: h.rooms.map(r => ({
            id: r.id,
            roomName: r.roomName,
            price: r.price,
            capacity: r.capacity,
            status: r.status,
            image: r.image,
            facilities: r.facilities
          }))
        }
      }
    });

    for (const r of h.rooms) {
      await prisma.room.upsert({
        where: { id: r.id },
        update: {
          roomName: r.roomName,
          price: r.price,
          dayoutPrice: r.dayoutPrice ?? null,
          capacity: r.capacity,
          status: r.status,
          image: r.image,
          facilities: r.facilities,
          hotelId: h.id,
        },
        create: {
          id: r.id,
          roomName: r.roomName,
          price: r.price,
          dayoutPrice: r.dayoutPrice ?? null,
          capacity: r.capacity,
          status: r.status,
          image: r.image,
          facilities: r.facilities,
          hotelId: h.id,
        }
      });
    }
  }
  console.log('Seed completed successfully!');

  // Seed Admin accounts
  console.log('Seeding admin accounts...');
  const admins = [
    {
      id: 'admin-001',
      name: 'Kumara Admin',
      email: 'admin@kumarahotels.com',
      password: 'admin123',
      employeeId: 'ADMIN001',
      role: 'admin',
      hasAccess: true,
    },
    {
      id: 'admin-002',
      name: 'Front Desk Manager',
      email: 'manager@kumarahotels.com',
      password: 'manager123',
      employeeId: 'MGR001',
      role: 'manager',
      hasAccess: true,
    },
    {
      id: 'admin-003',
      name: 'Reception Staff',
      email: 'staff@kumarahotels.com',
      password: 'staff123',
      employeeId: 'STAFF001',
      role: 'staff',
      hasAccess: true,
    },
  ];

  for (const admin of admins) {
    await prisma.admin.upsert({
      where: { id: admin.id },
      update: {
        name: admin.name,
        email: admin.email,
        password: admin.password,
        employeeId: admin.employeeId,
        role: admin.role,
        hasAccess: admin.hasAccess,
      },
      create: admin,
    });
  }
  console.log('Admin accounts seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
