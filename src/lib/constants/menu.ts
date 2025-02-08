export const BOWL_SIZES = {
  REGULAR: {
    name: 'Regular',
    price: 12.99,
    calories: 350
  },
  LARGE: {
    name: 'Large',
    price: 15.99,
    calories: 500
  }
}

export const DEFAULT_TOPPINGS = {
  REGULAR: ['Granola', 'Berries'],
  LARGE: ['Granola', 'Berries', 'Honey']
}

export const TOPPINGS = {
  FRUITS: [
    {
      id: 'strawberries',
      name: 'Organic Strawberries',
      calories: 25,
      defaultAmount: '4-5 pieces',
    },
    {
      id: 'blueberries',
      name: 'Organic Blueberries',
      calories: 20,
      defaultAmount: '15-20 pieces',
    },
    {
      id: 'banana',
      name: 'Organic Banana',
      calories: 50,
      defaultAmount: '1/2 banana',
    },
  ],
  SUPERFOODS: [
    {
      id: 'chia-seeds',
      name: 'Organic Chia Seeds',
      calories: 35,
      defaultAmount: '1 tsp',
      maxAmount: '2 tsp',
    },
    {
      id: 'granola',
      name: 'Organic Gluten-Free Granola',
      calories: 35,
      defaultAmount: '1 tsp',
      maxAmount: '2 tsp',
    },
    {
      id: 'coconut',
      name: 'Organic Coconut Shreds',
      calories: 20,
      defaultAmount: '1/2 tsp',
      maxAmount: '1 tsp',
    },
  ],
  SWEETENERS: [
    {
      id: 'honey',
      name: 'Organic Honey',
      calories: 20,
      defaultAmount: '1/2 tsp',
      maxAmount: '1 tsp',
      optional: true,
    },
  ],
} 