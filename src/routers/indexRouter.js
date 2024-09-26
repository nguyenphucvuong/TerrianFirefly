
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import HomeRouter from './homeRouter'

const IndexRouter = () => {


    return (
        <NavigationContainer >
            <HomeRouter />
        </NavigationContainer>
    )
}

export default IndexRouter
