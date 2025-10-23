import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting seed...')

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12)

    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@juicebar.com' },
        update: {},
        create: {
            email: 'admin@juicebar.com',
            name: 'Admin User',
            password: hashedPassword,
            role: 'ADMIN',
        },
    })

    console.log('✅ Admin user created:', adminUser.email)

    // Create categories
    const categories = await Promise.all([
        prisma.category.upsert({
            where: { name: 'Fresh Fruits' },
            update: {},
            create: {
                name: 'Fresh Fruits',
                description: 'Fresh and organic fruits',
                isActive: true,
            },
        }),
        prisma.category.upsert({
            where: { name: 'Fresh Juices' },
            update: {},
            create: {
                name: 'Fresh Juices',
                description: 'Freshly squeezed juices',
                isActive: true,
            },
        }),
        prisma.category.upsert({
            where: { name: 'Smoothies' },
            update: {},
            create: {
                name: 'Smoothies',
                description: 'Healthy smoothies',
                isActive: true,
            },
        }),
        prisma.category.upsert({
            where: { name: 'Healthy Drinks' },
            update: {},
            create: {
                name: 'Healthy Drinks',
                description: 'Nutritious drinks',
                isActive: true,
            },
        }),
    ])

    console.log('✅ Categories created:', categories.length)

    // Create products
    const products = await Promise.all([
        // Fresh Fruits
        prisma.product.upsert({
            where: { name: 'Fresh Apple' },
            update: {},
            create: {
                name: 'Fresh Apple',
                description: 'Crispy and sweet red apples',
                price: 120.00,
                categoryId: categories[0].id,
                stock: 50,
                isActive: true,
                isFeatured: true,
            },
        }),
        prisma.product.upsert({
            where: { name: 'Banana' },
            update: {},
            create: {
                name: 'Banana',
                description: 'Fresh yellow bananas',
                price: 80.00,
                categoryId: categories[0].id,
                stock: 30,
                isActive: true,
                isFeatured: false,
            },
        }),
        prisma.product.upsert({
            where: { name: 'Orange' },
            update: {},
            create: {
                name: 'Orange',
                description: 'Juicy oranges',
                price: 100.00,
                categoryId: categories[0].id,
                stock: 40,
                isActive: true,
                isFeatured: true,
            },
        }),

        // Fresh Juices
        prisma.product.upsert({
            where: { name: 'Orange Juice' },
            update: {},
            create: {
                name: 'Orange Juice',
                description: 'Freshly squeezed orange juice',
                price: 150.00,
                categoryId: categories[1].id,
                stock: 25,
                isActive: true,
                isFeatured: true,
            },
        }),
        prisma.product.upsert({
            where: { name: 'Apple Juice' },
            update: {},
            create: {
                name: 'Apple Juice',
                description: 'Fresh apple juice',
                price: 140.00,
                categoryId: categories[1].id,
                stock: 20,
                isActive: true,
                isFeatured: false,
            },
        }),
        prisma.product.upsert({
            where: { name: 'Mango Juice' },
            update: {},
            create: {
                name: 'Mango Juice',
                description: 'Sweet mango juice',
                price: 180.00,
                categoryId: categories[1].id,
                stock: 15,
                isActive: true,
                isFeatured: true,
            },
        }),

        // Smoothies
        prisma.product.upsert({
            where: { name: 'Berry Smoothie' },
            update: {},
            create: {
                name: 'Berry Smoothie',
                description: 'Mixed berry smoothie with yogurt',
                price: 200.00,
                categoryId: categories[2].id,
                stock: 10,
                isActive: true,
                isFeatured: true,
            },
        }),
        prisma.product.upsert({
            where: { name: 'Green Smoothie' },
            update: {},
            create: {
                name: 'Green Smoothie',
                description: 'Healthy green smoothie with spinach',
                price: 180.00,
                categoryId: categories[2].id,
                stock: 12,
                isActive: true,
                isFeatured: false,
            },
        }),

        // Healthy Drinks
        prisma.product.upsert({
            where: { name: 'Coconut Water' },
            update: {},
            create: {
                name: 'Coconut Water',
                description: 'Fresh coconut water',
                price: 80.00,
                categoryId: categories[3].id,
                stock: 20,
                isActive: true,
                isFeatured: false,
            },
        }),
        prisma.product.upsert({
            where: { name: 'Lemonade' },
            update: {},
            create: {
                name: 'Lemonade',
                description: 'Fresh lemonade',
                price: 60.00,
                categoryId: categories[3].id,
                stock: 30,
                isActive: true,
                isFeatured: true,
            },
        }),
    ])

    console.log('✅ Products created:', products.length)
    console.log('🎉 Seed completed successfully!')
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
