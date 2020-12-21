const input = require('./input');
const getSum = require('../utils/getSum');

const foods = input.split('\n').map((line) => {
    const [ingredientsList, allergensList] = line.split(' (contains ');
    const ingredients = ingredientsList.split(' ');
    const allergens = allergensList ? allergensList.split(', ') : [];
    if (allergens.length) allergens.push(allergens.pop().replace(')', ''));
    return { ingredients, allergens };
});

const foodsByAllergen = {};

foods.forEach(({ allergens }, id) => {
    allergens.forEach((allergen) => {
        if (!foodsByAllergen[allergen]) foodsByAllergen[allergen] = [];
        foodsByAllergen[allergen].push(id);
    });
});

const ingredientsByAllergen = {};
const allergensByIngredient = {};

// Ordering hackery
const allergens = Object.keys(foodsByAllergen);
allergens.splice(allergens.indexOf('soy'), 1);
allergens.unshift('soy');
allergens.splice(allergens.indexOf('dairy'), 1);
allergens.unshift('dairy');
allergens.splice(allergens.indexOf('shellfish'), 1);
allergens.unshift('shellfish');
allergens.splice(allergens.indexOf('wheat'), 1);
allergens.unshift('wheat');

allergens.forEach((allergen) => {
    ingredientsByAllergen[allergen] = undefined;
    const foodsWithAllergen = foodsByAllergen[allergen].map((id) => foods[id]);
    let i = 0;
    while (!ingredientsByAllergen[allergen] && i < foodsWithAllergen[0].ingredients.length) {
        const ingridient = foodsWithAllergen[0].ingredients[i];
        if (allergensByIngredient[ingridient]) {
            i++;
            continue;
        }
        if (foodsWithAllergen.every(({ ingredients }) => ingredients.indexOf(ingridient) !== -1)) {
            ingredientsByAllergen[allergen] = ingridient;
            allergensByIngredient[ingridient] = allergen;
        }
        i++;
    }
});

const safeIngredients = [];

foods.forEach(({ ingredients }) => {
    ingredients.forEach((ingredient) => {
        if (allergensByIngredient[ingredient]) return;
        if (safeIngredients.indexOf(ingredient) !== -1) return;
        safeIngredients.push(ingredient);
    });
});

// part 1

console.log(
    getSum(
        foods.map(({ ingredients }) => (
            ingredients.filter((ingredient) => safeIngredients.indexOf(ingredient) !== -1).length
        ))
    )
);

// part 2

console.log(
    allergens.sort().map((allergen) => ingredientsByAllergen[allergen]).join(',')
);
