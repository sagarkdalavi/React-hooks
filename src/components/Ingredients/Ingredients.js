import React, { useReducer, useCallback } from 'react'

import IngredientForm from './IngredientForm'
import IngredientList from './IngredientList'
import Search from './Search'
import ErrorModal from '../UI/ErrorModal'

const ingredientReducer = (currentIngredients, action) => {
    switch (action.type) {
        case 'SET':
            return action.ingredients
        case 'ADD':
            return [...currentIngredients, action.ingredient]
        case 'DELETE':
            return currentIngredients.filter((ing) => ing.id !== action.id)
        default:
            throw new Error('should not get there!')
    }
}

const httpReducer = (currHttpState, action) => {
    switch (action.type) {
        case 'SEND':
            return { loading: true, error: null }
        case 'RESPONSE':
            return { ...currHttpState, loading: false }
        case 'ERROR':
            return { loading: false, error: action.errorMessage }
        case 'CLEAR':
            return { ...currHttpState, error: null }
        default:
            throw new Error('should not get there!')
    }
}

const Ingredients = () => {
    const [userIngredients, dispatch] = useReducer(ingredientReducer, [])
    const [httpState, dispatchHttp] = useReducer(httpReducer, {
        loading: false,
        error: null,
    })
    //const [userIngredients, setUserIngredients] = useState([])
    //const [isLoading, setIsLoading] = useState(false)
    //const [error, setError] = useState('')
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

    const addIngredientHandler = (ingredient) => {
        //setIsLoading(true)
        dispatchHttp({ type: 'SEND' })
        fetch('https://react-hooks-d3fc1.firebaseio.com/ingredients.json', {
            method: 'POST',
            body: JSON.stringify(ingredient),
            header: { 'Content-Type': 'application/json' },
        })
            .then((response) => response.json())
            .then((responseData) => {
                dispatchHttp({ type: 'RESPONSE' })
                //setIsLoading(false)
                // setUserIngredients((preState) => [
                //     ...preState,
                //     { id: responseData.name, ...ingredient },
                // ])
                dispatch({
                    type: 'ADD',
                    ingredient: { id: responseData.name, ...ingredient },
                })
            })
            .catch((error) => {
                // setIsLoading(false)
                dispatchHttp({
                    type: 'ERROR',
                    errorMessage: 'Something went wrong',
                })

                //setError('Something went wrong')
            })
    }

    const removeIngredientHandler = (id) => {
        //setIsLoading(true)
        dispatchHttp({ type: 'SEND' })

        fetch(
            `https://react-hooks-d3fc1.firebaseio.com/ingredients/${id}.json`,
            {
                method: 'DELETE',
            }
        )
            .then((response) => {
                dispatchHttp({ type: 'RESPONSE' })

                // setIsLoading(false)
                // setUserIngredients((preState) =>
                //     preState.filter((ingredient) => ingredient.id !== id)
                // )
                dispatch({ type: 'DELETE', id: id })
            })
            .catch((error) => {
                dispatchHttp({
                    type: 'ERROR',
                    errorMessage: 'Something went wrong!',
                })

                //setIsLoading(false)
                //setError('Something went wrong')
            })
    }

    const filteredIngredientHandler = useCallback((filteredIngredient) => {
        // setUserIngredients(filteredIngredient)
        dispatch({ type: 'SET', ingredients: filteredIngredient })
    }, [])

    const clearError = () => {
        // setError(null)
        dispatchHttp({ type: 'CLEAR' })
    }

    return (
        <div className="App">
            {httpState.error && (
                <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
            )}
            <IngredientForm
                onAddIngredient={addIngredientHandler}
                loading={httpState.loading}
            />

            <section>
                <Search onLoadIngredients={filteredIngredientHandler} />
                <IngredientList
                    ingredients={userIngredients}
                    onRemoveItem={(id) => {
                        removeIngredientHandler(id)
                    }}
                />
            </section>
        </div>
    )
}

export default Ingredients
