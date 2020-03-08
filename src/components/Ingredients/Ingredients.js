import React, { useState } from 'react'

import IngredientForm from './IngredientForm'
import IngredientList from './IngredientList'
import Search from './Search'

const Ingredients = () => {
    const [userIngredients, setUserIngredients] = useState([])

    const addIngredientHandler = ingredient => {
        setUserIngredients(preState => [
            ...preState,
            { id: Math.random().toString(), ...ingredient },
        ])
    }

    const removeIngredientHandler = id => {
        setUserIngredients(preState =>
            preState.filter(ingredient => ingredient.id !== id)
        )
    }

    return (
        <div className="App">
            <IngredientForm onAddIngredient={addIngredientHandler} />

            <section>
                <Search />
                <IngredientList
                    ingredients={userIngredients}
                    onRemoveItem={id => {
                        removeIngredientHandler(id)
                    }}
                />
            </section>
        </div>
    )
}

export default Ingredients
