import React, { useState, useEffect, useCallback } from 'react'

import IngredientForm from './IngredientForm'
import IngredientList from './IngredientList'
import Search from './Search'
import ErrorModal from '../UI/ErrorModal'

const Ingredients = () => {
    const [userIngredients, setUserIngredients] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
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
        setIsLoading(true)
        fetch('https://react-hooks-d3fc1.firebaseio.com/ingredients.json', {
            method: 'POST',
            body: JSON.stringify(ingredient),
            header: { 'Content-Type': 'application/json' },
        })
            .then(response => response.json())
            .then(responseData => {
                setIsLoading(false)
                setUserIngredients(preState => [
                    ...preState,
                    { id: responseData.name, ...ingredient },
                ])
            })
            .catch(error => {
                setIsLoading(false)
                setError('Something went wrong')
            })
    }

    const removeIngredientHandler = id => {
        setIsLoading(true)
        fetch(
            `https://react-hooks-d3fc1.firebaseio.com/ingredients/${id}.json`,
            {
                method: 'DELETE',
            }
        )
            .then(response => {
                setIsLoading(false)
                setUserIngredients(preState =>
                    preState.filter(ingredient => ingredient.id !== id)
                )
            })
            .catch(error => {
                setIsLoading(false)
                setError('Something went wrong')
            })
    }

    const filteredIngredientHandler = useCallback(filteredIngredient => {
        setUserIngredients(filteredIngredient)
    }, [])

    const clearError = () => {
        setError(null)
    }

    return (
        <div className="App">
            {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
            <IngredientForm
                onAddIngredient={addIngredientHandler}
                loading={isLoading}
            />

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
