export type Category = 'signature' | 'premium' | 'supreme' | 'cakes' | 'desserts' | 'pastry' | 'breads' | 'snacks';

export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: {
        [key: string]: number;
    };
    category: Category;
    image: string;
    isVeg: boolean;
}

export const menu: MenuItem[] = [
    // SIGNATURE PIZZAS
    {
        id: '1',
        name: 'Margherita Pizza',
        description: 'Pizza Sauce, Mozzarella Cheese, Finished with extra virgin olive oil',
        price: { s: 99, m: 149, l: 299 },
        category: 'signature',
        image: '/images/pizzas/margherita.png',
        isVeg: true
    },
    {
        id: '2',
        name: 'Cheese & Tomato',
        description: 'Pizza Sauce, Mozzarella Cheese, Fresh Tomato, Finished with extra virgin olive oil',
        price: { s: 109, m: 189, l: 319 },
        category: 'signature',
        image: '/images/pizzas/cheese_tomato.png',
        isVeg: true
    },
    {
        id: '3',
        name: 'Cheese & Onion',
        description: 'Pizza Sauce, Mozzarella Cheese, Fresh Onion, Finished with extra virgin olive oil',
        price: { s: 109, m: 189, l: 319 },
        category: 'signature',
        image: '/images/pizzas/cheese_onion.png',
        isVeg: true
    },
    {
        id: '4',
        name: 'Cheese & Capsicum',
        description: 'Pizza Sauce, Mozzarella Cheese, Fresh Capsicum, Finished with extra virgin olive oil',
        price: { s: 109, m: 189, l: 319 },
        category: 'signature',
        image: '/images/pizzas/cheese_capsicum.png',
        isVeg: true
    },
    {
        id: '5',
        name: 'Cheese & Corn',
        description: 'Pizza Sauce, Mozzarella Cheese, Sweet Corn, Finished with extra virgin olive oil',
        price: { s: 109, m: 189, l: 319 },
        category: 'signature',
        image: '/images/pizzas/cheese_corn.png',
        isVeg: true
    },

    // PREMIUM PIZZAS
    {
        id: '6',
        name: 'Fresh Veggies',
        description: 'Capsicum, Fresh Tomato, Finished with Pizza Sauce, Mozzarella Cheese, Onion, extra virgin olive oil',
        price: { s: 159, m: 289, l: 459 },
        category: 'premium',
        image: '/images/pizzas/fresh_veggies.png',
        isVeg: true
    },
    {
        id: '7',
        name: 'Farmfresh',
        description: 'Pizza Sauce, Mozzarella Cheese, Onion, Capsicum, Mushroom, Fresh Tomato, Finished with extra virgin olive oil',
        price: { s: 189, m: 349, l: 569 },
        category: 'premium',
        image: '/images/pizzas/farmfresh.png',
        isVeg: true
    },
    {
        id: '8',
        name: 'Deluxe Veggie',
        description: 'Pizza Sauce, Mozzarella Cheese, Sweet Corn, Onion, Capsicum, Finished with extra virgin olive oil',
        price: { s: 189, m: 349, l: 569 },
        category: 'premium',
        image: '/images/pizzas/deluxe_veggie.png',
        isVeg: true
    },
    {
        id: '9',
        name: 'Spicy Veg',
        description: 'Pizza Sauce, Mozzarella Cheese, Fresh Tomato, Jalapeno, Black Olives, Red Paprika, Finished with extra virgin olive oil',
        price: { s: 189, m: 349, l: 569 },
        category: 'premium',
        image: '/images/pizzas/spicy_veg.png',
        isVeg: true
    },

    // SUPREME PIZZAS
    {
        id: '10',
        name: 'Peppy Paneer',
        description: 'Mozzarella Cheese, Capsicum, Fresh Tomato, Red Paprika, Fresh Paneer, Finished with extra virgin olive oil',
        price: { s: 189, m: 349, l: 569 },
        category: 'supreme',
        image: '/images/pizzas/peppy_paneer.png',
        isVeg: true
    },
    {
        id: '11',
        name: 'Veg Supreme',
        description: 'Pizza Sauce, Mozzarella Cheese, Onion, Capsicum, Mushroom, Fresh Tomato, Black & Green Olives, Red Paprika, Sweet Corn, Jalapeno, Bell Peppers, Finished with extra virgin olive oil',
        price: { s: 229, m: 429, l: 649 },
        category: 'supreme',
        image: '/images/pizzas/veg_supreme.png',
        isVeg: true
    },
    {
        id: '12',
        name: 'Paneer Makhani',
        description: 'mozzarella cheese, Paneer, capsicum, makhani sauce, Finished with extra virgin olive oil',
        price: { s: 229, m: 429, l: 649 },
        category: 'supreme',
        image: '/images/pizzas/paneer_makhani.png',
        isVeg: true
    },

    // CAKES
    {
        id: 'cake-1',
        name: 'Vanilla Cake',
        description: 'Classic rich vanilla cake, prepared with love.',
        price: { 'Half': 200, '1 Pound': 300 },
        category: 'cakes',
        image: '/images/cakes/vanilla.png',
        isVeg: true
    },
    {
        id: 'cake-2',
        name: 'Butter Scotch Cake',
        description: 'Crunchy butterscotch bits and creamy frosting.',
        price: { 'Half': 200, '1 Pound': 300 },
        category: 'cakes',
        image: '/images/cakes/butter-scotch.png',
        isVeg: true
    },
    {
        id: 'cake-3',
        name: 'Pineapple Cake',
        description: 'Fresh pineapple chunks and whipped cream.',
        price: { 'Half': 200, '1 Pound': 300 },
        category: 'cakes',
        image: '/images/cakes/pineapple.png',
        isVeg: true
    },
    {
        id: 'cake-4',
        name: 'Black Forest Cake',
        description: 'Chocolate layers with cherries and cream.',
        price: { 'Half': 250, '1 Pound': 350 },
        category: 'cakes',
        image: '/images/cakes/black-forest.png',
        isVeg: true
    },
    {
        id: 'cake-5',
        name: 'Strawberry Cake',
        description: 'Delicious strawberry flavor with real fruit.',
        price: { 'Half': 250, '1 Pound': 400 },
        category: 'cakes',
        image: 'https://images.unsplash.com/photo-1602663491496-73f07481dbea?w=900&auto=format&fit=crop',
        isVeg: true
    },
    {
        id: 'cake-6',
        name: 'Blueberry Cake',
        description: 'Fresh blueberry compote and light sponge.',
        price: { 'Half': 250, '1 Pound': 400 },
        category: 'cakes',
        image: 'https://images.unsplash.com/photo-1567327613485-fbc7bf196198?w=900&auto=format&fit=crop',
        isVeg: true
    },
    {
        id: 'cake-7',
        name: 'Mango Cake',
        description: 'Seasonal mango delight with rich cream.',
        price: { 'Half': 250, '1 Pound': 400 },
        category: 'cakes',
        image: 'https://images.unsplash.com/photo-1633834704595-63d830818bfc?w=900&auto=format&fit=crop',
        isVeg: true
    },
    {
        id: 'cake-8',
        name: 'White Forest Cake',
        description: 'White chocolate shavings and vanilla cream.',
        price: { 'Half': 250, '1 Pound': 415 },
        category: 'cakes',
        image: 'https://bkmedia.bakingo.com/sq-white-forest-cake0026blac-AA.jpg?tr=w-665,h-665,dpr-1.5&q=50',
        isVeg: true
    },
    {
        id: 'cake-9',
        name: 'Choco Truffle Cake',
        description: 'Pure chocolate ganache for true chocolate lovers.',
        price: { 'Half': 250, '1 Pound': 450 },
        category: 'cakes',
        image: '/images/cakes/choco-truffle.png',
        isVeg: true
    },
    {
        id: 'cake-10',
        name: 'Choco Chips Cake',
        description: 'Loaded with chocolate chips and creamy layers.',
        price: { 'Half': 250, '1 Pound': 500 },
        category: 'cakes',
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=900&auto=format&fit=crop',
        isVeg: true
    },
    {
        id: 'cake-11',
        name: 'Choco Fantasy Cake',
        description: 'A magical chocolate experience.',
        price: { 'Half': 250, '1 Pound': 500 },
        category: 'cakes',
        image: 'https://images.unsplash.com/photo-1695649912701-e8431668040f?w=900&auto=format&fit=crop',
        isVeg: true
    },
    {
        id: 'cake-12',
        name: 'Red Velvet Cake',
        description: 'Classic red velvet with cream cheese frosting.',
        price: { 'Half': 250, '1 Pound': 500 },
        category: 'cakes',
        image: 'https://images.unsplash.com/photo-1602630209855-dceac223adfe?w=900&auto=format&fit=crop',
        isVeg: true
    },
    {
        id: 'cake-13',
        name: 'Fresh Fruits Cake',
        description: 'Abundance of seasonal fresh fruits on top.',
        price: { 'Half': 400, '1 Pound': 550 },
        category: 'cakes',
        image: '/images/cakes/fresh-fruits.png',
        isVeg: true
    },

    // PASTRY
    {
        id: 'pastry-1',
        name: 'Vanilla Pastry',
        description: 'Single serving of classic vanilla cake.',
        price: { 'Mini': 30, 'Regular': 50 },
        category: 'pastry',
        image: '/images/products/vanilla_pastry.png',
        isVeg: true
    },
    {
        id: 'pastry-2',
        name: 'Butter Scotch Pastry',
        description: 'Butterscotch flavored pastry.',
        price: { 'Mini': 30, 'Regular': 50 },
        category: 'pastry',
        image: '/images/products/Butter Scotch Pastry.png',
        isVeg: true
    },
    {
        id: 'pastry-3',
        name: 'Pineapple Pastry',
        description: 'Fresh pineapple pastry layer.',
        price: { 'Mini': 30, 'Regular': 50 },
        category: 'pastry',
        image: 'https://images.unsplash.com/photo-1643910509872-78bc24a2bc53?q=80&w=1000&auto=format&fit=crop',
        isVeg: true
    },
    {
        id: 'pastry-4',
        name: 'Black Forest Pastry',
        description: 'Chocolate and cherry pastry.',
        price: { 'Mini': 35, 'Regular': 55 },
        category: 'pastry',
        image: '/images/products/blackForest_pastry.png',
        isVeg: true
    },
    {
        id: 'pastry-5',
        name: 'Strawberry Pastry',
        description: 'Strawberry cream pastry.',
        price: { 'Mini': 35, 'Regular': 55 },
        category: 'pastry',
        image: 'https://images.unsplash.com/photo-1565685715007-06f2c4c44d19?q=80&w=1000&auto=format&fit=crop',
        isVeg: true
    },
    {
        id: 'pastry-6',
        name: 'Mango Pastry',
        description: 'Creamy mango flavored pastry.',
        price: { 'Mini': 35, 'Regular': 55 },
        category: 'pastry',
        image: '/images/products/Mango_Pastry.png',
        isVeg: true
    },
    {
        id: 'pastry-7',
        name: 'Choco Truffle Pastry',
        description: 'Rich chocolate ganache pastry.',
        price: { 'Mini': 40, 'Regular': 65 },
        category: 'pastry',
        image: 'https://images.unsplash.com/photo-1607257882338-70f7dd2ae344?q=80&w=1000&auto=format&fit=crop',
        isVeg: true
    },
    {
        id: 'pastry-8',
        name: 'Choco Chips Pastry',
        description: 'Pastry loaded with chocolate chips.',
        price: { 'Regular': 65 },
        category: 'pastry',
        image: 'https://images.unsplash.com/photo-1772729410443-6caac5901ab2?q=80&w=1000&auto=format&fit=crop',
        isVeg: true
    },
    {
        id: 'pastry-9',
        name: 'Red Velvet Pastry',
        description: 'Red velvet slice with cream cheese.',
        price: { 'Regular': 70 },
        category: 'pastry',
        image: 'https://images.unsplash.com/photo-1621164078472-1d59a47f63dd?q=80&w=1000&auto=format&fit=crop',
        isVeg: true
    },

    // DESSERTS
    {
        id: 'dessert-1',
        name: 'Vanilla Muffins',
        description: 'Soft and fluffy vanilla muffins.',
        price: { 'Regular': 15 },
        category: 'desserts',
        image: '/images/products/Vanilla Muffins.png',
        isVeg: true
    },
    {
        id: 'dessert-2',
        name: 'Chocolate Muffins',
        description: 'Rich chocolate muffins.',
        price: { 'Regular': 20 },
        category: 'desserts',
        image: '/images/products/Chocolate Muffins.png',
        isVeg: true
    },
    {
        id: 'dessert-3',
        name: 'Donut',
        description: 'Glazed sweet donut.',
        price: { 'Regular': 50 },
        category: 'desserts',
        image: '/images/products/donut.png',
        isVeg: true
    },
    {
        id: 'dessert-4',
        name: 'Vanilla Cream Roll',
        description: 'Crispy roll with vanilla cream.',
        price: { 'Regular': 20 },
        category: 'desserts',
        image: '/images/products/Vanilla Cream Roll.png',
        isVeg: true
    },
    {
        id: 'dessert-5',
        name: 'Chocolate Cream Roll',
        description: 'Crispy roll with chocolate cream.',
        price: { 'Regular': 25 },
        category: 'desserts',
        image: '/images/products/Chocolate Cream Roll.png',
        isVeg: true
    },
    {
        id: 'dessert-6',
        name: 'Choco Lava',
        description: 'Warm chocolate cake with molten center.',
        price: { 'Regular': 50 },
        category: 'desserts',
        image: '/images/products/Choco Lava.png',
        isVeg: true
    },
    {
        id: 'dessert-7',
        name: 'Brownie',
        description: 'Classic chocolate brownie.',
        price: { 'Regular': 65 },
        category: 'desserts',
        image: '/images/products/Brownie.png',
        isVeg: true
    },
    {
        id: 'dessert-8',
        name: 'Mix Mousse',
        description: 'Light and airy mixed flavor mousse.',
        price: { 'Regular': 60 },
        category: 'desserts',
        image: '/images/products/Mix Mousse.png',
        isVeg: true
    },
    {
        id: 'dessert-9',
        name: 'Chocolate Mousse',
        description: 'Rich chocolate mousse.',
        price: { 'Regular': 60 },
        category: 'desserts',
        image: '/images/products/Chocolate Mousse.png',
        isVeg: true
    },
    {
        id: 'dessert-10',
        name: 'Black Forest Pudding',
        description: 'Layered black forest pudding.',
        price: { 'Regular': 30 },
        category: 'desserts',
        image: '/images/products/Black Forest Pudding.png',
        isVeg: true
    },
    {
        id: 'dessert-11',
        name: 'Strawberry Pudding',
        description: 'Fresh strawberry pudding.',
        price: { 'Regular': 30 },
        category: 'desserts',
        image: '/images/products/Strawberry Pudding.png',
        isVeg: true
    },
    {
        id: 'dessert-12',
        name: 'Chocolate Cone',
        description: 'Creamy chocolate in a cone.',
        price: { 'Regular': 50 },
        category: 'desserts',
        image: '/images/products/chocolate cone.png',
        isVeg: true
    },
    {
        id: 'dessert-13',
        name: 'Death By Chocolate',
        description: 'Extreme chocolate indulgence.',
        price: { 'Regular': 55 },
        category: 'desserts',
        image: '/images/products/Death By Chocolate.png',
        isVeg: true
    },

    // BREADS
    {
        id: 'bread-1',
        name: 'White Bread',
        description: 'Freshly baked white bread.',
        price: { 'Regular': 35 },
        category: 'breads',
        image: 'https://images.unsplash.com/photo-1592029780368-c1fff15bcfd5?q=80&w=2069&auto=format&fit=crop',
        isVeg: true
    },
    {
        id: 'bread-2',
        name: 'Brown Bread',
        description: 'Healthy brown bread.',
        price: { 'Regular': 40 },
        category: 'breads',
        image: '/images/products/Brown Bread.png',
        isVeg: true
    },
    {
        id: 'bread-3',
        name: 'Masala Bread',
        description: 'Spiced masala bread.',
        price: { 'Regular': 25 },
        category: 'breads',
        image: '/images/products/masala bread..png',
        isVeg: true
    },

    // SNACKS
    {
        id: 'snack-1',
        name: 'Veg Puff',
        description: 'Crispy vegetable puff.',
        price: { 'Regular': 25 },
        category: 'snacks',
        image: '/images/products/veg puff .png',
        isVeg: true
    },
    {
        id: 'snack-2',
        name: 'Paneer Puff',
        description: 'Delicious paneer puff.',
        price: { 'Regular': 30 },
        category: 'snacks',
        image: '/images/products/Paneer Puff .png',
        isVeg: true
    },
    {
        id: 'snack-3',
        name: 'Veg Roll',
        description: 'Spiced vegetable roll.',
        price: { 'Regular': 30 },
        category: 'snacks',
        image: '/images/products/Veg Roll.png',
        isVeg: true
    },
    {
        id: 'snack-4',
        name: 'Paneer Roll',
        description: 'Tasty paneer roll.',
        price: { 'Regular': 60 },
        category: 'snacks',
        image: '/images/products/Paneer Roll .png',
        isVeg: true
    },
    {
        id: 'snack-5',
        name: 'Franky Roll',
        description: 'Classic franky roll.',
        price: { 'Regular': 50 },
        category: 'snacks',
        image: '/images/products/Franky Roll .png',
        isVeg: true
    },
    {
        id: 'snack-6',
        name: 'Veg Sandwich',
        description: 'Fresh vegetable sandwich.',
        price: { 'Regular': 25 },
        category: 'snacks',
        image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=1000&auto=format&fit=crop&q=80',
        isVeg: true
    },
    {
        id: 'snack-7',
        name: 'Paneer Sandwich',
        description: 'Rich paneer sandwich.',
        price: { 'Regular': 35 },
        category: 'snacks',
        image: '/images/products/Paneer Sandwich.png',
        isVeg: true
    },
    {
        id: 'snack-8',
        name: 'Veg Pizza (Snack)',
        description: 'Small vegetable snack pizza.',
        price: { 'Regular': 60 },
        category: 'snacks',
        image: '/images/products/Veg Pizza (Snack).png',
        isVeg: true
    },
    {
        id: 'snack-9',
        name: 'Paneer Pizza (Snack)',
        description: 'Small paneer snack pizza.',
        price: { 'Regular': 80 },
        category: 'snacks',
        image: '/images/products/Paneer Pizza (Snack).png',
        isVeg: true
    },
    {
        id: 'snack-10',
        name: 'Mushroom Pizza (Snack)',
        description: 'Small mushroom snack pizza.',
        price: { 'Regular': 80 },
        category: 'snacks',
        image: '/images/products/Mushroom Pizza (Snack).png',
        isVeg: true
    },
    {
        id: 'snack-11',
        name: 'Baby Corn Pizza (Snack)',
        description: 'Small baby corn snack pizza.',
        price: { 'Regular': 80 },
        category: 'snacks',
        image: '/images/products/Baby Corn Pizza (Snack).png',
        isVeg: true
    },
    {
        id: 'snack-12',
        name: 'TLB Special Pizza (Snack)',
        description: 'Small special snack pizza.',
        price: { 'Regular': 150 },
        category: 'snacks',
        image: 'https://images.unsplash.com/photo-1681567604770-0dc826c870ae?w=1000&auto=format&fit=crop&q=80',
        isVeg: true
    },
    {
        id: 'snack-13',
        name: 'Burger',
        description: 'Classic veg burger.',
        price: { 'Regular': 50 },
        category: 'snacks',
        image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=1000&auto=format&fit=crop&q=80',
        isVeg: true
    },
    {
        id: 'snack-14',
        name: 'Hot Dog',
        description: 'Vegetarian hot dog.',
        price: { 'Regular': 45 },
        category: 'snacks',
        image: '/images/products/Hot Dog.png',
        isVeg: true
    },
    {
        id: 'snack-15',
        name: 'Methi Kulcha',
        description: 'Freshly made methi kulcha.',
        price: { 'Regular': 60 },
        category: 'snacks',
        image: '/images/products/Methi Kulcha.png',
        isVeg: true
    },
];
