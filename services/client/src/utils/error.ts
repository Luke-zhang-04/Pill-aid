export const isErrorLike = (obj: unknown): obj is {name: string; message: string} =>
    obj instanceof Error ||
    (typeof obj === "object" &&
        typeof (obj as {[key: string]: unknown}).name === "string" &&
        typeof (obj as {[key: string]: unknown}).message === "string")

export const createError = (obj: unknown): Error => {
    if (obj instanceof Error) {
        return obj
    } else if (isErrorLike(obj)) {
        const error = new Error(obj.message)

        error.name = obj.name

        return error
    }

    return new Error(JSON.stringify(obj))
}

export const handleError = (err: unknown): void => {
    console.error(err)
}

export const catcherPromise = async <T>(func: () => Promise<T>): Promise<T | Error> => {
    try {
        return await func()
    } catch (err) {
        handleError(err)

        return createError(err)
    }
}

export const catcher = <T>(func: () => T): T | undefined => {
    try {
        return func()
    } catch (err) {
        handleError(err)

        return
    }
}

export default catcherPromise
