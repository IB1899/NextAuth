//! We define the types here in this file 
//! We don't need to export or import the types, we immediately use them
//! Don't import any thing here


interface session {
    success: string,
    token: string,
    _id: string,
    email: string,
}

type SignInObject = {
    name: string
    email: string,
    password: string,
}

interface User {
    _id: string,
    email: string,
    password: string,
    createdAt: string
    updatedAt: string
}


