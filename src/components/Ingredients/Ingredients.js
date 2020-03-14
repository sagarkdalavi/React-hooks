import React, { useState, useEffect, useCallback } from 'react'

import IngredientForm from './IngredientForm'
import IngredientList from './IngredientList'
import Search from './Search'

const Ingredients = () => {
    const [userIngredients, setUserIngredients] = useState([])

    // useEffect(() => {
    //     fetch('https://react-hooks-d3fc1.firebaseio.com/ingredients.json')
    //         .then(response => response.json())
    //         .then(responseData => {
    //             console.log('response data:', responseData)
    //             const loadingIngredients = []
    //             for (const key in responseData) {
    //                 loadingIngredients.push({
    //                     id: key,
    //                     title: responseData[key].title,
    //                     amount: responseData[key].amount,
    //                 })
    //             }
    //             setUserIngredients(loadingIngredients)
    //         })
    // }, [])

    const addIngredientHandler = ingredient => {
        fetch('https://react-hooks-d3fc1.firebaseio.com/ingredients.json', {
            method: 'POST',
            body: JSON.stringify(ingredient),
            header: { 'Content-Type': 'application/json' },
        })
            .then(response => response.json())
            .then(responseData => {
                setUserIngredients(preState => [
                    ...preState,
                    { id: responseData.name, ...ingredient },
                ])
            })
    }

    const removeIngredientHandler = id => {
        setUserIngredients(preState =>
            preState.filter(ingredient => ingredient.id !== id)
        )
    }

    const filteredIngredientHandler = useCallback(filteredIngredient => {
        setUserIngredients(filteredIngredient)
    }, [])
    return (
        <div className="App">
            <IngredientForm onAddIngredient={addIngredientHandler} />

            <section>
                <Search onLoadIngredients={filteredIngredientHandler} />
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
